<!-- 顾客服务页面 -->
<template>
  <div>
    <el-menu
      :default-active="this.$route.path.split('/')[2] ? this.$route.path : '/BasicInfoManager/1'"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#ffd04b"
      router>
      <el-menu-item index="/BasicInfoManager/1">厂商信息</el-menu-item>
      <el-menu-item index="/BasicInfoManager/2">车型信息</el-menu-item>
      <el-menu-item index="/BasicInfoManager/3">客户信息</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>
