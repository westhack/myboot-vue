export const types = [
  {
    label: '文本输入框',
    value: 'input'
  },
  {
    label: '数字输入框',
    value: 'input-number'
  },
  {
    label: '多行文本',
    value: 'textarea'
  },
  {
    label: '选择器',
    value: 'select'
  },
  {
    label: '单选框',
    value: 'radio'
  },
  {
    label: '复选框',
    value: 'checkbox'
  },
  {
    label: '练级选择',
    value: 'cascader'
  },
  {
    label: '自动完成',
    value: 'autocomplete'
  },
  {
    label: '树形选择',
    value: 'tree-select'
  },
  {
    label: '开关',
    value: 'switch'
  },
  {
    label: '日期选择',
    value: 'date-picker'
  },
  {
    label: '时间选择',
    value: 'time-picker'
  },
  {
    label: '滑动输入条',
    value: 'slider'
  },
  {
    label: '评分',
    value: 'rate'
  },
  {
    label: '图片',
    value: 'image'
  },
  {
    label: '文件',
    value: 'file'
  },
  {
    label: '区间数',
    value: 'minimum'
  },
  {
    label: '富文本',
    value: 'editor'
  }
]

export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'code': {
    name: 'code',
    label: '类别',
    type: 'select',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'title': {
    name: 'title',
    label: '标题',
    type: 'input',
    value: '',
    change: null,
    rules: [{ required: true, message: '不能为空' }]
  },
  'image': {
    name: 'image',
    label: '幻灯片',
    type: 'image',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'type': {
    name: 'type',
    label: '类型',
    type: 'select',
    value: '1',
    options: [
      {
        label: '外部地址',
        value: '1'
      },
      {
        label: '小程序路由',
        value: '2'
      }
    ],
    rules: []
  },
  'jump': {
    name: 'jump',
    label: '调整地址',
    type: 'input',
    value: false,
    rules: []
  },
  'data': {
    name: 'data',
    label: '跳转数据',
    type: 'textarea',
    value: '',
    rules: []
  },
  'description': {
    name: 'description',
    label: '描述',
    type: 'textarea',
    value: '',
    rules: []
  },
  'sort_order': {
    name: 'sort_order',
    label: '排序',
    type: 'input-number',
    value: '99999',
    placeholder: '越小越靠前',
    rules: [{ required: true, message: '不能为空' }]
  }
}
