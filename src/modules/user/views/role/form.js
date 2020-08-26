
export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'guard_name': {
    name: 'guard_name',
    label: '守卫',
    type: 'select',
    value: '',
    options: [],
    rules: [{ required: true, message: '不能为空' }]
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
    label: '角色名',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'permissions': {
    name: 'permissions',
    label: '权限',
    type: 'tree',
    value: [],
    rules: [],
    multiple: true,
    placeholder: '角色所属权限',
    treeCheckable: true,
    treeDefaultExpandAll: true,
    checkStrictly: true,
    options: []
  },
  'description': {
    name: 'description',
    label: '说明',
    type: 'textarea',
    value: '',
    rules: []
  }
}
