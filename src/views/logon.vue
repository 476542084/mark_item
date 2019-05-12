<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="65px" class="demo-ruleForm login-container">
    <h3 class="title">图像标注-在线协作系统</h3>
    <el-form-item prop="account" label="账号" >
      <el-input type="text" :maxlength="16" clearable v-model="ruleForm.account " auto-complete="off" placeholder="账号">
        <Icon style="color:#000;margin-top:-5px;" slot="prefix" class="el-icon-user" size="20"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="userName" label="用户名" >
        <el-input :maxlength="12" type="text" clearable v-model="ruleForm.userName " auto-complete="off" placeholder="名字">
          <Icon style="color:#000;margin-top:-5px;" slot="prefix" type="ios-person" size="23"/>
        </el-input>
      </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input :maxlength="16" :type="type" v-model="ruleForm.password" auto-complete="off" placeholder="密码">
        <Icon style="color:#000;margin-top:-5px;" slot="prefix" type="ios-lock" size="20"/>
        <Icon @click="type = 'password'" v-if="type == 'text'" style="margin-top:-2px;" slot="suffix" type="ios-eye" size="25"/>
        <Icon @click="type = 'text'" v-if="type == 'password'" slot="suffix" type="ios-eye-off" size="25" />
      </el-input>
    </el-form-item>
    <el-form-item prop="passwordSecond">
        <el-input :maxlength="16" :type="type" v-model="ruleForm.passwordSecond" auto-complete="off" placeholder="请再一次输入密码">
          <Icon style="color:#000;margin-top:-5px;" slot="prefix" type="ios-lock" size="20"/>
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
          account: '',
          userName: '',
          password: '',
          passwordSecond: '',
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          userName: [
            { required: true, message: '请输入名字', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          passwordSecond: [
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
        this.ruleForm.userName = this.ruleForm.userName.replace(/\s*/g,"");
          if(valid){
            if(this.ruleForm.password !== this.ruleForm.passwordSecond){
              this.$message({
                    'message': '两次密码不一致！',
                    'type': 'error'
                  });
                  return false;
            }
            ParamidaPay.ApiCaller.post('index/logon', {account: this.ruleForm.account,userName:this.ruleForm.userName,password:md5(this.ruleForm.password)},
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

      
    }
  }
</script>

<style>
  
</style>
