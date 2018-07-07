<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="顾客姓名"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CusName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="顾客电话"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.CusPhone }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.$http.get('/api/get/CustomerInfo').then(res => {
      this.tableData = res.data
    })
  }
}
</script>
