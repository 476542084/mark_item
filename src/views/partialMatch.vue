<template lang="html">
  <div class="layout">
    <Layout>
      <Header>
        <Head></Head>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Nav></Nav>
        </Sider>
        <Layout :style="{padding: '24px'}">
          <Content :style="{padding: '24px', minHeight: '780px', background: '#fff'}">
            <div class="partialMatch_head">
              <div class="partialMatch_head_left">
                <span>当前共8组，共发布2组课程</span>
              </div>
              <div class="partialMatch_head_right">
                <span class="partialMatch_search">
                  <Icon @click="searchMatch" type="ios-search" size="24" class="partialMatch_head_right_icon"></Icon>
                  <input @keyup.13="searchMatch" v-model="searchText" type="text" autocomplete="off" placeholder="搜索"
                         class="el-input__inner student_head_right_search">
                </span>

                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <Icon type="ios-options" size="24"></Icon>{{initSelect}}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">最后修改在线</el-dropdown-item>
                    <el-dropdown-item command="-1">创建最早在前</el-dropdown-item>
                    <el-dropdown-item command="1">创建最晚在前</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="partialMatch_content">
              <ul>
                <li v-for="(item,index) in 7" :key="'student'+index">
                  <!--<router-link :to=" { path:-->
                  <!--'studentManageDetail',query: { code: item.groupId, name: item.groupName }}">-->
                    <div class="partialMatch_item">
                      <label class="partialMatch_content_label"><Icon class="partialMatch_content_icon" type="md-checkmark" /></label>
                      <div class="partialMatch_item_content">
                        <p class="partialMatch_item_content_title">{{item}}</p>
                        <Icon type="ios-person" size="40" style="color: gray"></Icon>
                        <p style="color: gray">{{item}}人</p>
                      </div>
                    </div>
                  <!--</router-link>-->
                </li>
              </ul>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center" style="background:#fff;text-align:center">中国大地保险 2018 &copy; 脑穿越</Footer>
    </Layout>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"

require("../viewstyle/partialMatch.scss")

export default {
  name:'partialMatch',
  components: {
    Nav,
    Head,
    Bottom,
  },
	data() {
    return {
      studentData: [],
      groupCount: 0,
      initSelect: '最后修改在线',
      centerDialogVisible: false,
      add_group: '',
      maxLength: 0,
      searchText: '',
      token: this.$store.state.token
    };
	},
	created(){
	},
	methods: {
    searchMatch(){

    },
    handleCommand(e) {
      console.log('ddd',e);
      if (e == 0) {
        this.initSelect = '最后修改在前';
      } else if (e == -1) {
        this.initSelect = '创建最早在前';
      } else if (e == 1) {
        this.initSelect = '创建最晚在前';
      }
    }
	}
}
</script>
>

