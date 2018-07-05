<!-- 顾客服务页面 -->
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;height: 100%"
      stripe
      >
      <el-table-column
        label="用户"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bookId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="车型"
        width="180"
        align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <el-popover trigger="hover" placement="top">
            <p>书名: {{ scope.row.bookName }}</p>
            <p>出版社: {{ scope.row.bookInfo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.bookName }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="数量"
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
      </el-table-column>
      <el-table-column
        label="利润"
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
      // formLabelWidth: "120px",
      // dialogFormVisible: false,
      // dialogFormTitle: "",
      // form: {
      //   bookId: "",
      //   customerName: "",
      //   bookName: "",
      //   count: ""
      // },
      // rules: {
      //   customerName: [
      //     { required: true, message: "请输入顾客姓名", trigger: "blur" }
      //   ],
      //   bookName: [
      //     { required: true, message: "请输入图书名称", trigger: "blur" }
      //   ],
      //   count: [{ required: true, message: "请输入图书数量", trigger: "blur" }]
      // }
    }
  },
  created () {
    // if(this.getCookie(''))
    this.$http.get('/api/getSaleInfo').then(res => {
      console.log(res)
      this.tableData = res.data
      console.log(this.tableData)
    })
  },
  methods: {
    // handlePurchase(index, row) {
    //   this.dialogFormTitle = "购买图书";
    //   this.dialogFormVisible = true;
    //   this.form.bookId = row.bookId;
    //   this.form.bookName = row.bookName;
    //   this.form.count = 1;
    // },
    // handleReturn(index, row) {
    //   //console.log(index, row);
    //   this.dialogFormTitle = "退购图书";
    //   this.dialogFormVisible = true;
    //   this.form.bookId = row.bookId;
    //   this.form.bookName = row.bookName;
    //   this.form.count = 1;
    // },
    // cancel() {
    //   this.dialogFormVisible = false;
    // },
    // confirm() {
    //   var that = this;
    //   //检验表单
    //   this.$refs["ruleForm"].validate(valid => {
    //     if (valid) {
    //       //post表单信息，进行销售操作或者退货操作
    //       var url = "";
    //       if (that.dialogFormTitle === "购买图书") url = "/api/book/sale";
    //       else url = "/api/book/return";
    //       that.$http
    //         .post(url, {
    //           bookId: that.form.bookId,
    //           count: that.form.count,
    //           customerName: that.form.customerName
    //         })
    //         .then(res => {
    //           //销售或退货成功之后进行数据更新
    //           if (res.status === 200 && res.data.status != 404) {
    //             that.$http.get("/api/book/getBooks").then(res => {
    //               that.tableData = res.data;
    //               that.dialogFormVisible = false;
    //               that.$message({
    //                 type: "success",
    //                 message:
    //                   this.dialogFormTitle === "购买图书"
    //                     ? "购买成功"
    //                     : "退订成功"
    //               });
    //             });
    //           } else {
    //             that.$message({
    //               type: "error",
    //               message: res.data.message
    //             });
    //           }
    //         });
    //     }
    //   });
    // }
  }
}
</script>
