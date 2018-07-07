<template>
  <div>
    <el-button class='leftButton' type='primary' @click='dialogFormVisible = true'>添加顾客</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="顾客编号"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CusID }}</span>
        </template>
      </el-table-column>
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
    <el-dialog :title='dialogFormTitle' :visible.sync='dialogFormVisible'>
      <el-form :model='form' ref='ruleForm' :rules='rules'>
        <el-form-item label='顾客姓名' prop='CusName'>
          <el-input v-model='form.CusName' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='顾客电话' prop='CusPhone'>
          <el-input v-model='form.CusPhone' auto-complete='off'></el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class='dialog-footer'>
        <el-button @click='reset'>重 置</el-button>
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
      dialogFormVisible: false,
      dialogFormTitle: '添加顾客',
      form: {
        CusName: null,
        CusPhone: null
      },
      rules: {
        CusName: [
          { type: 'string', max: 20, required: true, message: '请输入合法的姓名', trigger: 'blur' }
        ],
        CusPhone: [
          { type: 'string', max: 20, required: true, message: '请输入合法的联系方式', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$http.get('/api/get/CustomerInfo').then(res => {
      this.tableData = res.data
    })
  },
  methods: {
    reset () {
      this.form.CusName = null
      this.form.CusPhone = null
    },
    confirm () {
      if (this.form.CusName.length > 0 &&
          this.form.CusName.length <= 20 &&
          this.form.CusPhone.length > 0 &&
          this.form.CusPhone.length <= 20) {
        this.$http.post('/api/insert/customerinfo', this.form)
          .then(res => {
            var temp = {}
            Object.assign(temp, this.form)
            if (res.data) {
              this.tableData.push(temp)
            }
            this.dialogFormVisible = false
          })
      }
    }
  }
}
</script>

<style scoped>
.el-button {
  margin: 0;
  width: 49.5%;
}
.leftButton {
  float: left;
  max-width: 200px;
}
</style>
