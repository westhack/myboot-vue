
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
    rules: [{ required: true, message: '不能为空' }],
    extra: '用于菜单标题'
  },
  'name': {
    name: 'name',
    label: '路由名称',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }],
    extra: '英文名称，唯一'
  },
  'icon': {
    name: 'icon',
    label: '图标',
    type: 'input',
    value: ''
  },

  'is_menu': {
    name: 'is_menu',
    label: '是否是路由',
    type: 'switch',
    value: true,
    rules: [],
    extra: '选择后必须选择：前端组件'
  },

  'component': {
    name: 'component',
    label: '前端组件',
    type: 'select',
    value: '',
    options: [],
    showSearch: true,
    allowClear: true,
    rules: [{ required: true, message: '不能为空' }],
    extra: '要显示的前端组件'
  },

  'hidden': {
    name: 'hidden',
    label: '是否隐藏',
    type: 'switch',
    value: false,
    rules: [],
    extra: '隐藏后不会左侧菜单显示'
  },
  'path': {
    name: 'path',
    label: '前端路由',
    type: 'input',
    value: '',
    rules: [{ required: false, message: '不能为空' }],
    extra: '前端路由，支持正则'
  },
  'default_path': {
    name: 'default_path',
    label: '前端路由默认路由',
    type: 'input',
    value: '',
    rules: [{ required: false, message: '不能为空' }],
    extra: '如果前端路由是正则，请填写一个默认路由'
  },
  'redirect': {
    name: 'redirect',
    label: '前端跳转路由',
    type: 'input',
    value: '',
    rules: [],
    extra: '前端路由默认跳转路由'
  },

  'hidden_header_content': {
    name: 'hidden_header_content',
    label: '是否隐藏内容头部',
    type: 'switch',
    value: true,
    rules: []
  },

  'is_permission': {
    name: 'is_permission',
    label: '是否是后台权限',
    type: 'switch',
    value: false,
    rules: [],
    extra: '选择后必须选择：后端权限路由'
  },
  'route': {
    name: 'route',
    label: '后端权限路由',
    type: 'tags',
    value: [],
    mode: 'multiple',
    maxTagCount: 10,
    showSearch: true,
    allowClear: true,
    rules: [{ required: false, message: '不能为空' }],
    extra: '关联后端接口权限路由-可多选'
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

  'status': {
    name: 'status',
    label: '状态可用',
    type: 'switch',
    value: true,
    rules: []
  },

  'buttons': {
    name: 'buttons',
    label: '快捷添加按钮',
    type: 'checkbox',
    data: [],
    value: [],
    rules: []
  }
}

export const defaultButtonFormData = {
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
    type: 'hidden',
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
    rules: [{ required: true, message: '不能为空' }],
    extra: '用于菜单标题'
  },
  'name': {
    name: 'name',
    label: '路由名称',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }],
    extra: '英文名称，唯一'
  },
  'is_menu': {
    name: 'is_menu',
    label: '是否是路由',
    type: 'switch',
    value: false,
    rules: [],
    hidden: true,
    extra: '选择后必须选择：前端组件'
  },
  'is_permission': {
    name: 'is_permission',
    label: '是否是后台权限',
    type: 'switch',
    value: false,
    rules: [],
    extra: '选择后必须选择：后端权限路由'
  },
  'route': {
    name: 'route',
    label: '后端权限路由',
    type: 'tags',
    value: [],
    mode: 'multiple',
    maxTagCount: 10,
    showSearch: true,
    allowClear: true,
    rules: [{ required: false, message: '不能为空' }],
    extra: '关联后端接口权限路由-可多选'
  },

  'sort_order': {
    name: 'sort_order',
    label: '排序',
    type: 'input-number',
    value: '99999',
    placeholder: '越小越靠前',
    rules: []
  }
}
