<template>
  <div>
    <el-table
      :data="tableData"
      stripe
      >
      <el-table-column
        label="车名"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="库存"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CarNum }}</span>
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
    this.$http.get('/api/get/CarInventory').then(res => {
      if (res.data.state) {
        this.tableData = res.data.result
      } else {
        this.$message({ type: 'error', message: '网络错误' })
      }
    })
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
</style>
