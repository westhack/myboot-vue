import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1'

const user = {
  userList: API_VERSION + '/user/list',
  userCreate: API_VERSION + '/user/create',
  userUpdate: API_VERSION + '/user/update',
  userDelete: API_VERSION + '/user/delete',
  userForceDelete: API_VERSION + '/user/force/delete',
  userMessages: API_VERSION + '/user/messages',
  userMessageView: API_VERSION + '/user/message/view'
}

export function getUserList (parameter) {
  return axios({
    url: user.userList,
    method: 'post',
    data: parameter
  })
}

export function userCreate (parameter) {
  return axios({
    url: user.userCreate,
    method: 'post',
    data: parameter
  })
}

export function userUpdate (parameter) {
  return axios({
    url: user.userUpdate,
    method: 'post',
    data: parameter
  })
}

export function userDelete (parameter) {
  return axios({
    url: user.userDelete,
    method: 'post',
    data: parameter
  })
}

export function userMessages (parameter) {
  return axios({
    url: user.userMessages,
    method: 'get',
    params: parameter
  })
}

export function userMessageView (parameter) {
  return axios({
    url: user.userMessageView,
    method: 'post',
    data: parameter
  })
}
