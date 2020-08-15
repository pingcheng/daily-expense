import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { AuthTokenService } from "@/services/auth/AuthTokenService";


Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
    {
      path: "/login",
      name: "Login",
      meta: {
        guest: true
      },
      component: () => import("@/views/auth/Login.vue" /* webpackChunkName: "login" */),
    },
    {
      path: "/register",
      name: "Register",
      meta: {
        guest: true
      },
      component: () => import("@/views/auth/Register.vue" /* webpackChunkName: "register" */)
    },
    {
      path: "/",
      name: "Frame",
      meta: {
        requiresAuth: true
      },
      component: () => import("@/views/Frame.vue" /* webpackChunkName: "frame" */),
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/views/dashboard/Dashboard.vue" /* webpackChunkName: "dashboard" */)
        },
        {
          path: "/expense/add",
          name: "AddExpense",
          component: () => import("@/views/expense/AddExpense.vue" /* webpackChunkName: "add-expense" */)
        },
        {
          path: "/my/password",
          name: "UpdatePassword",
          component: () => import("@/views/my/UpdatePassword.vue" /* webpackChunkName: "update-password" */)
        }
      ]
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, form, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authToken = AuthTokenService.get();
    if (authToken === null) {
      next({
        name: "Login"
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    const authToken = AuthTokenService.get();
    if (authToken) {
      next({
        name: "Frame"
      })
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
