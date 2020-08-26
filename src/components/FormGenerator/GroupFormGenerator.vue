<template>
  <div>

    <a-form
      :layout="formLayout"
      :form="form"
      @submit="handleSubmit"
    >
      <div :key="index" v-for="(_formData, index) in formData">

        <a-card size="small" :title="_formData.label" style="margin-bottom: 10px">
          <div :key="index2" v-for="(item, index2) in _formData.children">
            <a-form-item
              v-bind="formItemLayout"
              :label="item.label"
              :extra="item.extra"
              :style="{'display': item.type === 'hidden' ? 'none' : ''}"
            >
              <FormItemGenerator
                :item="item"
                :options="item.data"
                :value="item.value"
                v-decorator="[
                  `${item.name}`,
                  {
                    initialValue: item.value,
                    validateTrigger: ['change', 'blur'],
                    rules: item.rules
                  }
                ]"
              />

            </a-form-item>
            <slot name="form-item" :item="item"> </slot>
          </div>
        </a-card>

      </div>

      <slot name="form-body"> </slot>

      <slot name="footer" v-if="showFooter">
        <a-form-item
          v-bind="footerItemLayout"
        >
          <a-button
            type="primary"
            html-type="submit"
          >
            保存
          </a-button>
          <a-button
            :style="{ marginLeft: '8px' }"
            @click="handleReset"
          >
            重置
          </a-button>
        </a-form-item>
      </slot>
    </a-form>

  </div>
</template>

<script>
import FormItemGenerator from './FormItemGenerator'
import httpResponse from '@/mixins/httpResponse'
import { axios } from '@/utils/request'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'GroupFormGenerator',
  components: { FormItemGenerator },
  mixins: [httpResponse],
  props: {
    fields: {
      type: [Array, Object],
      required: true
    },
    action: {
      type: [String],
      default: null
    },
    formItemLayout: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    footerItemLayout: {
      type: Object,
      default: function () {
        return {
        }
      }
    },
    formLayout: {
      type: String,
      default: 'vertical'
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  beforeCreate () {

  },
  created () {
    this.getFieldDecorator()
  },
  data () {
    const vm = this
    return {
      form: vm.$form.createForm(this),
      formData: vm.fields,
      spinning: false
    }
  },
  watch: {
    fields: function (val) {
      this.formData = this.fields
    }
  },
  methods: {
    handleSubmit (e) {
      e && e.preventDefault()

      if (this.action != null) {
        this.form.validateFields((err, values) => {
          console.log(err)
          values = this.getFieldsValue()
          if (!err) {
            axios({
              url: this.action,
              method: 'post',
              data: values
            }).then((res) => this.submitSuccess(res))
              .then((res) => {
                this.$emit('handleSubmit', res)
              })
              .catch(err => this.requestFailed(err))
              .finally(() => { this.spinning = false })
          }
        })
      } else {
        this.$emit('handleSubmit', e)
      }
    },

    getFieldDecorator () {
      _.each(this.fields, (field) => {
        this.form.getFieldDecorator(field.name)
      })
    },

    getValues () {
      const values = {}
      _.each(this.fields, (field) => {
        values[field.name] = field.value
      })

      return values
    },

    handleReset () {
      this.formData = _.cloneDeep(this.fields)
      this.form.resetFields()
      this.$emit('handleReset')
    },

    resetFields () {
      this.formData = _.cloneDeep(this.fields)
      this.form.resetFields()
    },

    setFieldsValue (obj) {
      this.form.setFieldsValue(obj)
    },

    getFieldValue (fieldName) {
      return this.form.getFieldValue(fieldName)
    },

    getFieldsValue (fieldNames) {
      const values = this.form.getFieldsValue(fieldNames)
      let fields = this.fields
      if (_.isArray(this.fields)) {
        fields = _.keyBy(this.fields, 'name')
      }

      const ret = {}

      _.each(values, (value, name) => {
        let _value = null

        if (!_.isEmpty(value)) {
          if (_.isArray(value) && value.length === 2 && moment.isMoment(value[0]) && moment.isMoment(value[1])) {
            let format = 'YYYY-MM-DD'
            if (fields[name]['format'] !== undefined) {
              format = fields[name]['format']
            }

            const start = value[0].toString()
            const end = value[1].toString()

            _value = []
            _value[0] = moment(start).format(format).toString()
            _value[1] = moment(end).format(format).toString()
          } else if (moment.isMoment(value)) {
            let format = 'YYYY-MM-DD'
            if (fields[name]['format'] !== undefined) {
              format = fields[name]['format']
            } else if (fields[name]['type'] === 'time-picker') {
              format = fields[name]['format'] ? fields[name]['format'] : 'hh:mm:ss'
            }

            _value = moment(value).format(format).toString()
          } else {
            _value = value
          }
        } else {
          _value = value
        }

        ret[name] = _value
      })

      return ret
    },

    validateFields (callback) {
      if (callback && typeof callback === 'function') {
        this.form.validateFields(callback)
      }
    },

    isFunction (f) {
      return _.isFunction(f)
    }
  }
}

</script>
