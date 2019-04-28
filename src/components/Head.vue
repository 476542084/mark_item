<template>
  <el-row>
    <el-col :span="24" class="header">
      <!-- <el-col :span="10" class="logo">
        <img src="../assets/logo.png" alt="" width="100%" height="100%"/>
      </el-col> -->
      <el-col :span="4" class="userinfo">
        <i class="el-icon-setting setting"></i>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link userinfo-inner">{{userName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">退出登录</el-dropdown-item>
            <el-dropdown-item command="b">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-dialog title="修改用户密码" :visible.sync="showPasswordDialog">
        <el-form :model="passwordForm" :rules="rules" ref="passwordForm">
          <el-form-item label="旧密码" :label-width="formLabelWidth" prop='password'>
            <el-input v-model="passwordForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop='newPassword'>
            <el-input v-model="passwordForm.newPassword" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取 消</el-button>
          <el-button type="primary" @click="handlePassword('passwordForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import ParamidaPay from "../paramidaPay.js"

export default {
  data() {
		return {
			token:this.$store.state.token,
      userName:this.$store.state.userName,
      showPasswordDialog:false,
      formLabelWidth:130,
      passwordForm:{
				password:'',
				newPassword:'',
			},
      rules: {
          newPassword: [
						{ required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          password: [
						{ required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]}
		}
	},
  methods:{
    handleCommand(command){
      if(command == 'a'){
        ParamidaPay.ApiCaller.post("/main/logout",{token:this.token}, response => {
          if(response.errcode == 0) {
            this.$router.push('/')
          } else {
              this.$message({
                message:response.errmsg,
                type: 'error'
              });
            }
          },response => {
              this.$message({
                message:response.errmsg,
                type: 'error'
              });
          })
          return
      }
      if(command == 'b'){
        this.showPasswordDialog = true
      }

    },
    handlePassword(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ParamidaPay.ApiCaller.post("/system/updateUserPassword",{token:this.token,password:this.passwordForm.password,newPassword:this.passwordForm.newPassword}, response => {
            if(response.errcode == 0) {
              this.$message({
                message:'修改成功',
                type: 'success'
              });
              this.showPasswordDialog =false
            } else {
                this.$message({
                  message:response.errmsg,
                  type: 'error'
                });
              }
            },response => {
                this.$message({
                  message:response.errmsg,
                  type: 'error'
                });
            })
        } else {
          this.$message({
            message:'error submit!!',
            type: 'error'
          });
          return false;
        }
      })
    }
  }
};
</script>
