import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: '仪表盘' }
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('@/views/customer/CustomerList.vue'),
          meta: { title: '客户管理' }
        },
        {
          path: 'approvals',
          name: 'approvals',
          component: () => import('@/views/approval/ApprovalList.vue'),
          meta: { title: '审批流程' }
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/report/ReportDashboard.vue'),
          meta: { title: '报表' }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
          meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { title: 'Register' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  if (to.path !== '/login' && to.path !== '/register' && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
