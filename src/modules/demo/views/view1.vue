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

    <a-card title="基础表单1" :bordered="false">
      <form-generator ref="form" @handleSubmit="handleSubmit" :fields="fields">
      </form-generator>
    </a-card>

    <a-card title="基础表单2" :bordered="false">
      <form-generator
        ref="form2"
        @handleSubmit="handleSubmit"
        :fields="fields"
        :formItemLayout="formItemLayout"
        :formLayout="formLayout"
        :footerItemLayout="footerItemLayout">
      </form-generator>
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
      formLayout: 'horizontal',
      footerItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      fields: [
        {
          name: 'input',
          label: '文本',
          type: 'input',
          value: '',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'input-number',
          label: '数字',
          type: 'input-number',
          value: '123',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'image',
          label: '图片选择',
          type: 'image',
          value: 'http://game.cdn.limaopu.com/public/images/20200808/pZIlGwPG31Bu61oY1bfewNDjzaAlWgdt0aEOt5H5.jpeg',
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'file',
          label: '文件选择',
          type: 'file',
          value: ['http://game.cdn.limaopu.com/public/images/20200808/djFvtAX0zJPiuKpaBOgifbeX41eWIgjLypCfkX6k.jpeg'],
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'minimum',
          label: '数字区间',
          type: 'minimum',
          value: [1, 100],
          rules: [{ required: true, message: '不为空' }]
        },
        {
          name: 'editor',
          label: '富文本',
          type: 'editor',
          value: '这是一条文本'
        },
        {
          name: 'color',
          label: '颜色',
          type: 'color',
          value: '#ff00ff'
        },
        {
          name: 'select',
          label: '下拉选择',
          type: 'select',
          mode: 'multiple',
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
          name: '单选',
          label: 'radio',
          type: 'radio',
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
          value: 'blue'
        },
        {
          name: '多选',
          label: 'checkbox',
          type: 'checkbox',
          options: [
            {
              label: 'red',
              value: 'red',
              checked: true
            },
            {
              label: 'green',
              value: 'green',
              checked: true
            },
            {
              label: 'blue',
              value: 'blue',
              checked: true
            }
          ],
          value: ['blue']
        },
        {
          name: '评分',
          label: 'rate',
          type: 'rate',
          value: 3.5
        },
        {
          name: 'switch',
          label: '开关',
          type: 'switch',
          value: true
        },
        {
          name: 'cascader',
          label: '级联选择',
          type: 'cascader',
          options: residences,
          change: function (val) {
            console.log(val)
          }
        },
        {
          name: 'date-picker',
          label: '日期',
          type: 'date-picker',
          change: function (val) {
            console.log(val)
          }
        },
        {
          name: 'range-picker',
          label: '日期范围',
          type: 'range-picker',
          change: function (val) {
            console.log(val)
          }
        },
        {
          name: 'time-picker',
          label: '时间选择',
          type: 'time-picker',
          use12Hours: true,
          change: function (val) {
            console.log(val)
          }
        },
        {
          name: 'tree-select',
          label: '数选择',
          type: 'tree-select',
          treeDefaultExpandAll: true,
          labelName: 'title',
          valueName: 'key',
          options: treeData,
          change: function (val) {
            console.log(val)
          }
        }
      ]
    }
  },
  methods: {
    handleSubmit (e, val) {
      console.log('Received values of form: ', val)
      this.visible = true
      this.formValue = JSON.stringify(val, null, '\t')
    },

    handleReset () {
      this.$refs['form'].form.resetFields()
    }
  }
}
</script>

<style scoped>
</style>
