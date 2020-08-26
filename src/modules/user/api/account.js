import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1'

const user = {
  accountAvatarUpload: API_VERSION + '/account/avatar/upload',
  accountResetPassword: API_VERSION + '/account/reset/password',
  accountUpdate: API_VERSION + '/account/profile'
}

export function accountUpdate (parameter) {
  return axios({
    url: user.accountUpdate,
    method: 'post',
    data: parameter
  })
}

export function accountResetPassword (parameter) {
  return axios({
    url: user.accountResetPassword,
    method: 'post',
    data: parameter
  })
}
