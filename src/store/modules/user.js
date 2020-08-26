import Vue from 'vue'
import { login, getInfo, logout } from '@/modules/user/api/login'
import { userMessages, userMessageView } from '@/modules/user/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { httpResponseCode } from '@/constants/httpResponseCode'
import store from '@/store'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    permissions: [],
    info: {},
    messages: [],
    messageCount: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const _permissions = []
      if (permissions) {
        permissions.forEach(p => {
          _permissions.push(p.name)
        })

        state.permissions = _permissions
      } else {
        state.permissions = []
      }
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_USER_MESSAGE: (state, messages) => {
      state.messages = messages
    },
    SET_USER_MESSAGE_COUNT: (state, messageCount) => {
      state.messageCount = messageCount
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.data
          if (response.code === httpResponseCode.SUCCESS) {
            Vue.ls.set(ACCESS_TOKEN, data.access_token, data.expires_in)
            commit('SET_TOKEN', data.access_token)
            resolve()
          }
          reject(new Error(response.message))
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { user } = response.data

          if (user.roles && user.permissions.length >= 0) {
            commit('SET_ROLES', user.roles)
            commit('SET_PERMISSIONS', user.permissions)
            commit('SET_INFO', user)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: user.username, welcome: welcome() })
          commit('SET_AVATAR', user.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetUserMessages ({ commit, state }) {
      return new Promise((resolve) => {
        userMessages().then(res => {
          if (res.data) {
            commit('SET_USER_MESSAGE', res.data.items)
            commit('SET_USER_MESSAGE_COUNT', res.data.total)
          }
        }).catch(() => {
          resolve()
        })
      })
    },

    UserMessageView ({ commit, state }, id) {
      return new Promise((resolve) => {
        userMessageView({ id: id }).then(res => {
          if (res.code == httpResponseCode.SUCCESS) {
            commit('SET_USER_MESSAGE_COUNT', 0)
          }
        }).catch(() => {
          resolve()
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        Vue.ls.remove(ACCESS_TOKEN)
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user
