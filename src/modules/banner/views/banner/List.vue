<template>
  <a-card :bordered="false" style="padding: 0px">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCreate">新建</a-button>
      <a-button type="primary" icon="reload" @click="() => { this.$refs['table'].refresh() }">刷新</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item key="delete">
            <a-popconfirm title="确定删除选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'delete'})">
              <div><a-icon type="delete" /> 删除</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_yes">
            <a-popconfirm title="确定显示选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_yes'})">
              <div ><a-icon type="eye" /> 显示</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_no">
            <a-popconfirm title="确定禁止选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_no'})">
              <div ><a-icon type="eye-invisible" /> 禁止</div>
            </a-popconfirm>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

    </div>

    <a-row :gutter="8">
      <a-col :span="5">
        <div style="max-height: 100vh;overflow:auto">
          <a-skeleton active :loading="loading">
            <s-tree
              :dataSource="bannerCategory"
              :openKeys.sync="openKeys"
              :defaultSelectedKeys="defaultSelectedKeys"
              :search="true"
              :keyName="keyName"
              :toolBar="toolBar"
              @click="handleClick"
              @toolBarClick="handleBar"
              @searchClick="handleSearch"
            ></s-tree>
          </a-skeleton>
        </div>
      </a-col>
      <a-col :span="19">
        <a-skeleton active :loading="loading">
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
            <span slot="action" slot-scope="text, record">
              <a-tag @click="handleEdit(record)">编辑</a-tag>
              <a-divider type="vertical" />
              <a-dropdown>
                <a-tag class="ant-dropdown-link">更多 <a-icon type="down" /></a-tag>
                <a-menu slot="overlay" >
                  <a-menu-item key="delete">
                    <a-popconfirm title="确定删除?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('delete', record)">
                      <a-icon type="delete" /> 删除
                    </a-popconfirm>
                  </a-menu-item>

                  <a-menu-item key="status_yes" v-if="record.status == 0">
                    <a-popconfirm title="确定显示?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_yes', record)">
                      <a-icon type="eye" /> 显示
                    </a-popconfirm>
                  </a-menu-item>

                  <a-menu-item key="status_no" v-if="record.status == 1">
                    <a-popconfirm title="确定禁止?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_no', record)">
                      <a-icon type="eye-invisible" /> 禁止
                    </a-popconfirm>
                  </a-menu-item>

                </a-menu>
              </a-dropdown>
            </span>
          </s-table>
        </a-skeleton>
      </a-col>
    </a-row>

    <a-drawer
      title="修改"
      :width="720"
      @close="onClose"
      :visible="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >

      <form-generator
        ref="form2"
        @handleSubmit="handleSubmit"
        :fields="formData"
        :showFooter="true"
        :formLayout="formLayout"
      >
        <template slot="footer">
          <br>
          <div
            class="drawer-form-footer"
          >
            <a-button
              type="primary"
              html-type="submit"
              :loading="submitLoading"
            >
              提交
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="onClose"
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
import { bannerList, bannerCreate, bannerDelete, bannerUpdate, bannerCategoryList } from '../../api/banner'
import STree from '@/modules/core/components/Tree'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData } from './form'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'
import pinyin from 'pinyin'

const STATUS_YES = 1
const STATUS_NO = 0

