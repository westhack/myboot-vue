import { axios } from '@/utils/request'

const API_VERSION = '/backend/core/v1'

const api = {
  dictList: API_VERSION + '/dict/list',
  dictCreate: API_VERSION + '/dict/create',
  dictUpdate: API_VERSION + '/dict/update',
  dictDelete: API_VERSION + '/dict/delete',
  dictForceDelete: API_VERSION + '/dict/force-delete',
  dictBatchUpdateValue: API_VERSION + '/dict/batch/update/value',
  dictAll: API_VERSION + '/dict/all'
}

export function dictList (parameter) {
  return axios({
    url: api.dictList,
    method: 'post',
    data: parameter
  })
}

export function dictCreate (parameter) {
  return axios({
    url: api.dictCreate,
    method: 'post',
    data: parameter
  })
}

export function dictUpdate (parameter) {
  return axios({
    url: api.dictUpdate,
    method: 'post',
    data: parameter
  })
}

export function dictDelete (parameter) {
  return axios({
    url: api.dictDelete,
    method: 'post',
    data: parameter
  })
}

export function dictForceDelete (parameter) {
  return axios({
    url: api.dictForceDelete,
    method: 'post',
    data: parameter
  })
}

export function dictAll (parameter) {
  return axios({
    url: api.dictAll,
    method: 'post',
    data: parameter
  })
}

export function dictBatchUpdateValue (parameter) {
  return axios({
    url: api.dictBatchUpdateValue,
    method: 'post',
    data: parameter
  })
}
