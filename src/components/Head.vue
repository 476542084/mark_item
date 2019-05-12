<template>
  <el-row>
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" style="font-weight: bold !important;
      font-size: 25px !important;
      color: #FFFFFF; !important">
        图像标注在线协作系统
      </el-col>
    

      <el-col :span="4" style="float: right;width: 120px;!important" class="userinfo">
        <i class="el-icon-setting setting"></i>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link" style="    color: #FFF;">
              退出登录<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">退出登录(清空缓存)</el-dropdown-item>
              <el-dropdown-item command="b">直接退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-col>
      <span style="float: right;
      color: #FFFFFF;
      font-size: 14px;">{{userName}}</span>
      <div style="    margin-right: 20px;
      display: flex;
      float: right;
      align-items: center;
      justify-content: center;
      height: 65px;">
          <img :src="head_url + selfHead" height="60" width="60" alt="" style="border-radius: 50%;">
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ParamidaPay from "../paramidaPay.js"
import Config from '../config.js';

export default {
  data() {
		return {
      selfHead:sessionStorage.getItem('head_url'),
      head_url:Config.head_url,
      userName:sessionStorage.getItem('userName'),
      showPasswordDialog:false,
      formLabelWidth:130,
		}
	},
  methods:{
   
    handleCommand(command) {
      if(command == 'a'){
        sessionStorage.clear();
        this.$router.push({
          path:'/',
          name:'login'
        })
        this.$message({
            message: '退出成功',
            type: 'success',
        });

      }else{
        this.$router.push({
          path:'/',
          name:'login'
        })
        this.$message({
              message: '退出成功',
              type: 'success',
        });
      }
      
      },
  }
};
</script>
<style lang="less" >
.ivu-layout-header{
  padding: 0 10px !important;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
