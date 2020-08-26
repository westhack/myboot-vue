<template>
  <a-card :bordered="false">

    <a-row :gutter="24">
      <a-col :xs="24" :md="6" :lg="7" v-permission:roleListquery>
        <div style="max-height: calc(100vh - 180px);overflow:auto;">
          <a-skeleton active :loading="loading">
            <s-menu
              :dataSource="models"
              :openKeys.sync="openKeys"
              :defaultSelectedKeys="defaultSelectedKeys"
              :search="true"
              :toolBar="toolBar"
              :label="'title'"
              :name="'id'"
              @click="handleClick"
              @toolBarClick="handleBar"
              @searchClick="handleSearch"
            ></s-menu>
          </a-skeleton>
        </div>
      </a-col>
      <a-col :xs="24" :md="18" :lg="17">
        <a-card :title="title" v-if="this.visible" id="form">
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
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
import { httpResponseCode } from '@/constants/httpResponseCode'
import {
  getRoleList, roleCreate, roleUpdate, roleDelete
} from '@/modules/user/api/role'
import { guardOptions, permissionOptions } from '@/modules/user/api/permission'
import SMenu from '@/modules/user/components/menu/Menu'
import { STable } from '@/components'
import FormGenerator from '@/components/FormGenerator/FormGenerator'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import draggable from 'vuedraggable'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData } from './form'
import _ from 'lodash'
import { mapFormValue } from '@/utils/util'
// import pinyin from 'pinyin'

export default {
  name: 'RoleList',
  mixins: [httpResponse],
  components: {
    ATextarea,
    STable,
    SMenu,
    FormGenerator,
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
      openKeys: [],
      defaultSelectedKeys: [],
      models: [],
      selectKey: '',
      formData: {},
      roleOptions: [],
      guardOptions: [],
      permissionOptions: [],
      guards: [],
      title: '编辑',
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
      ]
    }
  },
  created () {
    this.getRoleList().then((res) => { this.loading = false })
    this.getGuardOptions()
    this.getPermissionOptions()
  },
  methods: {
    async getRoleList (params) {
      const res = await getRoleList(params)

      this.models = _.cloneDeep(res.data.items)
    },

    async getGuardOptions (params) {
      const res = await guardOptions(params)
      this.guardOptions = defaultFormData.guard_name.options = res.data.items
    },

    async getPermissionOptions (params) {
      const res = await permissionOptions(params)
      this.permissionOptions = defaultFormData.permissions.options = res.data.items
    },

    handleEdit (item) {
      console.log(item.permissions)
      this.formData = mapFormValue(_.cloneDeep(defaultFormData), item)
      this.formData.permissions.value = _.keys(_.keyBy(item.permissions, 'id'))

      console.log(this.formData.permissions.value)
      this.visible = true
    },

    handleAdd () {
      if (!this.$permission('roleListadd')) {
        this.$error('暂无权限')
        return
      }

      this.formData = _.cloneDeep(defaultFormData)
      this.formData.permissions.value = []
      this.visible = true
    },

    handleClick ({ key }) {
      if (!this.$permission('roleListedit')) {
        this.$error('暂无权限')
        return
      }

      this.selectKey = key
      const item = _.find(this.models, ['id', key])
      this.handleEdit(item)
    },

    handleBar (key, item) {
      if (key === 'edit') {
        this.handleEdit(item)
      } else if (key === 'add') {
        this.handleAdd()
      } else if (key === 'del') {
        if (item.id === 1) {
          this.$notification['error']({
            message: '错误',
            description: '无法删除系统管理员',
            duration: 4
          })

          return false
        }
        this.handelDel(item)
      }
    },

    handleSearch (val) {
      this.getRoleList({ name: val })
    },

    handelDel (item) {
      if (!this.$permission('roleListdelete')) {
        this.$error('暂无权限')
        return
      }

      roleDelete({ id: item.id })
        .then((res) => this.submitSuccess(res))
        .then((res) => {
          if (res.code === httpResponseCode.SUCCESS) {
            this.getRoleList()
          }
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {})
    },

    handleReset () {
      this.$refs['form'].resetFields()
    },

    handleReload () {
      this.reloadLoading = true
      this.getRoleList().then(() => { this.reloadLoading = false })
    },

    handleChange () {},

    handleSubmit (e) {
      e.preventDefault()
      this.submitLoading = true
      this.$refs['form'].validateFields((err, values) => {
        console.log(values)
        if (!err) {
          if (values.id > 0) {
            roleUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getRoleList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          } else {
            roleCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getRoleList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          }
        }
      })
    }

    // pinyin (value) {
    //   return (pinyin(value, { style: pinyin.STYLE_NORMAL })).toString().replace(/,/g, '_')
    // }

  }
}
</script>

<style lang="less" scoped>

</style>
