<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <FormGenerator ref="form" :fields="formFields" @handleSubmit="handleSubmit" />
      </a-col>
    </a-row>
  </div>
</template>

<script>

import FormGenerator from '@/components/FormGenerator/FormGenerator'
import { accountResetPassword } from '@/modules/user/api/account'
import { httpResponseCode } from '@/constants/httpResponseCode'
import httpResponse from '@/mixins/httpResponse'

export default {
  mixins: [httpResponse],
  components: {
    FormGenerator
  },
  data () {
    const vm = this

    return {
      submitLoading: false,
      formFields: {
        'old_password': {
          label: '原密码',
          name: 'old_password',
          value: '',
          type: 'password',
          rules: [{ required: true, message: '不能为空' }]
        },
        'new_password': {
          label: '新密码',
          name: 'new_password',
          value: '',
          type: 'password',
          rules: [{ required: true, message: '不能为空' }]
        },
        'new_password_confirmation': {
          label: '确认密码',
          name: 'new_password_confirmation',
          value: '',
          type: 'password',
          rules: [{ required: true, message: '不能为空' }, { validator: vm.handlePasswordCheck }]
        }
      }
    }
  },
  created () {

  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()

      this.submitLoading = true
      this.$refs['form'].validateFields((err, values) => {
        if (!err) {
          accountResetPassword(values)
            .then((res) => this.submitSuccess(res))
            .then((res) => {
              if (res.code === httpResponseCode.SUCCESS) {
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.submitLoading = true
            })
        }
      })
    },

    handlePasswordCheck (rule, value, callback) {
      const password = this.$refs.form.getFieldValue('new_password')

      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
