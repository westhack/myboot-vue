<template>
  <div>

    <a-modal
      title="结果"
      :visible="visible"
      @ok="() => { this.visible = false }"
      @cancel="() => { this.visible = false }"
    >
      <a-textarea :value="formValue" style="height: 500px"></a-textarea>
    </a-modal>

    <a-card title="基础搜索表单" :bordered="false">
      <search-form-generator ref="search2" :fields="searchFields2" @handleSubmit="handleSearch2" @handleReset="handleReset" ></search-form-generator>
    </a-card>

    <a-card title="高级搜索表单" :bordered="false">
      <search-form-generator
        ref="search"
        :fields="searchFields"
        :operators="operators"
        :showType="true"
        :showOperator="true"
        @handleSubmit="handleSearch"
        @handleReset="handleReset" ></search-form-generator>
    </a-card>

  </div>
</template>

<script>
import ACol from 'ant-design-vue/es/grid/Col'
import ATextarea from 'ant-design-vue/es/input/TextArea'

const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake'
    }]
  }]
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men'
    }]
  }]
}]

const treeData = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0'
  }]
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    title: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
    disabled: true
  }, {
    title: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1'
  }, {
    title: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2'
  }]
}]

export default {
  name: 'View1',
  components: {
    ATextarea,
    ACol
  },
  data () {
    return {
      visible: false,
      formValue: null,
      form: this.$form.createForm(this),
      operators: [
        {
          label: '等于',
          value: '='
        },
        {
          label: '小于',
          value: '<'
        },
        {
          label: '大于',
          value: '>'
        },
        {
          label: '小于等于',
          value: '<='
        },
        {
          label: '大于等于',
          value: '>='
        },
        {
          label: '不等于',
          value: '!='
        },
        {
          label: '在列表中',
          value: 'in'
        },
        {
          label: '不在列表中',
          value: 'not in'
        },
        {
          label: '包含',
          value: 'like'
        },
        {
          label: '不包含',
          value: 'not like'
        },
        {
          label: '以开始',
          value: 'ilike'
        },
        {
          label: '介于',
          value: 'between'
        },
        {
          label: '不介于',
          value: 'not between'
        }
      ],
      searchFields: [
        {
          name: 'input-number',
          label: 'input-number',
          type: 'input-number',
          disabled: true,
          operatorDisabled: true,
          value: '123',
          operator: '=',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'input',
          label: 'input',
          type: 'input',
          value: '123',
          operator: '=',
          typeDisabled: true,
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'select',
          label: 'select',
          type: 'select',
          mode: 'multiple',
          operator: 'in',
          options: [
            {
              label: 'red',
              value: 'red'
            },
            {
              label: 'green',
              value: 'green'
            },
            {
              label: 'blue',
              value: 'blue'
            }
          ],
          value: ['red']
        },
        {
          name: 'cascader',
          label: 'cascader',
          type: 'cascader',
          options: residences,
          operator: '='
        },
        {
          name: 'date-picker',
          label: 'date-picker',
          type: 'date-picker',
          operator: '=',
          format: 'YYYY-MM-DD'
        },
        {
          name: 'range-picker',
          label: 'range-picker',
          type: 'range-picker',
          operator: '=',
          format: 'YYYY-MM-DD'
        },
        {
          name: 'time-picker',
          label: 'time-picker',
          type: 'time-picker',
          use12Hours: true,
          operator: '=',
          format: 'H:mm:ss a'
        },
        {
          name: 'tree-select',
          label: 'tree-select',
          type: 'tree-select',
          treeDefaultExpandAll: true,
          labelName: 'title',
          valueName: 'key',
          options: treeData,
          operator: '='
        }
      ],
      searchFields2: [
        {
          name: 'input-number',
          label: 'input-number',
          type: 'input-number',
          value: '123',
          operator: '=',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'input',
          label: 'input',
          type: 'input',
          value: '123',
          operator: '=',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'select',
          label: 'select',
          type: 'select',
          mode: 'multiple',
          operator: 'in',
          options: [
            {
              label: 'red',
              value: 'red'
            },
            {
              label: 'green',
              value: 'green'
            },
            {
              label: 'blue',
              value: 'blue'
            }
          ],
          value: ['red']
        },
        {
          name: 'cascader',
          label: 'cascader',
          type: 'cascader',
          options: residences,
          operator: '='
        },
        {
          name: 'date-picker',
          label: 'date-picker',
          type: 'date-picker',
          operator: '=',
          format: 'YYYY-MM-DD'
        },
        {
          name: 'range-picker',
          label: 'range-picker',
          type: 'range-picker',
          operator: '=',
          format: 'YYYY-MM-DD'
        },
        {
          name: 'time-picker',
          label: 'time-picker',
          type: 'time-picker',
          use12Hours: true,
          operator: '=',
          format: 'H:mm:ss a'
        },
        {
          name: 'tree-select',
          label: 'tree-select',
          type: 'tree-select',
          treeDefaultExpandAll: true,
          labelName: 'title',
          valueName: 'key',
          options: treeData,
          operator: '='
        }
      ]
    }
  },
  methods: {

    handleSearch (e) {
      e.preventDefault()

      this.visible = true
      this.formValue = JSON.stringify(this.$refs['search'].getFieldsValue(), null, '\t')
    },

    handleSearch2 (e) {
      e.preventDefault()
      this.visible = true
      this.formValue = JSON.stringify(this.$refs['search2'].getFieldsValue(), null, '\t')
    },

    handleReset () {
      console.log(123)
    }
  }
}
</script>

<style scoped>
</style>
