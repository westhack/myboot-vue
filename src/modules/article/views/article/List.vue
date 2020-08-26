<template>
  <a-card :bordered="false" style="padding: 0px">

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleCategoryCreate">新建类别</a-button>
      <a-button type="primary" icon="plus" @click="handleCreate">新建文章</a-button>
      <a-button type="primary" icon="reload" @click="() => { this.$refs['table'].refresh() }">刷新</a-button>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
      <a-dropdown  v-if="selectedRowKeys.length > 0">
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
              :dataSource="articleCategory"
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

    <a-drawer
      title="修改"
      :width="720"
      @close="onCategoryClose"
      :visible="categoryVisible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >

      <form-generator
        ref="form2"
        @handleSubmit="handleCategorySubmit"
        :fields="formCategoryData"
        :showFooter="true"
        :formLayout="formLayout"
        :action="formCategoryAction"
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
              @click="onCategoryClose"
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
import { articleList, articleCreate, articleDelete, articleUpdate, articleCategoryList, categoryDelete, api } from '../../api/article'
import STree from '@/modules/core/components/Tree'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData, defaultCategoryFormData, columns } from './form'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'
import pinyin from 'pinyin'

const STATUS_YES = 1
const STATUS_NO = 0

export default {
  name: 'ArticleList',
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
      categoryVisible: false,
      openKeys: [],
      defaultSelectedKeys: [],
      articleCategory: [],
      selectKey: '',
      advancedSettings: [],
      formData: {},
      formCategoryData: {},
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
          dataIndex: 'image',
          customRender: (text, record, index) => {
            return <div><img style="width: 50px;height: 50px" src={record.image}/></div>
          },
          align: 'center',
          width: '50px'
        },
        {
          title: '名称',
          dataIndex: 'title',
          align: 'center',
          width: '500px'
        },
        {
          title: '排序',
          dataIndex: 'sort_order',
          width: '90px',
          align: 'right'
        },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (text, record, index) => {
            if (record.status == 1) {
              return <a-tag color="#87d068">显示</a-tag>
            } else {
              return <a-tag color="#f50">隐藏</a-tag>
            }
          },
          align: 'center',
          width: '50px'
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
        search: []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        vm.pageParam = parameter
        return articleList(Object.assign(parameter, this.queryParam))
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
      keyName: 'id',
      formAction: api.articleCreate,
      formCategoryAction: api.articleCreate
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.articleCategoryList()
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

    async articleCategoryList () {
      const res = await articleCategoryList()
      const articleCategory = res.data.items
      _.each(articleCategory, (val, index) => {
        this.parentNames.push({
          label: val.name,
          value: val.id
        })

        articleCategory[index]['label'] = val.name
        articleCategory[index]['value'] = val.id
      })

      defaultFormData.category_id.options = this.parentNames
      this.articleCategory = articleCategory
      this.loading = false
    },

    handleClick ({ key }) {
      this.selectKey = key
      this.queryParam.search = []
      this.queryParam.search.push({
        column: 'category_id',
        value: this.selectKey
      })
      this.$refs['table'].refresh(true)
    },

    handleBar (key, item) {
      if (key === 'edit') {
        this.formCategoryAction = api.categoryUpdate
        this.formCategoryData = mapFormValue(_.cloneDeep(defaultCategoryFormData), item)
        this.categoryVisible = true
      } else if (key === 'add') {
        this.formAction = api.articleCreate
        this.formData = _.cloneDeep(defaultFormData)
        this.visible = true
      } else if (key === 'del') {
        this.handelCategoryDelete(item)
      }
    },

    onClose () {
      this.visible = false
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)
      this.formAction = api.articleCreate
      this.formData.category_id.value = this.selectKey
      this.visible = true
    },

    handleEdit (item) {
      this.formAction = api.articleUpdate
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      this.visible = true
    },

    handleSubmit (res) {
      if (res.code === httpResponseCode.SUCCESS) {
        this.loadData({})
      }
    },

    onCategoryClose () {
      this.categoryVisible = false
    },

    handleCategoryCreate () {
      this.formCategoryData = _.cloneDeep(defaultCategoryFormData)
      this.formCategoryAction = api.categoryCreate
      this.categoryVisible = true
    },

    handleCategoryEdit (item) {
      this.formCategoryAction = api.categoryUpdate
      this.formCategoryData = mapFormValue(_.cloneDeep(defaultCategoryFormData), item)
      this.categoryVisible = true
    },

    async handleCategorySubmit (res) {
      if (res.code === httpResponseCode.SUCCESS) {
        const res = await articleCategoryList()
        const articleCategory = res.data.items
        _.each(articleCategory, (val, index) => {
          this.parentNames.push({
            label: val.name,
            value: val.id
          })

          articleCategory[index]['label'] = val.name
          articleCategory[index]['value'] = val.id
        })

        this.articleCategory = articleCategory
        this.loading = false
      }
    },

    async handleSearch (val) {
      this.loadData({
        column: 'title',
        value: val
      })
    },

    handelCategoryDelete (item) {
      const that = this
      this.$confirm({
        title: '确认删除选择数据?',
        content: '删除后无法恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          categoryDelete({ id: item.id })
            .then((res) => this.submitSuccess(res))
            .then((res) => {
              if (res.code === httpResponseCode.SUCCESS) {
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {})
        },
        onCancel () {
        }
      })
    },

    handleReset () {
      this.form.resetFields()
    },

    handleReload () {
      this.reloadLoading = true
      this.articleList().then(() => { this.reloadLoading = false })
    },

    handleChange () {
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

    handleDelete (ids) {
      const that = this
      this.$confirm({
        title: '确认删除选择数据?',
        content: '删除后无法恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          articleDelete({ id: ids })
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

    handleStatus (row, status) {
      articleUpdate({ id: row.id, status: status })
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
