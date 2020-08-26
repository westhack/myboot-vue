<template>
  <a-card :bordered="false">

    <a-row :gutter="8" v-permission:coreConfigListquery>
      <a-col :span="5">
        <a-affix :offsetTop="10" style="max-height: 100vh;overflow:auto">
          <a-skeleton active :loading="loading">
            <s-tree
              :dataSource="modules"
              :openKeys.sync="openKeys"
              :search="true"
              :toolBar="toolBar"
              @click="handleClick"
              @toolBarClick="handleBar"
              @searchClick="handleSearch"
            ></s-tree>
          </a-skeleton>
        </a-affix>
      </a-col>

      <a-col :span="19">
        <a-skeleton active :loading="loading">
          <a-form
            :form="form"
            @submit="handleSubmitUpdateValue"
          >

            <div v-for="(module, index) in modules" :key="index">

              <a-card
                v-show="children.fields.length > 0"
                v-for="(children, key) in module.children"
                :class="selectKey === children.name ? 'select-box' : ''"
                :title="children.label"
                :id="children.name"
                :key="key"
                style="margin-bottom: 20px">

                <a-form-item
                  v-for="(field, index2) in children.fields"
                  :key="index2"
                  :label="field.label"
                  :required="false"
                  :extra="getExtra(field)"
                >

                  <div style="display: flex">
                    <form-item-generator
                      style="flex: 1"
                      :key="index"
                      :item="field"
                      :options="field.data"
                      :itemChange="handleChange"
                      v-decorator="[
                        `${field.name}`,
                        {
                          initialValue: field.value,
                          validateTrigger: ['change', 'blur'],
                          rules: field.rules
                        }
                      ]"
                    />
                    <div style="width: 10px">
                      <a class="btn" style="width: 10px; padding: 0px 10px">
                        <a-dropdown>
                          <a-icon type="ellipsis"/>
                          <a-menu slot="overlay">
                            <a-menu-item key="edit" @click="handleBar('edit', field)" v-permission:coreConfigListedit>
                              修改
                            </a-menu-item>

                            <a-menu-item key="del" coreConfigListdelete>
                              <a-popconfirm title="确定要删除?" @confirm="handleBar('del', field)" okText="是" cancelText="否">
                                <div>删除</div>
                              </a-popconfirm>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </a>
                    </div>
                  </div>

                </a-form-item>

                <footer-tool-bar>

                  <a-button
                    type="primary"
                    html-type="submit"
                    :loading="saveLoading"
                  >
                    保存
                  </a-button>
                  <a-button
                    :style="{ marginLeft: '8px' }"
                    @click="handleReset"
                  >
                    重置
                  </a-button>

                  <a-button
                    :style="{ marginLeft: '8px' }"
                    @click="handleReload"
                    :loading="reloadLoading"
                  >
                    刷新
                  </a-button>

                </footer-tool-bar>

              </a-card>
            </div>

          </a-form>
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
import { getConfigList, configCreate, configDelete, configUpdate, configBatchUpdateValue } from '@/modules/core/api/config'
import STree from '@/modules/core/components/Tree'
import { STable } from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import httpResponse from '@/mixins/httpResponse'
import draggable from 'vuedraggable'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { defaultFormData } from './form'
import _ from 'lodash'
import pinyin from 'pinyin'

export default {
  name: 'ConfigList',
  mixins: [httpResponse],
  components: {
    ATextarea,
    STable,
    STree,
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
      openKeys: ['key-01'],
      modules: [],
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
      ]
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  created () {
    this.getConfigList().then((res) => { this.loading = false })

    // defaultFormData.label.change = (val) => {
    //   if (this.formData.id.value === '') {
    //     this.formData.name.value = this.pinyin(val)
    //   }
    // }
  },
  methods: {
    async getConfigList (params) {
      const res = await getConfigList(params)

      this.modules = _.cloneDeep(res.data.modules)

      this.modules.forEach((module) => {
        module.children.forEach((children) => {
          this.parentNames.push({
            label: children.label,
            value: children.name
          })
        })
      })

      defaultFormData.parent_name.options = this.parentNames
    },

    handleClick ({ key }) {
      this.selectKey = key
      const anchor = this.$el.querySelector('#' + key)
      document.documentElement.scrollTop = anchor.offsetTop
    },

    handleBar (key, item) {
      if (key === 'edit') {
        if (!this.$permission('coreConfigListedit')) {
          this.$error('暂无权限')
          return
        }

        this.formData = _.cloneDeep(defaultFormData)

        delete this.formData.value
        // delete this.formData.type

        _.each(item, (value, name) => {
          if (this.formData[name] !== undefined) {
            if (name === 'data' || name === 'rules' || name === 'value') {
              this.formData[name]['value'] = JSON.stringify(value, null, 2)
            } else {
              this.formData[name]['value'] = value
            }
          }
        })

        this.visible = true
      } else if (key === 'add') {
        if (!this.$permission('coreConfigListadd')) {
          this.$error('暂无权限')
          return
        }

        this.formData = _.cloneDeep(defaultFormData)
        this.formData.module.value = item.module
        this.formData.parent_name.value = item.name
        this.visible = true
      } else if (key === 'del') {
        this.handelDel(item)
      }
    },

    handleSearch (val) {
      this.getConfigList({ label: val })
    },

    handleSaveOk () {

    },

    handleSaveClose () {

    },

    handelDel (item) {
      if (!this.$permission('coreConfigListdelete')) {
        this.$error('暂无权限')
        return
      }

      configDelete({ name: item.name })
        .then((res) => this.submitSuccess(res))
        .then((res) => {
          if (res.code === httpResponseCode.SUCCESS) {
            this.getConfigList()
          }
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {})
    },

    handleSubmitUpdateValue (e) {
      e.preventDefault()
      this.saveLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          configBatchUpdateValue(values)
            .then((res) => this.submitSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => { this.saveLoading = false })
        }
      })
    },

    handleReset () {
      this.form.resetFields()
    },

    handleReload () {
      this.reloadLoading = true
      this.getConfigList().then(() => { this.reloadLoading = false })
    },

    handleChange () {
    },

    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },

    handleSubmit (e) {
      e.preventDefault()
      this.submitLoading = true
      this.$refs['form2'].validateFields((err, values) => {
        if (!err) {
          if (values.id > 0) {
            console.log(values)
            configUpdate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getConfigList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          } else {
            configCreate(values)
              .then((res) => this.submitSuccess(res))
              .then((res) => {
                if (res.code === httpResponseCode.SUCCESS) {
                  this.getConfigList()
                }
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.submitLoading = false })
          }
        }
      })
    },

    pinyin (value) {
      return (pinyin(value, { style: pinyin.STYLE_NORMAL })).toString().replace(/,/g, '_')
    },

    getExtra (field) {
      return "php获取 config('parems." + field.module + '.' + field.name + "')"
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
</style>
