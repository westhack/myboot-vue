
import { types } from '@/components/FormGenerator/Types'

export const defaultFormData = {
  'id': {
    name: 'id',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'module': {
    name: 'module',
    label: '',
    type: 'hidden',
    value: '',
    rules: []
  },
  'parent_name': {
    name: 'parent_name',
    label: '分组',
    type: 'select',
    value: '',
    rules: []
  },
  'label': {
    name: 'label',
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
  'value': {
    name: 'value',
    label: '值',
    type: 'textarea',
    value: '',
    rules: []
  },
  'type': {
    name: 'type',
    label: '类型',
    type: 'select',
    value: 'input',
    options: types,
    showSearch: true,
    rules: [{ required: true, message: '不能为空' }]
  },
  'data_source': {
    name: 'data_source',
    label: '数据',
    type: 'textarea',
    value: '',
    rules: []
  },
  'rules_source': {
    name: 'rules_source',
    label: '规则',
    type: 'textarea',
    value: '',
    rules: []
  },
  'multiple': {
    name: 'multiple',
    label: '是否多值',
    type: 'switch',
    value: false,
    rules: []
  },
  'description': {
    name: 'description',
    label: '描述',
    type: 'input',
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
