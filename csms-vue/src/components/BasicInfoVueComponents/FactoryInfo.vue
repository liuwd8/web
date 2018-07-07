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
      <!-- <el-table-column
        label="车型信息"
        width="180"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.bookDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="客户信息"
        width="180"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>书名: {{ scope.row.bookName }}</p>
            <p>出版社: {{ scope.row.bookInfo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
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
      this.tableData = res.data
    })
  }
}
</script>
