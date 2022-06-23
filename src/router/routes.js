import guest from './middlewares/guest'
import auth from './middlewares/auth'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      middlewares: [
        auth
      ]
    },
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          middlewares: [
            auth
          ]
        },
      },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    meta: {
      middlewares: [
        guest
      ]
    },
    children: [
      {
        name: 'login',
        path: '',
        component: () => import('pages/Login.vue'),
        meta: {
          middlewares: [
            guest
          ]
        },
      },
      // {path: 'registration', component: () => import('pages/Registration.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
