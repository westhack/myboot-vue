const router = {
  CoreConfigList: () => import('@/modules/core/views/config/List'),
  CoreDictList: () => import('@/modules/core/views/dict/List'),
  CoreLogList: () => import('@/modules/core/views/log/List')
}

export default router
