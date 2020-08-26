export const defaultCategoryFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'name': {
    name: 'name',
    label: '名称',
    type: 'input',
    value: '',
    change: null,
    rules: [{ required: true, message: '不能为空' }]
  },
  'logo': {
    name: 'logo',
    label: '图标',
    type: 'image',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'sort_order': {
    name: 'sort_order',
    label: '排序',
    type: 'input-number',
    value: '99999',
    placeholder: '越小越靠前',
    rules: [{ required: true, message: '不能为空' }]
  },
  'status': {
    name: 'status',
    label: '状态',
    type: 'switch',
    value: false,
    rules: []
  }
}

export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'category_id': {
    name: 'category_id',
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
    rules: [{ required: true, message: '不能为空' }]
  },
  'source': {
    name: 'source',
    label: '来源',
    type: 'input',
    value: '本站',
    rules: []
  },
  'author': {
    name: 'author',
    label: '作者',
    type: 'input',
    value: '',
    rules: []
  },
  'image': {
    name: 'image',
    label: '缩略图',
    type: 'image',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'keywords': {
    name: 'keywords',
    label: '关键词',
    type: 'tags',
    value: '',
    extra: '支持自定义，输入关键词回车添加',
    rules: []
  },
  'description': {
    name: 'description',
    label: '简介',
    type: 'textarea',
    value: '',
    rules: []
  },
  'content': {
    name: 'content',
    label: '内容',
    type: 'editor',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'sort_order': {
    name: 'sort_order',
    label: '排序',
    type: 'input-number',
    value: '99999',
    placeholder: '越小越靠前',
    rules: [{ required: true, message: '不能为空' }]
  },
  'recommend': {
    name: 'recommend',
    label: '推荐',
    type: 'switch',
    value: true,
    rules: []
  },
  'index_recommend': {
    name: 'index_recommend',
    label: '首页推荐',
    type: 'switch',
    value: true,
    rules: []
  },
  'status': {
    name: 'status',
    label: '状态',
    type: 'switch',
    value: true,
    rules: []
  }
}
