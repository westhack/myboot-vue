
import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1/auth'

const api = {
  Login: API_VERSION + '/login',
  Logout: API_VERSION + '/logout',
  ForgetPassword: API_VERSION + '/forgot/password',
  ForgetResetPassword: API_VERSION + '/forgot/reset/password',
  Register: API_VERSION + '/register',
  SendSms: '/captcha/v1/sms/send',
  UserInfo: API_VERSION + '/user',
  GetRouterByUser: API_VERSION + '/menus'
}

export function login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}

export function register (parameter) {
  return axios({
    url: api.Register,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return axios({
    url: api.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: api.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: api.GetRouterByUser,
    method: 'get'
  })
}
