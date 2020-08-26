
export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'parent_id': {
    name: 'parent_id',
    label: '上级菜单',
    type: 'tree-select',
    value: '',
    options: [],
    showSearch: true,
    rules: [{ required: true, message: '不能为空' }]
  },
  'title': {
    name: 'title',
    label: '名称',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'icon': {
    name: 'icon',
    label: '图标',
    type: 'input',
    value: ''
  },
  'name': {
    name: 'name',
    label: '路由名称',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'component': {
    name: 'component',
    label: '前端组件',
    type: 'select',
    value: '',
    options: [],
    showSearch: true,
    rules: [{ required: true, message: '不能为空' }]
  },
  'path': {
    name: 'path',
    label: '前端路由',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'redirect': {
    name: 'redirect',
    label: '前端跳转路由',
    type: 'input',
    value: '',
    rules: []
  },
  'route': {
    name: 'route',
    label: '后端权限路由',
    type: 'select',
    value: '',
    showSearch: true,
    rules: [],
    extra: '后端接口权限路由'
  },
  'sort_order': {
    name: 'sort_order',
    label: '排序',
    type: 'input-number',
    value: '99999',
    placeholder: '越小越靠前',
    rules: []
  },
  'keep_alive': {
    name: 'keep_alive',
    label: '前端组件持久化',
    type: 'switch',
    value: true,
    rules: []
  },
  'is_menu': {
    name: 'is_menu',
    label: '是否是菜单',
    type: 'switch',
    value: true,
    rules: []
  },
  'hidden': {
    name: 'hidden',
    label: '隐藏左侧显示',
    type: 'switch',
    value: false,
    rules: []
  },
  'is_permission': {
    name: 'is_permission',
    label: '是否是权限',
    type: 'switch',
    value: true,
    rules: []
  },
  'status': {
    name: 'status',
    label: '状态可用',
    type: 'switch',
    value: true,
    rules: []
  }
}
