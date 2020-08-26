import { axios } from '@/utils/request'

const API_VERSION = '/backend/banner/v1'

export const api = {
  bannerList: API_VERSION + '/banner/list',
  bannerAll: API_VERSION + '/banner/all',
  bannerCreate: API_VERSION + '/banner/create',
  bannerUpdate: API_VERSION + '/banner/update',
  bannerDelete: API_VERSION + '/banner/delete',

  bannerCategoryList: API_VERSION + '/category/list',
  categoryAll: API_VERSION + '/category/all',
  categoryCreate: API_VERSION + '/category/create',
  categoryUpdate: API_VERSION + '/category/update',
  categoryDelete: API_VERSION + '/category/delete'
}

export default api

// 分类
export function bannerCategoryList (parameter) {
  return axios({
    url: api.bannerCategoryList,
    method: 'post',
    data: parameter
  })
}

export function categoryAll (parameter) {
  return axios({
    url: api.categoryAll,
    method: 'post',
    data: parameter
  })
}

export function categoryCreate (parameter) {
  return axios({
    url: api.categoryCreate,
    method: 'post',
    data: parameter
  })
}

export function categoryUpdate (parameter) {
  return axios({
    url: api.categoryUpdate,
    method: 'post',
    data: parameter
  })
}

export function categoryDelete (parameter) {
  return axios({
    url: api.categoryDelete,
    method: 'post',
    data: parameter
  })
}

//  幻灯片

export function bannerList (parameter) {
  return axios({
    url: api.bannerList,
    method: 'post',
    data: parameter
  })
}
export function banneryAll (parameter) {
  return axios({
    url: api.bannerOptions,
    method: 'post',
    data: parameter
  })
}

export function bannerCreate (parameter) {
  return axios({
    url: api.bannerCreate,
    method: 'post',
    data: parameter
  })
}

export function bannerUpdate (parameter) {
  return axios({
    url: api.bannerUpdate,
    method: 'post',
    data: parameter
  })
}

export function bannerDelete (parameter) {
  return axios({
    url: api.bannerDelete,
    method: 'post',
    data: parameter
  })
}
