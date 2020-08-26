<template>
  <a-card :bordered="false" style="padding: 0px">
    <div>
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleCreate">添加</a-button>
        <a-button type="danger" icon="delete" @click="handelDel" >删除</a-button>
        是否关联：
        <a-switch checkedChildren="" unCheckedChildren="关" defaultChecked v-model="checkStrictly"/>
      </div>

      <split-pane :min-percent="30" :default-percent="30" split="vertical" style="min-width: 300px; height: calc(100vh - 180px)">
        <template slot="paneL">
          <div style="max-height: calc(100vh - 180px);overflow:auto; margin-right: 10px">
            <a-skeleton active :loading="loading">
              <div>
                <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="handleSearch" />
                <a-tree
                  checkable
                  @expand="onExpand"
                  :expandedKeys="expandedKeys"
                  :autoExpandParent="autoExpandParent"
                  :treeData="models"
                  :checkStrictly="!checkStrictly"
                  v-model="checkedKeys"
                  @select="handleSelect"
                >
                  <template slot="title" slot-scope="{title}">
                    <span v-if="title.indexOf(searchValue) > -1">
                      {{ title.substr(0, title.indexOf(searchValue)) }}
                      <span style="color: #f50">{{ searchValue }}</span>
                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                    </span>
                    <span v-else>{{ title }}</span>
                  </template>
                </a-tree>
              </div>

            </a-skeleton>
          </div>
        </template>
        <template slot="paneR">
          <a-card :title="title" v-if="this.visible" style="margin-left: 10px; " id="form">
            <form-generator
              ref="form"
              @handleSubmit="handleSubmit"
              :fields="formData"
              :showFooter="true"
              :formLayout="formLayout"
            >
              <template slot="footer">
                <br>
                <br>
                <footer-tool-bar>
                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="submitLoading"
                  >
                    提交
                  </a-button>
                  <a-button
                    :style="{ marginLeft: '8px' }"
                    @click="handleReset"
                  >
                    重置
                  </a-button>
                </footer-tool-bar>
              </template>
            </form-generator>
          </a-card>
        </template>
      </split-pane>
    </div>
  </a-card>
</template>

<script>
import { httpResponseCode } from '@/constants/httpResponseCode'
import { getMenuList, menuOptions, menuCreate, menuUpdate, menuDelete } from '@/modules/user/api/menu'
import { permissionRoutes } from '@/modules/user/api/permission'
import SMenu from '@/modules/user/components/menu/Menu'
import { STable } from '@/components'
import FormGenerator from '@/components/FormGenerator/FormGenerator'
import FormItemGenerator from '@/components/FormGenerator/FormItemGenerator'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import draggable from 'vuedraggable'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData } from './form'
import _ from 'lodash'
import { mapFormValue, treeParseData } from '@/utils/util'
import { constantRouterComponents } from '@/router/generatorRouters'

const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    dataList.push(node)
    if (node.children) {
      generateList(node.children, node.key)
    }
  }
}

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'MenuList',
  mixins: [httpResponse],
  components: {
    ATextarea,
    STable,
    SMenu,
    FormGenerator,
    FormItemGenerator,
    draggable,
    FooterToolBar
  },
  data () {
    return {
      loading: true,
      submitLoading: false,
      saveLoading: false,
      reloadLoading: false,
      formLayout: 'vertical',
      visible: false,
      models: [],
      dataList: [],
      formData: {},
      permissionOptions: [],
      permissionRoutes: [],
      menuOptions: [],
      routerComponents: [],
      title: '编辑',
      checkedKeys: [],
      expandedKeys: [],
      searchValue: '',
      checkStrictly: true,
      selectKey: '',
      autoExpandParent: false
    }
  },

  created () {
    this.getMenuList().then((res) => { this.loading = false })
    this.getMenuOptions()
    this.getRouterComponents()
    this.getPermissionRoutes()
  },
  methods: {

    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    handleSearch (e) {
      const value = e.target.value
      const expandedKeys = dataList.map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.models)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)

      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },

    handleSelect (selectedKeys) {
      if (selectedKeys[0]) {
        this.selectKey = selectedKeys[0]
        dataList.forEach((item) => {
          if (item.key === this.selectKey) {
            this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
            this.visible = true
          }
        })
      }
    },

    async getMenuList (params) {
      const res = await getMenuList(params)
      this.models = treeParseData(res.data.items, 'id', 'title')
      generateList(this.models)
    },

    async getPermissionRoutes (params) {
      const res = await permissionRoutes(params)
      this.permissionRoutes = defaultFormData.route.options = res.data.items
    },

    async getMenuOptions (params) {
      const res = await menuOptions(params)
      this.menuOptions = defaultFormData.parent_id.options = res.data.items
    },

    getRouterComponents () {
      _.each(constantRouterComponents, (res, index) => {
        this.routerComponents.push({ label: res.name, value: index })
      })

      defaultFormData.component.options = this.routerComponents
    },

    handleClick ({ key }) {
      this.selectKey = key
    },

    handleCreate () {
      this.formData = _.cloneDeep(defaultFormData)
      this.formData.parent_id.value = ''
      this.visible = true
    },

    handelDel () {
      let id = []
      if (this.checkStrictly === true) {
        id = this.checkedKeys
      } else {
        id = this.selectKey.checkbox
      }
      if (id.length === 0) {
        this.$notification['error']({
          message: '错误',
          description: '请选择要删除的数据',
          duration: 4
        })

        return false
      }
      this.$confirm({
        title: '确认删除选择数据?',
        content: '删除后无法恢复',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          menuDelete({ id: this.checkedKeys })
            .then((res) => this.submitSuccess(res))
            .then((res) => {
              if (res.code === httpResponseCode.SUCCESS) {
                this.getMenuList()
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
      this.$refs['form'].resetFields()
    },

    handleReload () {
      this.reloadLoading = true
      this.getMenuList().then(() => { this.reloadLoading = false })
    },

    handleChange () {},

    handleEdit (item) {
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      this.visible = true
    },

    handleSubmit (e) {
      e.preventDefault()
      this.submitLoading = true
      this.$refs['form'].validateFields((err, values) => {
        if (!err) {
          if (values.id > 0) {
            menuUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getMenuList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          } else {
            menuCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getMenuList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          }
        }
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
