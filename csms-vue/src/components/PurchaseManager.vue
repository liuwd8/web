<template>
  <div>
    <div class='el-button-float-right' v-if="this.global.auth === 0">
      <el-button type='primary' @click='dialogFormVisible = true'>进货</el-button>
    </div>
    <el-table
      ref='multipleTable'
      :data='tableData'
      stripe
      >
      <el-table-column
        label='单号'
        align='center'>
        <template slot-scope='scope'>
          <span>{{ scope.row.PID }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label='购买时间'
        align='center'>
        <template slot-scope='scope'>
          <i class='el-icon-time'></i>
          <span>{{ scope.row.PDate.replace(/T([0-9:]+)\S+/, ' $1') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label='车名'
        align='center'>
        <template slot-scope='scope'>
          <span>{{ scope.row.CName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label='单价'
        align='center'>
        <template slot-scope='scope'>
          <span>{{ scope.row.PPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label='进货量'
        width='180'
        align='center'>
        <template slot-scope='scope'>
          <span>{{ scope.row.CNum }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title='dialogFormTitle' :visible.sync='dialogFormVisible'>
      <el-form :model='form' ref='ruleForm' :rules='rules'>
        <el-form-item label='车名' prop='CName'>
          <el-select v-model="form.CName" placeholder="请选择车名">
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.CName"
              :value="item.CName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='进货量' prop='CNum'>
          <el-input type="number" v-model='form.CNum' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='单价' prop='PPrice'>
          <el-input type="number" v-model='form.PPrice' auto-complete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='dialogFormVisible = false'>取 消</el-button>
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
      dialogFormTitle: '进货记录',
      dialogFormVisible: false,
      form: {
        CName: null,
        CNum: null,
        PPrice: null
      },
      rules: {
        CName: [
          { required: true, message: '请输入购买的车名', trigger: 'blur' }
        ],
        CNum: [
          { required: true, message: '请输入购买的数量', trigger: 'blur' }
        ],
        PPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' }
        ]
      },
      options: []
    }
  },
  created () {
    this.$http.get('/api/get/PurchaseInfo').then(res => {
      this.tableData = res.data
    })
    this.$http.get('/api/get/CarInfo').then(res => {
      this.options = res.data
    })
  },
  methods: {
    confirm () {
      if (this.auth) {
        this.$message({
          type: 'error',
          message: '权限不足'
        })
        return false
      }
      if (!this.form.CName) {
        this.$message({
          type: 'error',
          message: '请选择购买的车名'
        })
        return false
      }
      if (this.form.CNum <= 0) {
        this.$message({
          type: 'error',
          message: '购买数量不能小于或等于0'
        })
        return false
      }
      if (this.form.PPrice <= 0) {
        this.$message({
          type: 'error',
          message: '购买单价不能小于0'
        })
        return false
      }
      this.$http.post('/api/set/PurchaseCar', this.form).then(res => {
        console.log(res)
        this.tableData = res.data
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style scoped>
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
