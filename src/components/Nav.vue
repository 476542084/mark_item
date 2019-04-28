<template>
  <Menu  :active-name="activemenu" ref='side_menu' style="width:200px" @on-select="navigateTo" class="nav">
        <MenuGroup title="智能私教">
            <MenuItem name="1">
              <router-link to="/studentManage" style="color: #515a6e;padding-left:20px;">学员管理</router-link>
            </MenuItem>
            <MenuItem name="2">
              <router-link to="/courseLibrary" style="color: #515a6e;padding-left:20px;">课程库</router-link>
            </MenuItem>
            <MenuItem name="3">
              <router-link to="/partialMatch" style="color: #515a6e;padding-left:20px;">部分配题</router-link>
            </MenuItem>
        </MenuGroup>
        <MenuGroup title="数据报表">
          <MenuItem name="4">
            <router-link to="/studentGrade" style="color: #515a6e;padding-left:20px;">学员成绩表</router-link>
          </MenuItem>
          <MenuItem name="5">
            <router-link to="/courseScore" style="color: #515a6e;padding-left:20px;">课程成绩表</router-link>
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="系统管理">
            <MenuItem name="6">
                <router-link to="/Account" style="color: #515a6e;padding-left:20px;">账号管理</router-link>
            </MenuItem>
        </MenuGroup>
    </Menu>
  <!-- <Menu active-name="1" theme="light" width="auto">
      <MenuItem name="1"><Icon type="ios-analytics"></MenuItem>
      <Submenu name="2">
          <template slot="title">
              <Icon type="ios-keypad"></Icon>
              关卡数据
          </template>
          <MenuItem name="2-1"><router-link to="/about" style="color: #515a6e">关卡总览</router-link></MenuItem>
          <MenuItem name="2-2"><router-link to="/LevelInfo" style="color: #515a6e">关卡细分</router-link></MenuItem>
      </Submenu>
      <Submenu name="3">
          <template slot="title">
              <Icon type="ios-analytics"></Icon>
              用户数据
          </template>
          <MenuItem name="3-1"><router-link to="/user" style="color: #515a6e">基础数据</router-link></MenuItem>
          <MenuItem name="3-2"><router-link to="/Training" style="color: #515a6e">培训数据</router-link></MenuItem>
      </Submenu>
  </Menu> -->
</template>
<style>
    .nav ul li a{
        display: inline-block;
        width: 150px;
    }
</style>

<script>
export default {
  name: 'Nav',
  props: {
    msg: String,
  },
  data(){
    return{
      activemenu:'1'
    }
  },
  created(){
    let href = window.location.href
    let navLink = href.substr(href.indexOf('#')+1,href.length)
    if(navLink == '/studentManage'){
      this.activemenu = '1'
    }if(navLink == '/courseLibrary'){
      this.activemenu = '2'
    }if(navLink == '/partialMatch'){
      this.activemenu = '3'
    }if(navLink == '/studentGrade'){
      this.activemenu = '4'
    }if(navLink == '/courseScore'){
      this.activemenu = '5'
    }if(navLink == '/Account'){
      this.activemenu = '6'
    }
  },
  mounted: function() {
      this.$nextTick(() => {
      this.$refs.side_menu.updateOpened();
      this.$refs.side_menu.updateActiveName();
    })
  },
  methods:{
    navigateTo(name){
        this.activemenu = name
      }
  }
};
</script>
