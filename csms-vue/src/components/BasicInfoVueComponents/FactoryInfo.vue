<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="公司"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.FName }}</span>
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
    this.$http.get('/api/get/FactoryInfo').then(res => {
      if (res.data.state) {
        this.tableData = res.data.result
      } else {
        this.$message({ type: 'error', message: '网络错误' })
      }
    })
  }
}
</script>
