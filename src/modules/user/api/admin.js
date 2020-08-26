import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1'

const user = {
  userList: API_VERSION + '/admin/list',
  userCreate: API_VERSION + '/admin/create',
  userUpdate: API_VERSION + '/admin/update',
  userDelete: API_VERSION + '/admin/delete'
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
