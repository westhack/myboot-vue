
export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'title': {
    name: 'title',
    label: '名称',
    type: 'input',
    value: '',
    change: null,
    rules: [{ required: true, message: '不能为空' }]
  },
  'name': {
    name: 'name',
    label: '键',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'data': {
    name: 'data',
    label: '数据',
    type: 'textarea',
    value: '',
    placeholder: '名称|值，一行一条',
    rules: [{ required: true, message: '不能为空' }]
  },
  'delimiter': {
    name: 'delimiter',
    label: '分隔符',
    type: 'input',
    value: '|',
    rules: [{ required: true, message: '不能为空' }]
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
