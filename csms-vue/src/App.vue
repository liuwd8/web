<template>
  <div id="csms">
    <el-menu
      :default-active="this.$route.path.split('/')[1] ? '/' + this.$route.path.split('/')[1] : '/'"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-menu-item index="/BasicInfoManager/1">基础信息管理</el-menu-item>
      <el-menu-item index="/PurchaseManager">进货管理</el-menu-item>
      <el-menu-item index="/">销售管理</el-menu-item>
      <el-menu-item index="/InventoryManager">仓库管理</el-menu-item>
      <el-menu-item index="/SystemManager">系统维护</el-menu-item>
      <el-menu-item @click="logout" index="/Logout" enable='false'>退出</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'csms',
  methods: {
    logout () {
      this.$http.get('/api/logout').then(res => {
        var message
        if (res.data.state) {
          message = {type: 'success', message: '登出成功'}
        } else {
          message = {type: 'error', message: '登录已过期'}
        }
        this.$router.replace({path: '/Login'})
        this.$message(message)
      })
    }
  }
}
</script>

<style>
#csms {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-menu {
  width: 100%;
  margin: 0px;
}
</style>
