const router = {
  UserList: () => import('@/modules/user/views/user/List'),
  AdminList: () => import('@/modules/user/views/admin/List'),
  AccountBaseSettings: () => import('@/modules/user/views/account/settings/BaseSettings'),
  AccountPassword: () => import('@/modules/user/views/account/settings/Password'),
  AccountIndex: () => import('@/modules/user/views/account/settings/Index'),
  permissionList: () => import('@/modules/user/views/permission/List'),
  UserMenuList: () => import('@/modules/user/views/menu/List'),
  RoleList: () => import('@/modules/user/views/role/List')
}

export default router
