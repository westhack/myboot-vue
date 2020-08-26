import { axios } from '@/utils/request'

const API_VERSION = '/backend/article/v1'

export const api = {
  articleList: API_VERSION + '/article/list',
  articleAll: API_VERSION + '/article/all',
  articleCreate: API_VERSION + '/article/create',
  articleUpdate: API_VERSION + '/article/update',
  articleDelete: API_VERSION + '/article/delete',

  articleCategoryList: API_VERSION + '/category/list',
  categoryAll: API_VERSION + '/category/all',
  categoryCreate: API_VERSION + '/category/create',
  categoryUpdate: API_VERSION + '/category/update',
  categoryDelete: API_VERSION + '/category/delete'

}

export default api

// 分类
export function articleCategoryList (parameter) {
  return axios({
    url: api.articleCategoryList,
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

export function articleList (parameter) {
  return axios({
    url: api.articleList,
    method: 'post',
    data: parameter
  })
}
export function articleyAll (parameter) {
  return axios({
    url: api.articleOptions,
    method: 'post',
    data: parameter
  })
}

export function articleCreate (parameter) {
  return axios({
    url: api.articleCreate,
    method: 'post',
    data: parameter
  })
}

export function articleUpdate (parameter) {
  return axios({
    url: api.articleUpdate,
    method: 'post',
    data: parameter
  })
}

export function articleDelete (parameter) {
  return axios({
    url: api.articleDelete,
    method: 'post',
    data: parameter
  })
}
