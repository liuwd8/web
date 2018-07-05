<template>
  <div id="app">
    <el-menu
      :default-active="this.$route.path.split('/')[2] ? this.$route.path.split('/')[2] : '/'"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-menu-item index="/BasicInfoManager">基础信息管理</el-menu-item>
      <el-menu-item index="/PurchaseManager">进货管理</el-menu-item>
      <el-menu-item index="/">销售管理</el-menu-item>
      <el-menu-item index="/InventoryManager">仓库管理</el-menu-item>
      <el-menu-item index="/SystemManager">系统维护</el-menu-item>
      <el-menu-item index="/Logout">退出</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .el-menu{
    width: 100%;
    margin: 0px;
  }
</style>
