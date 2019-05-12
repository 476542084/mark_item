<template>
  <Menu  :active-name="activemenu" ref='side_menu' style="width:200px" @on-select="navigateTo" class="nav">
        <MenuGroup title="图像标注">
            <MenuItem name="1">
              <router-link to="/imageManage" style="color: #515a6e;padding-left:20px;">图像标注</router-link>
            </MenuItem>
            <MenuItem name="2">
              <router-link to="/shareManage" style="color: #515a6e;padding-left:20px;">好友分享信息</router-link>
            </MenuItem>
            <MenuItem name="3">
              <router-link to="/hadMarkManage" style="color: #515a6e;padding-left:20px;">已标注图像</router-link>
            </MenuItem>
        </MenuGroup>
        <MenuGroup title="用户管理">
          <MenuItem name="4">
            <router-link to="/userManage" style="color: #515a6e;padding-left:20px;">个人信息</router-link>
          </MenuItem>
          <MenuItem name="5">
            <router-link to="/friendManage" style="color: #515a6e;padding-left:20px;">好友管理</router-link>
          </MenuItem>
        </MenuGroup>
        <MenuGroup title="消息管理">
            <MenuItem name="6">
                <router-link to="/showAllMessage" style="color: #515a6e;padding-left:20px;">标注留言</router-link>
            </MenuItem>
        </MenuGroup>
        <MenuGroup v-if="userType == '777777'" title="权限管理">
            <MenuItem name="7">
                <router-link to="/powerManage" style="color: #515a6e;padding-left:20px;">权限控制</router-link>
            </MenuItem>
        </MenuGroup>
  </Menu>
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
  data() {
    return {
      activemenu: '1',
      userType:'111',
    };
  },
  created() {
    this.userType = sessionStorage.getItem('userType');
    const { href } = window.location;
    const navLink = href.substr(href.indexOf('#') + 1, href.length);
    if (navLink == '/imageManage') {
      this.activemenu = '1';
    } if (navLink == '/shareManage') {
      this.activemenu = '2';
    } if (navLink == '/hadMarkManage') {
      this.activemenu = '3';
    } if (navLink == '/userManage') {
      this.activemenu = '4';
    } if (navLink == '/friendManage') {
      this.activemenu = '5';
    } if (navLink == '/showAllMessage') {
      this.activemenu = '6';
    }if (navLink == '/powerManage') {
      this.activemenu = '7';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.side_menu.updateOpened();
      this.$refs.side_menu.updateActiveName();
    });
  },
  methods: {
    navigateTo(name) {
      this.activemenu = name;
    },
  },
};
</script>
