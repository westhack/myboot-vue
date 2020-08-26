<template>
  <div style="background: #ffffff;padding: 10px">

    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="构造">
        <form-generator :fields="controllerFormData" ref="form" @handleSubmit="handleModelSubmit" @handleReset="handleModelReset" :submitText="'预览'">
          <template slot="form-item" slot-scope="slotProps">
            <a-form-item label="选择关联字段" v-if="controllerHasOneRelationships.length > 0 && slotProps.item.name == 'controllerHasOneRelationships'">
              <div :key="index" v-for="(item, index) in controllerHasOneRelationships">
                <a-row style="margin-bottom: 10px">
                  <a-col :span="12">
                    <a-input :value="item" disabled="" style="width: 99%"></a-input>
                  </a-col>
                  <a-col :span="12" style="text-align: center">
                    <a-input-group compact>
                      <a-select
                        default-value=""
                        style="width: 50%"
                        placeholder="选择字段"
                        mode="multiple"
                        v-model="controllerHasOneRelationshipsFields[item]"
                        @change="(val) => { hasOneChange(val, item, tableColumn.value) }">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in controllerHasOneRelationshipsKey[item]">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                    </a-input-group>
                  </a-col>
                </a-row>
              </div>
            </a-form-item>
            <a-form-item label="选择关联字段" v-if="controllerHasManyRelationships.length > 0 && slotProps.item.name == 'controllerHasManyRelationships'">
              <div :key="index" v-for="(item, index) in controllerHasManyRelationships">
                <a-row style="margin-bottom: 10px">
                  <a-col :span="12">
                    <a-input :value="item" disabled="" style="width: 99%"></a-input>
                  </a-col>
                  <a-col :span="12" style="text-align: center">
                    <a-input-group compact>
                      <a-select default-value="" style="width: 50%" placeholder="选择字段" mode="multiple" v-model="controllerHasManyRelationshipsFields[item]">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in controllerHasManyRelationshipsKey[item]">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                    </a-input-group>
                  </a-col>
                </a-row>
              </div>
            </a-form-item>
          </template>

          <template slot="form-body">
            <a-form-item label="表单字段" v-if="formData">
              <div :key="index" v-for="(item, index) in formData">
                <a-row style="margin-bottom: 10px">
                  <a-col :span="6">
                    <a-input-group compact>
                      <a-input :value="item.value" disabled="" style="width: 50%"></a-input>
                      <a-input :value="item.label" style="width: 50%" v-model="formLabel[item.value]"></a-input>
                    </a-input-group>
                  </a-col>
                  <a-col :span="18" style="text-align: center">
                    <a-input-group compact>
                      <a-select default-value="" style="width: 50%" placeholder="显示/创建/修改" mode="multiple" v-model="formMethod[item.value]">
                        <a-select-option :key="index" :value="formMethod.value" v-for="(formMethod, index) in methods">
                          {{ formMethod.label }}
                        </a-select-option>
                      </a-select>
                      <a-select :default-value="'input'" style="width: 25%" placeholder="输入框类型" v-model="formType[item.value]" @change="(val) => { formTypeChange(val, item.value) }">
                        <a-select-option :key="index" :value="formType.value" v-for="(formType, index) in inputTypes">
                          {{ formType.label }}
                        </a-select-option>
                      </a-select>
                      <a-select style="width: 25%" placeholder="验证规则" mode="multiple" v-model="formRule[item.value]">
                        <a-select-option :key="index" :value="formRule.value" v-for="(formRule, index) in rules">
                          {{ formRule.label }}
                        </a-select-option>
                      </a-select>
                    </a-input-group>
                    <a-textarea v-model="formDataSource[item.value]" placeholder="数据" v-show="formDataSourceShow[item.value]"/>
                  </a-col>
                </a-row>
              </div>
            </a-form-item>
            <a-form-item label="关联字段" v-if="formDataHasOne">
              <div :key="i" v-for="(form, i) in formDataHasOne">
                <div :key="index" v-for="(item, index) in form">
                  <a-row style="margin-bottom: 10px">
                    <a-col :span="8">
                      <a-input-group compact>
                        <a-input :value="i + '.' + item.value" disabled="" style="width: 70%"></a-input>
                        <a-input :value="item.label" style="width: 30%" v-model="formLabel[i + '.' + item.value]"></a-input>
                      </a-input-group>
                    </a-col>
                    <a-col :span="16" style="text-align: center">
                      <a-input-group compact>
                        <a-select default-value="" style="width: 50%" placeholder="显示/创建/修改" mode="multiple" v-model="formMethod[i + '.' + item.value]">
                          <a-select-option :key="index" :value="formMethod.value" v-for="(formMethod, index) in methods2">
                            {{ formMethod.label }}
                          </a-select-option>
                        </a-select>
                        <a-select :default-value="'input'" style="width: 25%" placeholder="输入框类型" v-model="formType[i + '.' + item.value]">
                          <a-select-option :key="index" :value="formType.value" v-for="(formType, index) in inputTypes">
                            {{ formType.label }}
                          </a-select-option>
                        </a-select>
                      </a-input-group>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-form-item>
          </template>
        </form-generator>
      </a-tab-pane>
      <a-tab-pane key="2" tab="预览" force-render>
        <a-textarea :value="controllerHtml" style="height: 300px"></a-textarea>
        <a-textarea :value="viewHtml" style="height: 300px"></a-textarea>
        <div style="text-align: right;padding: 5px" v-if="controllerHtml && viewHtml">
          <a-checkbox @change="onChange">
            强制
          </a-checkbox>
          <a-button type="primary" @click="save">
            保存
          </a-button>

          <a-button type="primary" @click="copyController" style="margin-left: 10px">
            复制控制器
          </a-button>
          <a-button type="primary" @click="copyVue" style="margin-left: 10px">
            复制Vue 视图
          </a-button>
        </div>

        <div style="text-align: right;padding: 5px" v-if="controllerPath && viewPath">
          控制器保存路径：{{ controllerPath }} <br/>
          Vue 保存路径：{{ viewPath }}
        </div>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>
