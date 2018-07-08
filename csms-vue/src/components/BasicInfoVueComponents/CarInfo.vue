<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="车名"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="车型"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.CType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="价格"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.CPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="厂商"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.FName }}</span>
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
    this.$http.get('/api/get/CarInfo').then(res => {
      if (res.data.state) {
        this.tableData = res.data.result
      } else {
        this.$message({ type: 'error', message: '网络错误' })
      }
    })
  }
}
</script>
