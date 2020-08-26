import { axios } from '@/utils/request'

export const UPLOAD_IMAGE_URL = process.env.VUE_APP_BASE_API_URL + '/storage/v1/upload/image'
export const UPLOAD_FILE_URL = process.env.VUE_APP_BASE_API_URL + '/storage/v1/upload/file'
export const UPLOAD_SIZE_LIMIT = 1024 * 1024 * 3

export function uploadImage (parameter) {
  return axios({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: '/storage/v1/upload/image',
    method: 'post',
    data: parameter
  })
}

export function uploadFile (parameter) {
  return axios({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: '/storage/v1/upload/file',
    method: 'post',
    data: parameter
  })
}
