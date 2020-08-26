export const defaultSearchFormData = [
  {
    name: 'username',
    label: '账号',
    type: 'input',
    value: '',
    operator: '='
  },
  {
    name: 'nickname',
    label: '昵称',
    type: 'input',
    value: '',
    operator: '='
  },
  {
    name: 'phone',
    label: '手机号',
    type: 'input',
    value: '',
    operator: '='
  },
  {
    name: 'status',
    label: '状态',
    type: 'switch',
    value: '',
    operator: '='
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
  'username': {
    name: 'username',
    label: '账号',
    type: 'input',
    value: '',
    rules: [{ required: true, message: '不能为空' }]
  },
  'password': {
    name: 'password',
    label: '密码',
    type: 'input',
    value: '',
    rules: [],
    extra: '不修改请留空'
  },
  'roles': {
    name: 'roles',
    label: '角色',
    type: 'select',
    value: [],
    rules: [],
    multiple: true,
    options: [],
    placeholder: '所属角色'
  },
  'nickname': {
    name: 'nickname',
    label: '昵称',
    type: 'input',
    value: '',
    rules: []
  },
  'phone': {
    name: 'phone',
    label: '手机号',
    type: 'input',
    value: '',
    rules: []
  },
  'avatar': {
    name: 'avatar',
    label: '头像',
    type: 'image',
    value: '',
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

export const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' },
    width: '50px',
    align: 'center',
    dataIndex: 'id'
  },
  {
    title: '头像',
    scopedSlots: { customRender: 'image' },
    dataIndex: 'avatar',
    align: 'center',
    width: '50px'
  },
  {
    title: '账号',
    dataIndex: 'username',
    width: '150px',
    align: 'center'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: '150px',
    align: 'center'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '120px',
    align: 'center'
  },
  {
    title: '注册时间',
    dataIndex: 'created_at',
    width: '150px',
    align: 'center',
    sorter: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: '70px',
    align: 'center'
  },
  {
    title: '角色',
    dataIndex: 'roles',
    scopedSlots: { customRender: 'roles' }
  },
  {
    title: '操作',
    width: '100px',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
    fixed: 'right'
  }
]
