const PERMISSION_ENUM = {
  'add': { value: 'add', label: '新增' },
  'delete': { value: 'delete', label: '删除' },
  'edit': { value: 'edit', label: '修改' },
  'query': { value: 'query', label: '查询' },
  'get': { value: 'get', label: '详情' },
  'enable': { value: 'enable', label: '启用' },
  'disable': { value: 'disable', label: '禁用' },
  'import': { value: 'import', label: '导入' },
  'export': { value: 'export', label: '导出' }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  /**
   *  <a-tab-pane v-if="$permission('dashboard.add')" tab="Tab 1">
   *    some context..
   *  </a-tab-pane>
   */
  !Vue.prototype.$permission && Object.defineProperties(Vue.prototype, {
    $permission: {
      get () {
        const _this = this
        return (permission) => {
          if (_this.$store.getters.roles.includes('admin')) {
            return true
          }

          const permissionList = _this.$store.getters.permissions

          return permissionList.find((val) => {
            return val.name === permission
          })
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}

export default plugin
