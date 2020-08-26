import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import PermissionAuth from '@/utils/permission'
// import '@/components/use'
import './directives/permission'
import splitPane from 'vue-splitpane'

import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

import FormGenerator from '@/components/FormGenerator/FormGenerator'
import FormItemGenerator from '@/components/FormGenerator/FormItemGenerator'
import SearchFormGenerator from '@/components/FormGenerator/SearchFormGenerator'
import GroupFormGenerator from '@/components/FormGenerator/GroupFormGenerator'

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)

Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
Vue.use(PermissionAuth)
Vue.use(VueCropper)

Vue.component('split-pane', splitPane)
Vue.component('form-generator', FormGenerator)
Vue.component('search-form-generator', SearchFormGenerator)
Vue.component('form-item-generator', FormItemGenerator)
Vue.component('group-form-item-generator', GroupFormGenerator)
