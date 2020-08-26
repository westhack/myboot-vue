<template>
  <div style="background: #ffffff;padding: 10px">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="构造" force-render>
        <form-generator :fields="modelFormData" ref="form" @handleSubmit="handleModelSubmit" @handleReset="handleModelReset" :submitText="'预览'">
          <template slot="form-item" slot-scope="slotProps">
            <a-form-item label="选择关联key" v-if="modelHasOneRelationships.length > 0 && slotProps.item.name == 'modelHasOneRelationships'">
              <div :key="index" v-for="(item, index) in modelHasOneRelationships">
                <a-row style="margin-bottom: 10px">
                  <a-col :span="12">
                    <a-input :value="item" disabled="" style="width: 99%"></a-input>
                  </a-col>
                  <a-col :span="12" style="text-align: center">
                    <a-input-group compact>
                      <a-select default-value="" style="width: 50%" placeholder="foreignKey" v-model="modelHasOneRelationshipsForeignKey[item]">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in modelHasOneRelationshipsKey[item]">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                      <a-select default-value="" style="width: 50%" placeholder="foreignLocalKey" v-model="modelHasOneRelationshipsLocalKey[item]">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in modelTableColumns">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                    </a-input-group>
                  </a-col>
                </a-row>
              </div>
            </a-form-item>
            <a-form-item label="选择关联key" v-if="modelHasManyRelationships.length > 0 && slotProps.item.name == 'modelHasManyRelationships'">
              <div :key="index" v-for="(item, index) in modelHasManyRelationships">
                <a-row style="margin-bottom: 10px">
                  <a-col :span="12">
                    <a-input :value="item" disabled="" style="width: 99%"></a-input>
                  </a-col>
                  <a-col :span="12" style="text-align: center">
                    <a-input-group compact>
                      <a-select default-value="" style="width: 50%" placeholder="foreignKey" v-model="modelHasManyRelationshipsForeignKey[item]">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in modelHasManyRelationshipsKey[item]">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                      <a-select default-value="" style="width: 50%" placeholder="foreignLocalKey" v-model="modelHasManyRelationshipsLocalKey[item]">
                        <a-select-option :key="index" :value="tableColumn.value" v-for="(tableColumn, index) in modelTableColumns">
                          {{ tableColumn.label }}
                        </a-select-option>
                      </a-select>
                    </a-input-group>
                  </a-col>
                </a-row>
              </div>
            </a-form-item>
          </template>
        </form-generator>
      </a-tab-pane>
      <a-tab-pane key="2" tab="预览">
        <a-textarea :value="modelHtml" style="height: 500px"></a-textarea>
        <div style="text-align: right;padding: 5px" v-if="this.modelHtml">
          <a-checkbox @change="onChange">
            强制
          </a-checkbox>
          <a-button type="primary" @click="save">
            保存
          </a-button>
          <a-button type="primary" @click="copy" style="margin-left: 10px">
            复制
          </a-button>
        </div>
        <div style="text-align: right;padding: 5px" v-if="modelPath">
          模型保存路径：{{ modelPath }}
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import FormItemGenerator from '@comp/FormGenerator/FormItemGenerator'
import { generatorForm, generatorModel } from '@/modules/generator/api/api'
import { httpResponseCode } from '@/constants/httpResponseCode'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  components: {
    ATextarea,
    FormItemGenerator
  },
  data () {
    const vm = this
    return {
      activeKey: [],
      form: vm.$form.createForm(this),
      modelFormData: [],
      modelHasOneRelationships: [],
      modelHasManyRelationships: [],
      modelHasOneRelationshipsKey: {},
      modelHasManyRelationshipsKey: {},
      modelHasOneRelationshipsForeignKey: {},
      modelHasOneRelationshipsLocalKey: {},
      modelHasManyRelationshipsForeignKey: {},
      modelHasManyRelationshipsLocalKey: {},
      tableColumns: [],
      modelTableColumns: [],
      modelHasTable: [],
      modelHtml: '',
      result: null,
      force: false,
      modelPath: ''
    }
  },
  created () {
    generatorForm().then(res => {
      this.modelFormData = res.data.model
      this.tableColumns = res.data.tableColumns
      this.modelHasTable = res.data.modelHasTable

      this.modelFormData.table.change = (val) => {
        this.modelFormData.modelAttributes.data = res.data.tableColumns[val]
        this.modelFormData.modelHiddenAttributes.data = res.data.tableColumns[val]
        this.modelFormData.className.value = val
        this.modelTableColumns = res.data.tableColumns[val]
      }
      this.modelFormData.isFillable.change = (val) => {
        if (val == true) {
          this.modelFormData.modelAttributes.label = '可被批量赋值的属性'
        } else {
          this.modelFormData.modelAttributes.label = '不可被批量赋值的属性'
        }
      }

      this.modelFormData.modelHasManyRelationships.change = (val) => {
        console.log(val)
        this.modelHasManyRelationships = val
        val.map(res => {
          this.modelHasManyRelationshipsKey[res] = this.tableColumns[this.modelHasTable[res]]
        })
      }
      this.modelFormData.modelHasOneRelationships.change = (val) => {
        this.modelHasOneRelationships = val
        console.log(val)
        val.map(res => {
          this.modelHasOneRelationshipsKey[res] = this.tableColumns[this.modelHasTable[res]]
        })
      }
    })
  },
  methods: {
    handleModelSubmit (e, val) {
      val['modelHasOneRelationshipsForeignKey'] = this.modelHasOneRelationshipsForeignKey
      val['modelHasOneRelationshipsLocalKey'] = this.modelHasOneRelationshipsLocalKey
      val['modelHasManyRelationshipsForeignKey'] = this.modelHasManyRelationshipsForeignKey
      val['modelHasManyRelationshipsLocalKey'] = this.modelHasManyRelationshipsLocalKey
      this.result = val
      console.log(val)
      generatorModel(val).then(res => {
        console.log(res)
        if (res.code == httpResponseCode.SUCCESS) {
          this.$message.success('预览成功')
          this.modelHtml = res.data.modelHtml
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
    copy () {
      this.$copyText(this.modelHtml).then(message => {
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
      if (this.modelHtml) {
        generatorModel(val).then(res => {
          console.log(res)
          if (res.code == httpResponseCode.SUCCESS) {
            this.modelPath = res.data.modelPath
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
