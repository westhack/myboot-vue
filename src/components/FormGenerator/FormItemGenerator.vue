<template>
  <div class="components-form-item">

    <a-input
      v-if="item.type === 'password'"
      v-model="inputValue"
      :size="size"
      :style="{width: width}"
      type="password"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      @change="onChange"
    >
      <a-icon slot="suffix" type="close-circle" v-if="inputValue" @click="emitEmpty()" />
    </a-input>

    <div v-else-if="item.type === 'label'">
      <div>
        <a-input type="text" v-model="inputValue" readonly disabled />
      </div>
    </div>

    <a-input-number
      v-else-if="item.type === 'input-number'"
      v-model="inputValue"
      :size="size"
      :style="{width: width}"
      :max="dataSource.max"
      :min="dataSource.min"
      :precision="dataSource.precision"
      :step="dataSource.step"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      @change="onChange"
    />

    <div v-else-if="item.type === 'switch'">
      <a-switch
        v-if="isSearch === false"
        v-model="inputValue"
        :size="size"
        :disabled="item.disabled"
        :checkedChildren="dataSource.checked "
        :unCheckedChildren="dataSource.unchecked"
        @change="onChange"
      />

      <a-select
        v-else
        v-model="inputValue"
        :size="size"
        :allowClear="item.allowClear"
        :style="{width: width}"
        @change="onChange"
        @search="onSearch"
        @select="onSelect"
      >
        <a-select-option value="">全部</a-select-option>
        <a-select-option :value="1">{{ dataSource.checked }}</a-select-option>
        <a-select-option :value="0">{{ dataSource.unchecked }}</a-select-option>
      </a-select>
    </div>

    <a-select
      v-else-if="item.type === 'select'"
      v-model="inputValue"
      :defaultValue="inputValue"
      :allowClear="item.allowClear || isSearch"
      :size="size"
      :style="{width: width}"
      :maxTagCount="item.maxTagCount ? item.maxTagCount : 1"
      :mode="item.multiple === true ? 'multiple' : item.mode"
      :showSearch="item.showSearch"
      :filterOption="filterOption"
      :labelInValue="item.labelInValue != undefined ? item.labelInValue : false"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
      :notFoundContent="fetching ? undefined : null"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option :key="index2" v-for="(option, index2) in dataSource" :value="option.value">{{ option.label }}</a-select-option>
    </a-select>

    <a-select
      v-else-if="item.type === 'multiple-select'"
      v-model="inputValue"
      :defaultValue="inputValue"
      :allowClear="item.allowClear"
      :size="size"
      :style="{width: width}"
      :maxTagCount="item.maxTagCount ? item.maxTagCount : 1"
      mode="multiple"
      :showSearch="item.showSearch"
      :filterOption="filterOption"
      :labelInValue="item.labelInValue != undefined ? item.labelInValue : false"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
      :notFoundContent="fetching ? undefined : null"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option :key="index2" v-for="(option, index2) in dataSource" :value="option.value">{{ option.label }}</a-select-option>
    </a-select>

    <a-select
      v-else-if="item.type === 'tags'"
      v-model="inputValue"
      :allowClear="item.allowClear"
      :size="size"
      :style="{width: width}"
      mode="tags"
      :showSearch="item.showSearch"
      :filterOption="filterOption"
      :labelInValue="item.labelInValue != undefined ? item.labelInValue : false"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
      :notFoundContent="fetching ? undefined : null"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option :key="index2" v-for="(option, index2) in dataSource" :value="option.value">{{ option.label }}</a-select-option>
    </a-select>

    <a-radio-group
      v-else-if="item.type === 'radio'"
      v-model="inputValue"
      :defaultValue="inputValue"
      :size="size"
      :disabled="item.disabled"
      :style="{width: width}"
      buttonStyle="solid"
      @change="onChange"
    >
      <a-radio style="margin-left: 10px;" :key="index" v-for="(option, index) in dataSource" :value="option.value" :disabled="option.disabled">{{ option.label }}</a-radio>
    </a-radio-group>

    <a-checkbox-group
      v-else-if="item.type === 'checkbox'"
      v-model="inputValue"
      :defaultValue="inputValue"
      :size="size"
      :disabled="item.disabled"
      :style="{width: width}"
      buttonStyle="solid"
      @change="onChange"
    >
      <a-row>
        <a-checkbox style="margin-left: 10px;" :key="index" v-for="(option, index) in dataSource" :value="option.value">{{ option.label }}</a-checkbox>
      </a-row>
    </a-checkbox-group>

    <a-rate
      v-else-if="item.type === 'rate'"
      v-model="inputValue"
      :size="size"
      :disabled="item.disabled"
      style="margin-left: 10px"
      allow-half
    />

    <a-cascader
      v-else-if="item.type === 'cascader'"
      v-model="inputValue"
      :defaultValue="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :options="dataSource"
      :loadData="item.loadData"
      :showSearch="item.showSearch"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
    />

    <a-auto-complete
      v-else-if="item.type === 'auto-complete'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      :dataSource="dataSource"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
    />

    <a-date-picker
      v-else-if="item.type === 'date-picker'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      :format="item.format"
      :disabledDate="item.disabledDate"
      :disabledTime="item.disabledTime"
      @change="onChange"
      @openChange="onOpenChange"
    ></a-date-picker>

    <a-month-picker
      v-else-if="item.type === 'month-picker'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      :format="item.format"
      :disabledDate="item.disabledDate"
      :disabledTime="item.disabledTime"
      @change="onChange"
      @openChange="onOpenChange"
    ></a-month-picker>

    <a-range-picker
      v-else-if="item.type === 'range-picker'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :format="item.format"
      :disabledDate="item.disabledDate"
      :disabledTime="item.disabledTime"
      @change="onChange"
      @openChange="onOpenChange"
    ></a-range-picker>

    <a-week-picker
      v-else-if="item.type === 'week-picker'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      :format="item.format"
      :disabledDate="item.disabledDate"
      :disabledTime="item.disabledTime"
      @change="onChange"
      @openChange="onOpenChange"
    ></a-week-picker>

    <a-time-picker
      v-else-if="item.type === 'time-picker'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :allowClear="item.allowClear"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      :use12Hours="item.use12Hours"
      :format="item.format"
      @change="onChange"
      @openChange="onOpenChange"
    />

    <a-tree-select
      v-else-if="item.type === 'tree-select'"
      v-model="inputValue"
      :style="{width: width}"
      :size="size"
      :disabled="item.disabled"
      :showSearch="item.showSearch"
      :treeData="dataSource"
      :loadData="item.loadData"
      :treeCheckable="item.treeCheckable"
      :showCheckedStrategy="item.showParent === true ? 'SHOW_PARENT' : null"
      :searchPlaceholder="item.searchPlaceholder"
      :dropdownStyle="item.dropdownStyle"
      :placeholder="item.placeholder"
      :allowClear="item.allowClear"
      :multiple="item.multiple"
      :treeDefaultExpandAll="item.treeDefaultExpandAll"
      @change="onChange"
      @search="onSearch"
      @select="onSelect"
    />

    <Tinymce
      v-else-if="item.type === 'editor'"
      :menubar="item.menubar"
      v-model="inputValue"
      @change="onChange"
    />

    <div v-else-if="item.type === 'input-image'">
      <InputImageUpload
        v-model="inputValue"
        :fileSize="item.file_size"
        :limit="item.limit"
        @change="onChange"
      />
    </div>

    <div v-else-if="item.type === 'image'">
      <MultipleImageUpload
        v-if="item.multiple === true"
        v-model="inputValue"
        :fileSize="item.file_size"
        :limit="item.limit"
        @change="onChange"
      />

      <SingleImageUpload
        v-else
        v-model="inputValue"
        :fileSize="item.file_size"
        @change="onChange"
      />

    </div>

    <MultipleImageUpload
      v-else-if="item.type === 'multiple-image'"
      v-model="inputValue"
      :fileSize="item.file_size"
      :limit="item.limit"
      @change="onChange"
    />

    <FileUpload
      v-else-if="item.type === 'file'"
      v-model="inputValue"
      @change="onChange"
    />

    <a-transfer
      v-else-if="item.type === 'transfer'"
      v-model="inputValue"
      :placeholder="item.placeholder"
      :dataSource="dataSource"
      :titles="item.titles"
      :showSearch="item.showSearch"
      :targetKeys="item.targetKeys"
      :selectedKeys="item.selectedKeys"
      @change="onChange"
      @selectChange="onSelectChange"
      @scroll="scroll"
      :render="item.render"
      :disabled="item.disabled"
    />

    <a-slider
      v-else-if="item.type === 'slider'"
      v-model="inputValue"
      :max="dataSource.max"
      :min="dataSource.min"
      :marks="dataSource.marks"
      :range="item.multiple"
      @change="onChange"
      @afterChange="onAfterChange"
    />

    <a-tree
      v-else-if="item.type === 'tree'"
      :checkable="item.checkable || item.treeCheckable"
      :treeData="dataSource"
      :defaultExpandedKeys="inputValue2"
      :defaultSelectedKeys="inputValue2"
      :defaultCheckedKeys="inputValue2"
      :autoExpandParent="item.treeDefaultExpandAll"
      :checkStrictly="item.checkStrictly"
      @select="onSelect"
      @check="onCheck"
      v-model="inputValue"
    >
      <template slot="title" slot-scope="{title}">{{ title }}</template>
    </a-tree>

    <a-textarea
      v-else-if="item.type === 'textarea'"
      v-model="inputValue"
      :placeholder="item.placeholder"
      :rows="4"
      @change="onChange"
    ></a-textarea>

    <div v-else-if="item.type === 'minimum'">
      <a-input-group compact style="display: flex">
        <a-input v-model="inputValue[0]" @change="onChange" style=" flex: 1; text-align: center" :placeholder="isArray(item.placeholder) ? item.placeholder[0] : item.placeholder" />
        <a-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="~" disabled />
        <a-input v-model="inputValue[1]" @change="onChange" style=" flex: 1; text-align: center;  border-left: 0" :placeholder="isArray(item.placeholder) ? item.placeholder[1] : item.placeholder" />
      </a-input-group>
    </div>

    <div v-else-if="item.type === 'color'">
      <div style="display: flex;flex-wrap: nowrap;flex-direction: row;width: 100%">
        <input type="color" v-model="inputValue" />
        <a-input v-model="inputValue" size="small" style="width: 70px;margin-right: 10px;margin-left: 10px"></a-input>
        <a-tag @click="cleanValue()"> 清空 </a-tag>
      </div>
    </div>

    <div v-else-if="item.type === 'goods'">
      <Goods
        v-model="inputValue"
        :max="dataSource.max"
        :min="dataSource.min"
        :label="item.label"
      ></Goods>
    </div>

    <a-input
      v-else
      v-model="inputValue"
      :style="{width: width}"
      type="input"
      :size="size"
      :disabled="item.disabled"
      :placeholder="item.placeholder"
      @change="onChange"
    />

  </div>
