<!-- 顾客服务页面 -->
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="单号"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="卖出车辆"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="卖出时间"
        width="180"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.SDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="利润"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SProfit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="顾客姓名"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CName }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm" :rules="rules">
        <el-form-item label="顾客姓名" :label-width="formLabelWidth" prop="customerName">
          <el-input v-model="form.customerName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="书本名称" :label-width="formLabelWidth" prop="bookName">
          <el-input v-model="form.bookName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth" prop="count">
          <el-input v-model="form.count" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog> -->
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
    this.$http.get('/api/get/SaleInfo').then(res => {
      this.tableData = res.data
    })
  }
}
</script>
