import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import auth from 'src/auth'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (!to.meta.requiresAuth || auth.authenticated()) {
      next()
    } else {
      console.log('Not authenticated')
      next({ path: '/home' })
    }
  })

  return Router
}