</template>

<script>
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { TreeSelect } from 'ant-design-vue'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'
import FileUpload from '@/components/Upload/FileUpload'
import MultipleImageUpload from '@/components/Upload/MultipleImageUpload'
import InputImageUpload from '@/components/Upload/InputImageUpload'
import Tinymce from '@/components/Tinymce/index'
import { axios } from '@/utils/request'
import _ from 'lodash'
import LTT from 'list-to-tree'

export default {
  name: 'FormItemGenerator',
  components: { Tinymce, AFormItem, SingleImageUpload, MultipleImageUpload, InputImageUpload, FileUpload },
  props: {
    item: {
      type: Object,
      required: true
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    styles: {
      type: [String, Object],
      default: null
    },
    options: {
      type: [String, Object, Array],
      default: null
    },
    itemChange: {
      type: [String, Function],
      default: null
    },
    itemSelect: {
      type: [String, Function],
      default: null
    },
    itemSearch: {
      type: [String, Function],
      default: null
    },
    itemOpenChange: {
      type: [String, Function],
      default: null
    },
    itemSelectChange: {
      type: [String, Function],
      default: null
    },
    itemAfterChange: {
      type: [String, Function],
      default: null
    },
    value: {
      type: [String, Array, Object, Number, Function, Boolean],
      default: ''
    }
  },
  data () {
    const vm = this
    let value = null

    if (vm.value !== undefined && vm.value != null) {
      value = this.parseValue(vm.value)
    } else {
      value = this.parseValue()
    }

    return {
      mapVisible: false,
      inputValue: value,
      inputValue2: _.cloneDeep(value),
      fetching: false,
      searchDataSource: null
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    'dataSource': function () {
      let dataSource = this.searchDataSource || this.options || this.item.options
      if (dataSource != null) {
        if (this.item.type === 'select' || this.item.type === 'multiple-select' || this.item.type === 'tags' || this.item.type === 'radio' || this.item.type === 'checkbox') {
          dataSource = dataSource.map((value, index) => {
            if (_.isString(value) || _.isNumber(value)) {
              return {
                'label': value,
                'value': value == null ? null : value + '' // 转字符串
              }
            } else {
              // return value
              return {
                'label': value['label'],
                'value': value['value'] == null ? null : value['value'] + '' // 转字符串
              }
            }
          })
        }
      }

      if (this.item.type === 'auto-complete') {
        dataSource = dataSource.map((value, index) => {
          if (_.isString(value) || _.isNumber(value)) {
            return value
          } else {
            return value['value']
          }
        })
      }

      if (this.item.type === 'input-number' || this.item.type === 'slider') {
        if (dataSource == null) {
          dataSource = {}
        }

        if (dataSource['max'] === undefined) {
          dataSource['max'] = Infinity
        }

        if (dataSource['min'] === undefined) {
          dataSource['min'] = -Infinity
        }
      }

      if (this.item.type === 'tree' || this.item.type === 'tree-select') {
        return this.parseData(dataSource)
      }

      if (this.item.type === 'switch') {
        return Object.assign({ 'checked': '是', 'unchecked': '否' }, dataSource)
      }

      return dataSource
    },

    'onChange': function () {
      const callback = this.itemChange || this.item.change
      return this.callback(callback)
    },

    'onSelect': function () {
      const callback = this.itemSelect || this.item.select
      return this.callback(callback)
    },

    'filterOption': function () {
      const callback = this.itemSearch || this.item.search
      if (callback && _.isString(callback)) {
        return false
      }

      return true
    },

    'onSearch': function () {
      const callback = this.itemSearch || this.item.search
      if (callback && _.isString(callback)) {
        return this.getSearch
      }
      return this.callback(callback)
    },

    'onOpenChange': function () {
      const callback = this.itemOpenChange || this.item.openChange
      return this.callback(callback)
    },

    'onSelectChange': function () {
      const callback = this.itemSelectChange || this.item.selectChange
      return this.callback(callback)
    },

    'onAfterChange': function () {
      const callback = this.itemAfterChange || this.item.afterChange
      return this.callback(callback)
    },

    'onCheck': function () {
      const callback = this.itemCheck || this.item.check
      return this.callback(callback)
    }
  },
  watch: {
    'inputValue': function (val) {
      if (this.item.checkStrictly === true) {
        this.$emit('input', val['checked'])
        this.$emit('change', val['checked'])
      } else {
        if (this.item.type === 'minimum' && (val[0] == '' || val[1] == '')) {
          this.$emit('input', null)
          this.$emit('change', null)
        } else {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    'item.value': function (val) {
      this.inputValue = this.parseValue(val)
    },
    'item.type': function (val) {
      if (['date-picker', 'week-picker', 'month-picker', 'range-picker', 'time-picker'].indexOf(val) != -1) {
        this.item.value = null
      } else {
        this.inputValue = this.parseValue(this.item.value)
      }
    },
    'item': function (val) {
      // this.inputValue = this.parseValue(this.item.value)
      this.inputValue = this.parseValue(val.value)
    }
  },
  methods: {

    cleanValue () {
      this.inputValue = ''
    },
    getSearch (value) {
      const method = this.item.method || 'get'
      this.fetching = true
      const url = this.itemSearch || this.item.search
      axios({
        url: url,
        method: method,
        data: { keywords: value }
      }).then(res => {
        if (res.data.items) {
          let _callback = null
          if (this.item.callback !== false) {
            _callback = this.item.callback || this.getCallback()
          }

          if (_.isFunction(_callback)) {
            _callback(res.data.items)
          } else {
            this.searchDataSource = res.data.items
          }
        }
      }).finally(() => {
        // this.fetching = false
      })
    },

    getCallback () {
      if (this.item.type === 'select' || this.item.type === 'multiple-select') {
        return this.selectCallback
      } else if (this.item.type === 'tree-select') {
        return this.treeSelectCallback
      }

      return null
    },

    fetchData (value) {
      this.fetching = true
      const url = this.item.url
      const method = this.item.method || 'get'

      let _callback = null

      if (this.item.callback !== false) {
        _callback = this.item.callback || this.getCallback()
      }

      if (url !== undefined && url !== '') {
        axios({
          url: url,
          method: method,
          data: { keywords: value }
        }).then(res => {
          if (res.data.items) {
            if (_.isFunction(_callback)) {
              _callback(res.data.items)
            } else {
              this.searchDataSource = res.data.items
            }
          }
        }).finally(() => {
          // this.fetching = false
        })
      }
    },

    parseValue (val) {
      let value = null

      value = val || this.item.value

      if (this.item.type === 'input' || this.item.type === 'textarea' || this.item.type === 'input-number') {
        value = (_.isArray(value) || _.isObject(value)) ? value.toString() : value
      } else if (this.item.type === 'minimum') {
        value = value || ['', '']
      } else if (this.item.type === 'switch') {
        if (this.isSearch) {
          value = ''
        } else {
          if (parseInt(value) === 1 || value === true) {
            value = true
          } else {
            value = false
          }
        }
      } else if (this.item.type === 'tags') {
        if (this.isSearch) {
          value = []
        } else {
          if (value) {
            if (!_.isArray(value)) {
              value = value.split(',')
            }
          } else {
            value = []
          }
        }
      } else if ((this.item.type === 'tree-select' && this.item.treeCheckable != true)) {
        if (value != null) {
          value = value + ''
        } else {
          value = ''
        }
      } else if (this.item.type === 'slider') {
        // value = parseInt(value)
      } else if (this.item.type === 'input-number') {
        // value = parseInt(value)
      } else if (this.item.type === 'select') {
        if (!(this.item.mode === 'multiple' || this.item.multiple === true)) {
          if (value != null) {
            value = value + ''
          } else {
            value = ''
          }
        }
      } else if (this.item.type === 'file') {
        if (value) {
          if (!_.isArray(value)) {
            value = value.split(',')
          }
        } else {
          value = []
        }
      }

      return value
    },
    emitEmpty () {
      this.inputValue = null
    },

    isFunction (fun) {
      return _.isFunction(fun)
    },

    isArray (fun) {
      return _.isArray(fun)
    },

    callback (callback) {
      if (_.isFunction(callback)) {
        return callback
      }

      if (_.isString(callback) && callback.indexOf('function') > -1) {
        const fun = new Function('return ' + callback)
        return fun()
      }

      return (val) => {}
    },

    parseData (val) {
      const valueName = this.item['valueName'] != null ? this.item['valueName'] : 'value'
      const labelName = this.item['labelName'] != null ? this.item['labelName'] : 'label'

      const _parseData = (tree) => {
        for (let i = 0; i < tree.length; i++) {
          tree[i]['key'] = tree[i]['value'] = (tree[i][valueName] == null ? null : tree[i][valueName] + '')
          tree[i]['title'] = tree[i][labelName]

          if (tree[i].children && tree[i].children.length > 0) {
            _parseData(tree[i].children)
          }
        }
        return tree
      }

      return _parseData(val)
    },

    selectCallback (list) {
      const labelName = this.item['labelName'] || 'label'
      const valueName = this.item['valueName'] || 'value'

      list.forEach(res => {
        res['label'] = res[labelName]
        res['value'] = res[valueName]
      })

      this.searchDataSource = list
    },

    treeSelectCallback (list) {
      const idName = this.item['idName'] || 'id'
      const parentName = this.item['parentName'] || 'parent_id'

      const ltt = new LTT(list, {
        key_id: idName,
        key_parent: parentName,
        key_child: 'children'
      })
      const tree = ltt.GetTree()

      this.searchDataSource = this.parseData(tree)
    }
  }
}

</script>

<style scoped>
  #components-form-item >>>  .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  #components-form-item >>>  .anticon-close-circle:hover {
    color: #999;
  }
  #components-form-item >>>  .anticon-close-circle:active {
    color: #666;
  }
</style>
