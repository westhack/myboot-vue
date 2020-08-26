// eslint-disable-next-line
import { RouteView } from '@/layouts'

const generatorRouter = {
  path: '/generator',
  redirect: '/generator/form',
  component: RouteView,
  hidden: false,
  meta: { title: '页面生成器', icon: 'bg-colors', permission: ['admin'] },
  children: [
    {
      path: 'model',
      name: 'generatorModel',
      component: () => import('@/modules/generator/views/model.vue'),
      meta: { title: '模型生成', keepAlive: true, permission: ['admin'] }
    },
    {
      path: 'controller',
      name: 'generatorController',
      component: () => import('@/modules/generator/views/controller.vue'),
      meta: { title: '控制器生成', keepAlive: true, permission: ['admin'] }
    }
  ]
}

export default generatorRouter
