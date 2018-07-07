<template>
  <div>
    <div class="title">用户列表</div>
    <el-table
      :data="tableData"
      stripe
      >
      <el-table-column
        label="用户名"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="权限"
        align="center"
        :formatter='authFormat'>
      </el-table-column>
    </el-table>
    <div class="title">操作日志</div>
    <el-table
      :data="logData"
      stripe
      >
      <el-table-column
        label="操作记录"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.InAndOutID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="车名"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.InAndOutDate.replace(/T([0-9:]+)\S+/, ' $1') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入库/出库"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.InAndOutType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.InAndOutNum }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      logData: [],
      auth: ['root', '管理员', '高级用户', '普通用户']
    }
  },
  created () {
    this.$http.get('/api/get/users').then(res => {
      this.tableData = res.data
    })
    this.$http.get('/api/get/inandoutinfo').then(res => {
      this.logData = res.data
    })
  },
  methods: {
    authFormat (row, column) {
      return this.auth[row.status]
    }
  }
}
</script>

<style>
.el-table {
  width: 100%;
  height: 100%;
}
.el-table-column {
  width: 50%;
}
.title {
  margin: 10px 0;
  background-color: #8e8eac;
  color: white;
}
</style>
