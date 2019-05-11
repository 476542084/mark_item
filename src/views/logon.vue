<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">图像标注-在线协作系统</h3>
    <el-form-item prop="userName">
      <el-input type="text" clearable v-model="ruleForm.userName " auto-complete="off" placeholder="账号">
        <Icon style="color:#000;margin-top:-5px;" slot="prefix" type="ios-person" size="23"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input :type="type" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
        <Icon style="color:#000;margin-top:-5px;" slot="prefix" type="ios-lock" size="20"/>
        <Icon @click="type = 'password'" v-if="type == 'text'" style="margin-top:-2px;" slot="suffix" type="ios-eye" size="25"/>
        <Icon @click="type = 'text'" v-if="type == 'password'" slot="suffix" type="ios-eye-off" size="25" />
      </el-input>
    </el-form-item> 
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="logon('ruleForm')" :loading="logining">注册</el-button>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="plain" style="width:100%;" @click="login">返回登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  //import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  import ParamidaPay from "../paramidaPay.js"
  import md5 from 'js-md5'
  require("@/viewstyle/Login.scss")
  export default {
    data() {
      return {
        type: 'password', // 类型
        logining: false,
        ruleForm: {
          userName: this.$store.state.userName,
          password: this.$store.state.password
        },
        rules: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      login(){
        this.$router.push('/')
      },
      handleReset2() {
        this.$refs.ruleForm.resetFields();
      },
      logon(formName){
        this.$refs[formName].validate((valid) => {
          // console.log(md5(this.ruleForm.password))
        this.ruleForm.userName = this.ruleForm.userName.replace(/\s*/g,"");
          if(valid){
            ParamidaPay.ApiCaller.post('index/logon', {userName:this.ruleForm.userName,password:md5(this.ruleForm.password)},
              response => {
                if (response.errcode == 0) {
                  this.$message({
                    'message': '注册成功',
                    'type': 'success'
                  });
                this.$router.push('/')
                } else {
                  this.$message({
                    'message': response.errcode,
                    'type': 'error'
                  });
                }
              },
              response => {
                this.$message({
                  'message': response.errcode,
                  'type': 'error'
                });
              }
            );
          }
        })
      }
          // this.$router.push('/Account')
        // // 进行表单提交验证
        // this.$refs[formName].validate((valid) => {
        //   //md5(this.ruleForm.password)
        //   if (valid) {
        //       ParamidaPay.ApiCaller.post("/main/login",{userName:this.ruleForm.userName,password:this.ruleForm.password}, response => {
        //         console.log(response)
        //         if(response.errcode == 0) {
        //             let token = response.body.token
        //             let userName = response.body.nickName
        //             this.$store.commit('set_token', token) //保存token
        //             this.$store.commit('set_username', userName) //保存 username
        //             if(this.checked){
        //               this.$store.commit('set_Account',this.ruleForm.password) //保存token
        //             }
        //             if (this.$store.state.token) {
        //               this.$router.push('/Account')
        //             } else {
        //             this.$router.replace('/');
        //           }
        //         } else {
        //           this.$message.error(response.errmsg);
        //         }
        //     },response => {
        //       this.$message.error(response.errmsg);
        //     })
        //   } else {
        //     this.$message.error("提交失败，请注意填写的登录名与密码哦");
        //     return false;
        //   }
        // });
      
    }
  }
</script>

<style>
  
</style>
