
import { dictAll } from '@/modules/core/api/dict'
import Vue from 'vue'

const core = {
  state: {
    dict: {}
  },

  mutations: {
    SET_DICT: (state, dict) => {
      Vue.ls.set('DICT', dict)
      state.dict = dict
    }
  },

  actions: {

    DictAll ({ commit }) {
      return new Promise((resolve, reject) => {
        dictAll().then(response => {
          const { items } = response.data

          commit('SET_DICT', items)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }

  }
}

export default core
