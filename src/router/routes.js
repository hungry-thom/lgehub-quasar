
const routes = [
  {
    path: '/',
    // component: () => import('layouts/MyLayout.vue'),
    component: () => import('layouts/default'),
    children: [
      // { path: '', component: () => import('pages/Index.vue') },
      { path: '/home', name: 'home', component: () => import('pages/Home') },
      { path: '/signin', name: 'signin', component: () => import('pages/SignIn') },
      { path: '/register', name: 'register', component: () => import('pages/SignIn') },
      { path: '/chat', name: 'chat', component: () => import('pages/Chat'), meta: { requiresAuth: true } },
      { path: '/inventory', name: 'inventory', component: () => import('pages/Inventory'), meta: { requiresAuth: true } }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
