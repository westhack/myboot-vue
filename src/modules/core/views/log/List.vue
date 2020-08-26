<template>
  <a-card :bordered="false" style="padding: 0px">
    <search-form-generator
      ref="search"
      :defaultShowCount="1"
      :fields="searchFormData"
      @handleSubmit="handleSearch" ></search-form-generator>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCreate">新建</a-button>
      <a-button type="primary" icon="download" @click="handleDownload" :loading="downloadLoading">导出</a-button>
      <a-button type="primary" icon="reload" @click="() => { this.$refs['table'].refresh() }">刷新</a-button>
      <a-popover placement="bottom" trigger="click">
        <template slot="content">
          <a-checkbox-group @change="columnChange" v-model="columnValue">
            <a-row v-for="(column, index) in defaultColumns" :key="index"><a-checkbox :value="column.dataIndex">{{ column.title }}</a-checkbox></a-row>
          </a-checkbox-group>
          <br/>
          <div style="text-align: right;margin-top: 10px"><a-button size="small" @click="restColumn">重置</a-button></div>
        </template>
        <template slot="title">
          <span>列</span>
        </template>
        <a-button> <a-icon type="filter" /> 表格列</a-button>
      </a-popover>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-popconfirm v-if="selectedRowKeys.length > 0" title="确定删除选择数据?" okText="是" cancelText="否" @confirm="handleTableTopBarAction({ key: 'delete'})">
        <a-button type="danger" icon="delete" >删除</a-button>
      </a-popconfirm>
    </div>

    <a-row :gutter="8">
      <a-col :span="24">
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
            <span slot="properties" slot-scope="text, record">
              {{ record.properties }}
            </span>
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
        ref="form1"
        @handleSubmit="handleSubmit"
        :fields="formData"
        :showFooter="true"
        :formLayout="formLayout"
        :action="formAction"
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
import { axios } from '@/utils/request'
import { httpResponseCode } from '@/constants/httpResponseCode'
import { STable } from '@/components'
import httpResponse from '@/mixins/httpResponse'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'

const defaultFormData = [
  {
    'name': 'id',
    'label': 'id',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'log_name',
    'label': 'log_name',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'description',
    'label': 'description',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'subject_id',
    'label': 'subject_id',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'subject_type',
    'label': 'subject_type',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'causer_id',
    'label': 'causer_id',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'causer_type',
    'label': 'causer_type',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'properties',
    'label': 'properties',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'created_at',
    'label': 'created_at',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  },
  {
    'name': 'updated_at',
    'label': 'updated_at',
    'type': 'input',
    'value': '',
    'rules': [],
    'options': []
  }
]
const defaultSearchFormData = [
  {
    'name': 'activityLog.id',
    'label': 'id',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.log_name',
    'label': 'log_name',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.description',
    'label': 'description',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.subject_id',
    'label': 'subject_id',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.subject_type',
    'label': 'subject_type',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.causer_id',
    'label': 'causer_id',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.causer_type',
    'label': 'causer_type',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.properties',
    'label': 'properties',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.created_at',
    'label': 'created_at',
    'type': 'input',
    'value': '',
    'options': []
  },
  {
    'name': 'activityLog.updated_at',
    'label': 'updated_at',
    'type': 'input',
    'value': '',
    'options': []
  }
]
const apiList = {
  list: '/core/activityLog/list',
  create: '/core/activityLog/create',
  update: '/core/activityLog/update',
  detail: '/core/activityLog/detail',
  del: '/core/activityLog/delete',
  all: '/core/activityLog/all'
}

