<template>
  <a-card :bordered="false">
    <a-drawer
      title="搜索"
      :width="500"
      @close="searchClose"
      :visible="searchVisible"
      :mask="true"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
    </a-drawer>

    <search-form-generator
      ref="search"
      :defaultShowCount="1"
      :fields="searchFormData"
      @handleSubmit="handleSearch" v-permission:adminListquery></search-form-generator>

    <template slot="footer">
      <br>
      <div
        class="drawer-form-footer"
      >
        <a-button
          type="primary"
          html-type="submit"
          :loading="searchLoading"
        >
          搜索
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="handleSearchReset"
        >
          重置
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="searchClose"
        >
          关闭
        </a-button>
      </div>
    </template>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCreate" v-permission:adminListadd>新建</a-button>
      <a-button type="primary" icon="reload" @click="() => { this.$refs['table'].refresh() }">刷新</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown  v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item key="delete" v-permission:adminListdelete>
            <a-popconfirm title="确定删除选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'delete'})">
              <div><a-icon type="delete" /> 删除</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_yes" v-permission:adminListenable>
            <a-popconfirm title="确定显示选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_yes'})">
              <div ><a-icon type="eye" /> 显示</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_no" v-permission:adminListdisable>
            <a-popconfirm title="确定禁止选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_no'})">
              <div ><a-icon type="eye-invisible" /> 禁止</div>
            </a-popconfirm>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

    </div>

    <s-table
      ref="table"
      rowKey="id"
      bordered
      size="small"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="tableScroll"
    >

      <span slot="status" slot-scope="text, record">
        <a-tag :color="text | statusFilter">{{ record.status_text }}</a-tag>
      </span>

      <span slot="roles" slot-scope="text, record">
        <a-tag :key="index" v-for="(role, index) in record.roles">{{ role.title }}</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-show="record.id !== 1 || userInfo.id === 1" v-permission:adminListedit>编辑</a>
        <a-divider type="vertical" />
        <a-dropdown v-show="record.id !== 1">
          <a class="ant-dropdown-link">更多</a>
          <a-menu slot="overlay" >

            <a-menu-item key="delete" v-permission:adminListdelete>
              <a-popconfirm title="确定删除?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('delete', record)">
                <a-icon type="delete" /> 删除
              </a-popconfirm>
            </a-menu-item>

            <a-menu-item key="status_yes" v-if="record.status == 0" v-permission:adminListenable>
              <a-popconfirm title="确定显示?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_yes', record)">
                <a-icon type="eye" /> 显示
              </a-popconfirm>
            </a-menu-item>

            <a-menu-item key="status_no" v-if="record.status == 1" v-permission:adminListdisable>
              <a-popconfirm title="确定禁止?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_no', record)">
                <a-icon type="eye-invisible" /> 禁止
              </a-popconfirm>
            </a-menu-item>

          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-drawer
      :title="formTitle"
      :width="formWidth"
      @close="formClose"
      :visible="formVisible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >

      <form-generator
        ref="form"
        @handleSubmit="handleSubmit"
        :fields="formData"
      >
        <template slot="footer">
          <br>
          <div
            class="drawer-form-footer"
          >
            <a-button
              type="primary"
              html-type="submit"
              :loading="formLoading"
            >
              提交
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="formClose"
            >
              关闭
            </a-button>
          </div>
        </template>
      </form-generator>

    </a-drawer>

  </a-card>
</template>

<script>

import { httpResponseCode } from '@/constants/httpResponseCode'
import { getUserList, userCreate, userUpdate, userDelete } from '@/modules/user/api/admin'
import { roleOptions } from '@/modules/user/api/role'
import { STable } from '@/components'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'
import httpResponse from '@/mixins/httpResponse'
import DataView from '@/components/DataView/DataView'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'
import { defaultFormData, defaultSearchFormData, columns } from './form'

const STATUS_YES = 1
const STATUS_NO = 0

