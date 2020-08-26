import { axios } from '@/utils/request'

const API_VERSION = '/backend/generator'

export const api = {
  generatorForm: API_VERSION + '/form',
  getRelations: API_VERSION + '/getRelations',
  generatorModel: API_VERSION + '/model',
  generatorController: API_VERSION + '/controller'
}

export default api

export function generatorForm (parameter) { return axios({ url: api.generatorForm, method: 'get', params: parameter }) }
export function getRelations (parameter) { return axios({ url: api.getRelations, method: 'post', data: parameter }) }
export function generatorModel (parameter) { return axios({ url: api.generatorModel, method: 'post', data: parameter }) }
export function generatorController (parameter) { return axios({ url: api.generatorController, method: 'post', data: parameter }) }
