import Vue from 'vue'
import Router from 'vue-router'
import BasicInfo from '@/components/BasicInfoManager'
import Inventory from '@/components/InventoryManager'
import Purchase from '@/components/PurchaseManager'
import System from '@/components/SystemManager'
import Sale from '@/components/SaleManager'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/BasicInfoManager',
      component: BasicInfo
    },
    {
      path: '/PurchaseManager',
      component: Purchase
    },
    {
      path: '/',
      component: Sale
    },
    {
      path: '/InventoryManager',
      component: Inventory
    },
    {
      path: '/SystemManager',
      component: System
    },
    {
      path: '/Login',
      component: Login
    }
  ]
})
