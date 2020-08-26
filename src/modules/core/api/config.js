import { axios } from '@/utils/request'

const API_VERSION = '/backend/core/v1'

const api = {
  configList: API_VERSION + '/config/list',
  configCreate: API_VERSION + '/config/create',
  configUpdate: API_VERSION + '/config/update',
  configDelete: API_VERSION + '/config/delete',
  configForceDelete: API_VERSION + '/config/force-delete',
  configBatchUpdateValue: API_VERSION + '/config/batch/update/value',
  configOptions: API_VERSION + '/config/all'
}

export function getConfigList (parameter) {
  return axios({
    url: api.configList,
    method: 'post',
    data: parameter
  })
}

export function configCreate (parameter) {
  return axios({
    url: api.configCreate,
    method: 'post',
    data: parameter
  })
}

export function configUpdate (parameter) {
  return axios({
    url: api.configUpdate,
    method: 'post',
    data: parameter
  })
}

export function configDelete (parameter) {
  return axios({
    url: api.configDelete,
    method: 'post',
    data: parameter
  })
}

export function configForceDelete (parameter) {
  return axios({
    url: api.configForceDelete,
    method: 'post',
    data: parameter
  })
}

export function configOptions (parameter) {
  return axios({
    url: api.configOptions,
    method: 'post',
    data: parameter
  })
}

export function configBatchUpdateValue (parameter) {
  return axios({
    url: api.configBatchUpdateValue,
    method: 'post',
    data: parameter
  })
}