export default {
  name: 'ActivityLogList',
  mixins: [httpResponse],
  components: {
    ATextarea,
    STable
  },
  data () {
    const vm = this
    return {
      dict: vm.$store.getters.dict,
      tableScroll: { x: 2000 },
      loading: true,
      submitLoading: false,
      downloadLoading: false,
      formLayout: 'vertical',
      visible: false,
      openKeys: [],
      defaultSelectedKeys: [],
      selectKey: '',
      advancedSettings: [],
      formData: {},
      searchFormData: {},
      apiList: apiList,
      columns: [
        {
          title: '#',
          scopedSlots: { customRender: 'serial' },
          width: '30px',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: 'log_name',
          width: '',
          align: 'center',
          dataIndex: 'log_name',
          sorter: ''
        },
        {
          title: 'description',
          width: '',
          align: 'left',
          dataIndex: 'description',
          sorter: ''
        },
        {
          title: 'subject_id',
          width: '',
          align: 'center',
          dataIndex: 'subject_id',
          sorter: ''
        },
        {
          title: 'subject_type',
          width: '',
          align: 'center',
          dataIndex: 'subject_type',
          sorter: ''
        },
        {
          title: 'causer_id',
          width: '',
          align: 'center',
          dataIndex: 'causer_id',
          sorter: ''
        },
        {
          title: 'causer_type',
          width: '',
          align: 'center',
          dataIndex: 'causer_type',
          sorter: ''
        },
        {
          title: 'properties',
          width: '',
          align: 'left',
          dataIndex: 'properties',
          sorter: '',
          scopedSlots: { customRender: 'properties' }
        },
        {
          title: 'created_at',
          width: '',
          align: 'center',
          dataIndex: 'created_at',
          sorter: ''
        },
        {
          title: 'updated_at',
          width: '',
          align: 'center',
          dataIndex: 'updated_at',
          sorter: ''
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
        search: []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        vm.pageParam = parameter
        return axios.post(vm.apiList.list, Object.assign(parameter, this.queryParam))
          .then(res => {
            vm.loading = false
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
      pageParam: 1,
      keyName: 'id',
      formAction: apiList.create,
      columnValue: [],
      defaultColumns: []
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.loading = false
    this.searchFormData = _.cloneDeep(defaultSearchFormData)
    this.defaultColumns = _.cloneDeep(this.columns)
    this.columns.map(res => {
      this.columnValue.push(res.dataIndex)
    })
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

    onClose () {
      this.visible = false
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)
      this.formAction = this.apiList.create
      this.visible = true
    },

    handleEdit (item) {
      this.formAction = this.apiList.update
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      this.visible = true
    },

    handleSubmit (res) {
      if (res.code === httpResponseCode.SUCCESS) {
        this.loadData({})
      }
    },

    handleReset () {
      this.form.resetFields()
    },

    handleChange () {
    },

    handleUpdate (val) {
      const that = this
      axios.post(this.apiList.update, val)
        .then((res) => this.submitSuccess(res))
        .catch(err => this.requestFailed(err))
        .finally(() => {
          that.$refs['table'].refresh()
        })
    },

    handleTableTopBarAction ({ key, value }) {
      if (key === 'delete') {
        this.handleDelete(this.selectedRowKeys)
      } else {
        const val = { id: this.selectedRowKeys }
        val[key] = value
        this.handleUpdate(val)
      }
    },

    handleTableRowBarAction (key, row) {
      if (key === 'delete') {
        this.handleDelete(row.id)
      }
    },

    handleDelete (id) {
      const that = this
      this.$confirm({
        title: '确认删除选择数据?',
        content: '删除后无法恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          axios.post(that.apiList.del, { id: id })
            .then((res) => this.submitSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              that.$refs['table'].refresh()
            })
        },
        onCancel () {
        }
      })
    },

    handleSearchReset () {
      this.searchFormData = _.cloneDeep(defaultSearchFormData)
    },

    handleSearch (e) {
      e.preventDefault()
      this.$refs['search'].validateFields((err, values) => {
        this.queryParam.search = this.$refs['search'].getFieldsValue()
        this.$refs['table'].refresh(true)
      })
    },

    handleDownload () {
      this.downloadLoading = true
        import('@/utils/Export2Excel').then(excel => {
          const tHeader = []
          const filterVal = []
          this.columns.map(res => {
            tHeader.push(res.title)
            filterVal.push(res.dataIndex)
          })

          const list = this.$refs['table']['localDataSource']
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: new Date().getTime(),
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },

    columnChange (val) {
      const columns = []
      this.defaultColumns.map(res => {
        if (val.indexOf(res.dataIndex) != -1) {
          columns.push(res)
        }
      })

      this.columns = columns
    },
    restColumn () {
      const columns = []
      const columnValue = []
      this.defaultColumns.map(res => {
        columns.push(res)
        columnValue.push(res.dataIndex)
      })

      this.columns = columns
      this.columnValue = columnValue
    }
  }
}
</script>

<style lang="less" scoped>

</style>
