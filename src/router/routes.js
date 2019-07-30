
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
      { path: '/inventory', name: 'inventory', component: () => import('pages/Inventory'), meta: { requiresAuth: true } },
      { path: '/pricelist', name: 'pricelist', component: () => import('pages/PriceList'), meta: { requiresAuth: true } },
      { path: '/transfers', name: 'transfers', component: () => import('pages/Transfers'), meta: { requiresAuth: true } },
      { path: '/expense', name: 'expenseHome', component: () => import('pages/ExpenseHome'), meta: { requiresAuth: true } },
      { path: '/expense/:expId', name: 'expenseDetail', component: () => import('pages/ExpenseDetail'), meta: { requiresAuth: true } },
      { path: '/monthly', name: 'monthly', component: () => import('pages/Monthly'), meta: { requiresAuth: true } },
      { path: '/test', name: 'test', component: () => import('pages/Daily'), meta: { requiresAuth: true } },
      { path: '/payables', name: 'payables', component: () => import('pages/Payables'), meta: { requiresAuth: true } },
      { path: '/checks', name: 'checks', component: () => import('pages/Checks'), meta: { requiresAuth: true } },
      { path: '/cash', name: 'cash', component: () => import('pages/Cash'), meta: { requiresAuth: true } },
      { path: '/tables', name: 'tables', component: () => import('pages/Tables'), meta: { requiresAuth: true } },
      { path: '/atlantic', name: 'atlantic', component: () => import('pages/Atlantic'), meta: { requiresAuth: true } }
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