export default {
  name: 'AdminList',
  components: {
    STable,
    SingleImageUpload,
    DataView
  },
  mixins: [httpResponse],
  data () {
    const vm = this

    return {
      tableScroll: { x: 1200 },
      formTitle: '修改',
      formWidth: '720',
      formVisible: false,
      formLoading: false,
      searchLoading: false,
      searchVisible: false,
      loading: false,
      isEdit: 0,
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        vm.pageParam = parameter
        return getUserList(Object.assign(parameter, { search: vm.queryParam }))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          getCheckboxProps: record => ({
            props: {
              disabled: record.id === 1,
              id: record.id + ''
            }
          })
        }
      },
      optionAlertShow: false,
      userOptions: [],
      pageParam: 1,
      formData: {},
      searchFormData: defaultSearchFormData,
      userInfo: this.$store.getters.userInfo,
      roleOptions: []
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        0: '#f50',
        1: '#87d068'
      }

      return statusMap[status]
    },
    modalTitleFilter (status) {
      const statusMap = {
        0: '创建',
        1: '编辑'
      }
      return statusMap[status]
    }
  },
  created () {
    this.searchFormData = _.cloneDeep(defaultSearchFormData)
    this.getRoleOptions()
  },
  methods: {
    tableOption () {
      this.optionAlertShow = !this.optionAlertShow
      if (this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.options.rowSelection.getCheckboxProps
          }
        }
      } else {
        this.options = {
          alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.options.rowSelection.getCheckboxProps
          }
        }
      }
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    restSearchForm () {
      this.searchFormData = _.cloneDeep(defaultSearchFormData)
    },

    handleTableTopBarAction ({ key }) {
      if (key === 'delete') {
        this.handleDelete(this.selectedRowKeys)
      } else if (key === 'status_yes') {
        this.handleUpdate({ id: this.selectedRowKeys, status: STATUS_YES })
      } else if (key === 'status_no') {
        this.handleUpdate({ id: this.selectedRowKeys, status: STATUS_NO })
      }
    },

    handleTableRowBarAction (key, row) {
      if (key === 'delete') {
        this.handleDelete(row.id)
      } else if (key === 'status_yes') {
        this.handleStatus(row, STATUS_YES)
      } else if (key === 'status_no') {
        this.handleStatus(row, STATUS_NO)
      }
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)
      this.formData.password['rules'] = [{ required: true, message: '不能为空' }]
      this.formData.password['extra'] = ''

      this.formShow()
    },

    handleEdit (item) {
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      const roles = []

      _.each(item.roles, (val) => {
        roles.push(val.id + '')
      })
      this.formData.roles.value = roles
      this.formShow()
    },

    handleDelete (ids) {
      const that = this
      userDelete({ id: ids })
        .then((res) => this.submitSuccess(res))
        .catch(err => this.requestFailed(err))
        .finally(() => {
          that.$refs['table'].refresh()
        })
    },

    handleStatus (row, status) {
      userUpdate({ id: row.id, status: status })
        .then((res) => this.submitSuccess(res))
        .then((res) => {
          if (res.code === httpResponseCode.SUCCESS) {
            row.status = status
          }
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {
          // this.$refs['table'].refresh()
        })
    },

    handleSearch (e) {
      e.preventDefault()
      this.$refs['search'].validateFields((err, values) => {
        if (!err) {
          this.queryParam = this.$refs['search'].getFieldsValue()
          this.$refs['table'].refresh(true)
        }
      })
    },

    formShow () {
      this.formVisible = true
    },

    formClose () {
      this.formVisible = false
    },

    searchShow () {
      this.searchVisible = true
    },

    searchClose () {
      this.searchVisible = false
    },

    handleSubmit (e) {
      e.preventDefault()

      this.formLoading = true
      this.$refs['form'].validateFields((err, values) => {
        values = this.$refs['form'].getFieldsValue()
        if (!err) {
          if (values.id > 0) {
            userUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.$refs['table'].refresh()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.formLoading = false })
          } else {
            userCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.$refs['table'].refresh()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.formLoading = false })
          }
        }
      })
    },

    handleReset () {
      this.$refs['form'].resetFields()
    },

    handleSearchReset () {
      this.$refs['search'].resetFields()
    },

    async getRoleOptions (params) {
      const res = await roleOptions(params)
      this.roleOptions = defaultFormData.roles.options = res.data.items
    }

  },
  watch: {
  }
}
</script>

<style scoped>

</style>
