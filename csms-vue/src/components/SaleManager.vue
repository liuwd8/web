<template>
  <div>
    <div class='el-button-float-right'>
      <el-button type='primary' @click='dialogFormVisible = true'>卖车</el-button>
      <!-- <el-button type='danger'>删除</el-button> -->
    </div>
    <el-table
      :data="tableData"
      stripe
      >
      <el-table-column
        label="单号"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SID }}</span>
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
        label="车型"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单价"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SNum }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="卖出时间"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.SDate.replace(/T([0-9:]+)\S+/, ' $1') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="售价"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SProfit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="顾客姓名"
        align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>联系电话: {{ scope.row.CusPhone }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.CusName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title='dialogFormTitle' :visible.sync='dialogFormVisible'>
      <el-form :model='form' ref='ruleForm' :rules='rules'>
        <el-form-item label='车名' prop='CName'>
          <el-select v-model="form.CName" placeholder="请选择车名">
            <el-option
              v-for="(item, index) in carOptions"
              :key="index"
              :label="item.CName"
              :value="item.CName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='购买数量' prop='SNum'>
          <el-input type="number" v-model='form.SNum' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='顾客姓名' prop='CusID'>
          <el-select v-model="form.CusID" placeholder="请选择顾客名">
            <el-option
              v-for="(item, index) in cusOptions"
              :key="index"
              :label="item.CusName"
              :value="item.CusID">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='reset'>取 消</el-button>
        <el-button type='primary' @click='confirm'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogFormTitle: '卖车记录',
      dialogFormVisible: false,
      form: {
        CName: null,
        SNum: null,
        CusID: null,
        SProfit: null
      },
      rules: {
        CName: [
          { required: true, message: '请选择卖出的车名', trigger: 'blur' }
        ],
        SNum: [
          { required: true, message: '请输入卖出的数量', trigger: 'blur' }
        ],
        CusID: [
          { type: 'string', min: 2, max: 20, required: true, message: '顾客姓名不合法', trigger: 'blur' }
        ]
      },
      carOptions: [],
      cusOptions: []
    }
  },
  created () {
    this.$http.get('/api/get/salelog').then(res => {
      this.tableData = res.data
    })
    this.$http.get('/api/get/Carinfo').then(res => {
      this.carOptions = res.data
    })
    this.$http.get('/api/get/customerinfo').then(res => {
      this.cusOptions = res.data
    })
  },
  methods: {
    reset () {
      this.form = {
        CName: null,
        SNum: null,
        CusID: null,
        SProfit: null
      }
    },
    confirm () {
      var flag1 = true
      this.carOptions.forEach(data => {
        if (data.CName === this.form.CName) {
          this.form.SProfit = data.CPrice
          flag1 = false
        }
      })
      if (flag1) {
        this.$message({
          type: 'error',
          message: '请选择购买的车名'
        })
        return false
      }
      if (this.form.SNum <= 0) {
        this.$message({
          type: 'error',
          message: '购买数量不能小于或等于0'
        })
        return false
      }
      var flag2 = true
      this.cusOptions.forEach(data => {
        if (data.CusID === this.form.CusID) flag2 = false
      })
      if (flag2) {
        this.$message({
          type: 'error',
          message: '请输入合法的顾客姓名'
        })
        return false
      }
      this.form.SProfit = Number(this.form.SProfit) * this.form.SNum
      this.$http.post('/api/set/SaleCar', this.form).then(res => {
        this.tableData = res.data
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style>
.el-button-float-right {
  float: right;
  width: 10%;
}
.el-button {
  margin: 0;
  width: 100%;
}
.el-table {
  width: 100%;
  height: 100%;
}
</style>
