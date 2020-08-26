import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1'

const permission = {
  permissionList: API_VERSION + '/permission/list',
  permissionCreate: API_VERSION + '/permission/create',
  permissionUpdate: API_VERSION + '/permission/update',
  permissionDelete: API_VERSION + '/permission/delete',
  permissionRoutes: API_VERSION + '/permission/routes',
  permissionOptions: API_VERSION + '/permission/all',
  guardOptions: API_VERSION + '/guard/all'
}

export function getPermissionList (parameter) {
  return axios({
    url: permission.permissionList,
    method: 'post',
    data: parameter
  })
}

export function permissionCreate (parameter) {
  return axios({
    url: permission.permissionCreate,
    method: 'post',
    data: parameter
  })
}

export function permissionUpdate (parameter) {
  return axios({
    url: permission.permissionUpdate,
    method: 'post',
    data: parameter
  })
}

export function permissionDelete (parameter) {
  return axios({
    url: permission.permissionDelete,
    method: 'post',
    data: parameter
  })
}

export function permissionRoutes (parameter) {
  return axios({
    url: permission.permissionRoutes,
    method: 'post',
    data: parameter
  })
}

export function permissionOptions (parameter) {
  return axios({
    url: permission.permissionOptions,
    method: 'post',
    data: parameter
  })
}

export function guardOptions (parameter) {
  return axios({
    url: permission.guardOptions,
    method: 'post',
    data: parameter
  })
}
