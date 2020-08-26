import { axios } from '@/utils/request'

const API_VERSION = '/backend/user/v1'

const menu = {
  menuList: API_VERSION + '/menu/list',
  menuCreate: API_VERSION + '/menu/create',
  menuUpdate: API_VERSION + '/menu/update',
  menuDelete: API_VERSION + '/menu/delete',
  menuOptions: API_VERSION + '/menu/all'
}

export function getMenuList (parameter) {
  return axios({
    url: menu.menuList,
    method: 'post',
    data: parameter
  })
}

export function menuCreate (parameter) {
  return axios({
    url: menu.menuCreate,
    method: 'post',
    data: parameter
  })
}

export function menuUpdate (parameter) {
  return axios({
    url: menu.menuUpdate,
    method: 'post',
    data: parameter
  })
}

export function menuDelete (parameter) {
  return axios({
    url: menu.menuDelete,
    method: 'post',
    data: parameter
  })
}

export function menuOptions (parameter) {
  return axios({
    url: menu.menuOptions,
    method: 'post',
    data: parameter
  })
}
