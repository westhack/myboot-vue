<template>
  <a-card :bordered="false" style="padding: 0px">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCreate" v-permission:coreDictListadd>新建</a-button>
      <a-button type="primary" icon="reload" @click="() => { this.$refs['table'].refresh() }">刷新</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item key="delete" v-permission:coreDictListdelete>
            <a-popconfirm title="确定删除选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'delete'})">
              <div><a-icon type="delete" /> 删除</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_yes" v-permission:coreDictListenable>
            <a-popconfirm title="确定显示选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_yes'})">
              <div ><a-icon type="eye" /> 显示</div>
            </a-popconfirm>
          </a-menu-item>

          <a-menu-item key="status_no" v-permission:coreDictListdisable>
            <a-popconfirm title="确定禁止选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'status_no'})">
              <div ><a-icon type="eye-invisible" /> 禁止</div>
            </a-popconfirm>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

    </div>

    <a-row :gutter="8">
      <a-col :span="24">
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
            <a-tag @click="handleEdit(record)" v-permission:coreDictListedit>编辑</a-tag>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-tag class="ant-dropdown-link">更多 <a-icon type="down" /></a-tag>
              <a-menu slot="overlay" >
                <a-menu-item key="delete" v-permission:coreDictListdelete>
                  <a-popconfirm title="确定删除?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('delete', record)">
                    <a-icon type="delete" /> 删除
                  </a-popconfirm>
                </a-menu-item>

                <a-menu-item key="status_yes" v-if="record.status == 0" v-permission:coreDictListenable>
                  <a-popconfirm title="确定显示?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_yes', record)">
                    <a-icon type="eye" /> 显示
                  </a-popconfirm>
                </a-menu-item>

                <a-menu-item key="status_no" v-if="record.status == 1" v-permission:coreDictListdisable>
                  <a-popconfirm title="确定禁止?" okText="是" cancelText="否" @confirm="handleTableRowBarAction('status_no', record)">
                    <a-icon type="eye-invisible" /> 禁止
                  </a-popconfirm>
                </a-menu-item>

              </a-menu>
            </a-dropdown>
          </span>
        </s-table>
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
        ref="form"
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
import { dictList, dictCreate, dictDelete, dictUpdate } from '@/modules/core/api/dict'
import STree from '@/modules/core/components/Tree'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData } from './form'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'

const STATUS_YES = 1
const STATUS_NO = 0

export default {
  name: 'DictList',
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
      selectKey: '',
      advancedSettings: [],
      formData: {},
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' },
          width: '50px',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '名称',
          dataIndex: 'title',
          align: 'center',
          width: '150px'
        },
        {
          title: '键',
          dataIndex: 'name',
          width: '150px'
        },
        {
          title: '值',
          dataIndex: 'data',
          width: '150px'
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
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        vm.pageParam = parameter
        return dictList(Object.assign(parameter, this.queryParam))
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
      pageParam: 1
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
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

    handleClick ({ key }) {
      this.selectKey = key

      this.queryParam.parent_name = this.selectKey
      this.$refs['table'].refresh(true)
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)

      this.formData.parent_name.value = this.selectKey
      this.visible = true
    },

    handelDel (item) {
      dictDelete({ name: item.name })
        .then((res) => this.submitSuccess(res))
        .then((res) => {
          if (res.code === httpResponseCode.SUCCESS) {
            this.loadData({})
          }
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {})
    },

    handleReset () {
      this.form.resetFields()
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
      this.$refs['form'].validateFields((err, values) => {
        if (!err) {
          this.submitLoading = true
          if (values.id > 0) {
            dictUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.loadData({})
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          } else {
            dictCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.loadData({})
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
      dictUpdate({ id: row.id, status: status })
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
