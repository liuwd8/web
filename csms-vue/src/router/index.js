import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import BasicInfo from '@/components/BasicInfoManager'
import Inventory from '@/components/InventoryManager'
import Purchase from '@/components/PurchaseManager'
import System from '@/components/SystemManager'
import Sale from '@/components/SaleManager'
import Login from '@/components/Login'
import Factory from '@/components/BasicInfoVueComponents/FactoryInfo'
import CarInfo from '@/components/BasicInfoVueComponents/CarInfo'
import CustomerInfo from '@/components/BasicInfoVueComponents/CustomerInfo'

Vue.use(Router)
Vue.prototype.$http = axios

var router = new Router({
  routes: [
    {
      path: '/BasicInfoManager',
      component: BasicInfo,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '1',
          component: Factory,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '2',
          component: CarInfo,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '3',
          component: CustomerInfo,
          meta: {
            requireAuth: true
          }
        }
      ]
    },
    {
      path: '/PurchaseManager',
      component: Purchase,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/',
      component: Sale,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/InventoryManager',
      component: Inventory,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/SystemManager',
      component: System,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/Login',
      component: Login,
      meta: {
        requireAuth: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    axios.get('/api/login').then(res => {
      if (!res.data.state) {
        next({
          path: '/Login',
          query: {
            to: to.fullPath
          }
        })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
