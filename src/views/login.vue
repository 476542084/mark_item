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
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-link @click="toLogon" :underline="false" style="margin: 0px 0px 3px 0px;color:teal;float: right;">注册账号</el-link>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click="handleSubmit('ruleForm')" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
// import { requestLogin } from '../api/api';
// import NProgress from 'nprogress'
import ParamidaPay from '../paramidaPay.js';
import md5 from 'js-md5';

require('@/viewstyle/Login.scss');

export default {
  data() {
    return {
      type: 'password', // 类型
      logining: false,
      ruleForm: {
        userName: this.$store.state.userName,
        password: this.$store.state.password,
      },
      rules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      checked: true,
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm.resetFields();
    },
    CalcuMD5(pwd) {
      pwd = pwd.toUpperCase();
      pwd = md5(pwd);
      return pwd;
    },
    toLogon() {
      this.$router.push('/logon');
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(md5(this.ruleForm.password));
        this.ruleForm.userName = this.ruleForm.userName.replace(/\s*/g,"");
        if (valid) {
          ParamidaPay.ApiCaller.post('index/login', { userName: this.ruleForm.userName, password: md5(this.ruleForm.password) },
            (response) => {
              console.log('response', response);
              if (response.errcode == 0) {
                sessionStorage.setItem('userId',response.id);
                sessionStorage.setItem('userName',response.userName);
                sessionStorage.setItem('head_url',response.head_url);
                sessionStorage.setItem('userType',response.type);
                sessionStorage.setItem('enUpload',response.type[0]);
                sessionStorage.setItem('enMark',response.type[1]);
                sessionStorage.setItem('enChat',response.type[2]);
                this.$router.push('/userManage');
              } else {
                this.$message({
                  message: response.errcode,
                  type: 'error',
                });
              }
            },
            (response) => {
              this.$message({
                message: response.errcode,
                type: 'error',
              });
            },
          );
        }
      });
    },
  },
};
</script>

<style>

</style>