export default {
  name: 'BannerList',
  mixins: [httpResponse],
  components: {
    ATextarea,
    STable,
    STree,
    FooterToolBar
  },
  data () {
    const vm = this
    return {
      tableScroll: { x: 1200 },
      loading: true,
      submitLoading: false,
      saveLoading: false,
      reloadLoading: false,
      formLayout: 'vertical',
      visible: false,
      openKeys: [],
      defaultSelectedKeys: [],
      bannerCategory: [],
      selectKey: '',
      advancedSettings: [],
      formData: {},
      parentNames: [],
      toolBar: [
        {
          key: 'add',
          label: '新增'
        },
        {
          key: 'edit',
          label: '修改'
        },
        {
          key: 'del',
          label: '删除'
        }
      ],
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' },
          width: '50px',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '图片',
          dataIndex: 'group',
          customRender: (text, record, index) => {
            return <div><img src={record.image} width="100px"/></div>
          },
          align: 'center',
          width: '150px'
        },
        {
          title: '名称',
          dataIndex: 'title',
          align: 'center',
          width: '150px'
        },
        {
          title: '排序',
          dataIndex: 'sort_order',
          width: '150px',
          align: 'right'
        },
        {
          title: '',
          dataIndex: '',
          width: ''
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      queryParam: {
        search: [
          {
            column: 'code',
            value: ''
          }
        ]
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        vm.pageParam = parameter
        return bannerList(Object.assign(parameter, this.queryParam))
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
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      userOptions: [],
      pageParam: 1,
      keyName: 'code'
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.bannerCategoryList()
  },
  methods: {
    tableOption () {
      this.optionAlertShow = !this.optionAlertShow
      if (this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        }
      } else {
        this.options = {
          alert: { show: false, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
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

    async bannerCategoryList () {
      const res = await bannerCategoryList()
      const bannerCategory = res.data.items
      _.each(bannerCategory, (val, index) => {
        if (this.defaultSelectedKeys.length === 0) {
          this.defaultSelectedKeys = [val.code]

          this.queryParam.search.push({
            column: 'code',
            value: val.code
          })
        }
        this.parentNames.push({
          label: val.name,
          value: val.code
        })

        bannerCategory[index]['label'] = val.name
        bannerCategory[index]['value'] = val.code
      })

      defaultFormData.code.options = this.parentNames
      this.bannerCategory = bannerCategory
      this.loading = false
    },

    handleClick ({ key }) {
      this.selectKey = key
      this.queryParam.search = []
      this.queryParam.search.push({
        column: 'code',
        value: this.selectKey
      })
      this.$refs['table'].refresh(true)
    },

    handleBar (key, item) {
      if (key === 'edit') {
        this.formData = _.cloneDeep(defaultFormData)

        this.visible = true
      } else if (key === 'add') {
        this.formData = _.cloneDeep(defaultFormData)

        this.formData.code.value = item.code
        this.visible = true
      } else if (key === 'del') {
        this.handelDel(item)
      }
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)

      this.formData.code.value = this.selectKey
      this.visible = true
    },

    async handleSearch (val) {
      await bannerList({ label: val })
      _.each(this.banners, (filed) => {
        if (this.selectKey === filed.name) {
          this.dataSource = filed.banners
        }
      })
    },

    handelDel (item) {
      bannerDelete({ name: item.name })
        .then((res) => this.submitSuccess(res))
        .then((res) => {
          if (res.code === httpResponseCode.SUCCESS) {
            this.loadData()
          }
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {})
    },

    handleReset () {
      this.form.resetFields()
    },

    handleReload () {
      this.reloadLoading = true
      this.loadData()
    },

    handleChange () {
    },

    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },

    handleEdit (item) {
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      this.visible = true
    },

    handleSubmit (e) {
      e.preventDefault()
      this.submitLoading = true
      this.$refs['form2'].validateFields((err, values) => {
        if (!err) {
          if (values.id > 0) {
            bannerUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.loadData()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          } else {
            bannerCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.loadData()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          }
        }
      })
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

    handleStatus (row, status) {
      bannerUpdate({ id: row.id, status: status })
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

    pinyin (value) {
      return (pinyin(value, { style: pinyin.STYLE_NORMAL })).toString().replace(/,/g, '_')
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-card-wider-padding{
    .ant-card-body {
      padding: 10px;
    }
  }

  .select-box {
    border: 1px solid #1890ff;
  }

  .ant-form-item {
    margin-bottom: 0px;
  }

  .ant-divider {
    margin: 20px 0px 0px 0px;
  }

  /deep/ .ant-form-item-children {
    .btn {
      display: none;
    }

    &:hover {
      .btn {
        display: block;
      }
    }

  }
  /deep/ .ant-card .ant-card-body {
    padding: 10px;
  }
</style>