<script>
import { types } from '@comp/FormGenerator/Types'
import { generatorController, generatorForm, getRelations } from '@/modules/generator/api/api'
import _ from 'lodash'
import { httpResponseCode } from '@/constants/httpResponseCode'

export default {
  components: {
  },
  data () {
    const vm = this
    return {
      activeKey: [],
      form: vm.$form.createForm(this),
      controllerFormData: [],
      tableColumns: [],
      tableColumn: [],
      modelHasTable: [],

      controllerHasOneRelationships: [],
      controllerHasManyRelationships: [],
      controllerHasOneRelationshipsKey: {},
      controllerHasManyRelationshipsKey: {},
      controllerHasOneRelationshipsFields: {},
      controllerHasManyRelationshipsFields: {},

      formData: null,
      formDataHasOne: {},
      formLabel: {},

      formMethod: {},
      methods: [
        {
          label: '显示',
          value: 'list'
        },
        {
          label: '创建',
          value: 'create'
        },
        {
          label: '修改',
          value: 'update'
        },
        {
          label: '搜索',
          value: 'search'
        },
        {
          label: '排序',
          value: 'sortOrder'
        }
      ],

      formRule: {},
      rules: [
        {
          label: '不允许为空',
          value: 'required'
        }
      ],

      formType: {},
      inputTypes: types,

      formDataSourceShow: {},
      formDataSource: {},

      methods2: [
        {
          label: '显示',
          value: 'list'
        },
        {
          label: '搜索',
          value: 'search'
        }
      ],
      controllerHtml: '',
      viewHtml: '',
      result: null,
      force: false,
      controllerPath: '',
      viewPath: '',
      routePath: ''
    }
  },
  created () {
    generatorForm().then(res => {
      this.controllerFormData = res.data.controller
      this.tableColumns = res.data.tableColumns
      this.modelHasTable = res.data.modelHasTable

      this.controllerFormData.model.change = (val) => {
        const tableColumns = this.tableColumns[this.modelHasTable[val]]
        this.formData = tableColumns
        this.controllerFormData.idName.data = tableColumns
        const regex1 = /\((.+?)\)/

        tableColumns.map(item => {
          const title = item.label.match(regex1)
          this.$set(this.formLabel, item.value, title ? title[1] : item.value)
          this.$set(this.formMethod, item.value, ['list', 'create', 'update', 'search'])
          this.$set(this.formType, item.value, 'input')
          this.$set(this.formDataSource, item.value, null)
          this.$set(this.formDataSourceShow, item.value, false)
        })

        getRelations({ model: val }).then(res => {
          this.controllerFormData.controllerHasManyRelationships.data = res.data.hasMany
          this.controllerFormData.controllerHasOneRelationships.data = res.data.hasOne
        })

        const name = val.split('\\')

        this.controllerFormData.controllerName.value = name.pop() + 'Controller'
      }

      this.controllerFormData.controllerHasManyRelationships.change = (val) => {
        this.controllerHasManyRelationships = val
        val.map(res => {
          const arr = res.split('|')
          this.controllerHasManyRelationshipsKey[res] = this.tableColumns[this.modelHasTable[arr[1]]]
        })
      }
      this.controllerFormData.controllerHasOneRelationships.change = (val) => {
        this.controllerHasOneRelationships = val
        val.map(res => {
          const arr = res.split('|')
          this.controllerHasOneRelationshipsKey[res] = this.tableColumns[this.modelHasTable[arr[1]]]
        })
      }
    })
  },
  methods: {
    formTypeChange (val, name) {
      if (val == 'select' || val == 'multiple-select' || val == 'tree-select' || val == 'cascader' || val == 'checkbox' || val == 'radio' || val == 'tree' || 'tags') {
        this.formDataSourceShow[name] = true
      } else {
        this.formDataSourceShow[name] = false
      }
    },
    hasOneChange (val, name) {
      console.log(val, name)
      const arr = name.split('|')
      const tableColumns = this.tableColumns[this.modelHasTable[arr[1]]]
      const regex1 = /\((.+?)\)/
      const ret = []
      tableColumns.map(item => {
        if (_.indexOf(val, item.value) !== -1) {
          const title = item.label.match(regex1)

          this.$set(this.formLabel, arr[0] + '.' + item.value, title ? title[1] : item.value)
          this.$set(this.formMethod, arr[0] + '.' + item.value, ['list', 'search'])
          this.$set(this.formType, arr[0] + '.' + item.value, 'input')
          this.$set(this.formDataSource, arr[0] + '.' + item.value, null)
          this.$set(this.formDataSourceShow, arr[0] + '.' + item.value, false)
          ret.push(item)
        }
      })

      this.$set(this.formDataHasOne, arr[0], ret)
    },
    handleModelSubmit (e, val) {
      val['controllerHasOneRelationshipsFields'] = this.controllerHasOneRelationshipsFields
      val['controllerHasManyRelationshipsFields'] = this.controllerHasManyRelationshipsFields
      val['formMethod'] = this.formMethod
      val['formType'] = this.formType
      val['formRule'] = this.formRule
      val['formDataSource'] = this.formDataSource
      val['formLabel'] = this.formLabel
      this.result = val
      console.log(val)
      generatorController(val).then(res => {
        console.log(res)
        if (res.code == httpResponseCode.SUCCESS) {
          this.$message.success('预览成功')
          this.controllerHtml = res.data.controllerHtml
          this.viewHtml = res.data.viewHtml
        } else {
          this.$message.error('预览失败')
        }
      })
    },
    handleModelReset () {

    },
    onChange (e) {
      this.force = e.target.checked
    },
    copyController () {
      this.$copyText(this.controllerHtml).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    copyVue () {
      this.$copyText(this.viewHtml).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    save () {
      const val = this.result
      val['save'] = true
      val['force'] = this.force
      if (this.controllerHtml) {
        generatorController(val).then(res => {
          console.log(res)
          if (res.code == httpResponseCode.SUCCESS) {
            this.controllerPath = res.data.controllerPath
            this.viewPath = res.data.viewPath
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error('请先预览')
      }
    }
  }
}
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
