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
            <!--<h1 class='tittle'>课程库</h1>-->
            <div class="courseLibrary_head">
              <div class="courseLibrary_head_left">
                <span>当前共19个课程</span>
              </div>
              <div class="courseLibrary_head_right">
                <span class="courseLibrary_seach">
                  <Icon @click="searchcourseLibrary" type="ios-search" size="24"
                        class="courseLibrary_head_right_icon"></Icon>
                  <input @keyup.13="searchcourseLibrary" v-model="searchText" type="text" autocomplete="off"
                         placeholder="搜索"
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
                <router-link :to="{path:'courseLibraryForm'}">
                  <span class="courseLibrary_head_right_add">
                  +创建课程
                </span>
                </router-link>

              </div>
            </div>

            <div class="courseLibrary_content">
              <el-table
                :data="courseLibraryData"
                :border="true"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="课程名称"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="account"
                  label="考核次数"
                  align="center"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="remark"
                  align="center"
                  label="备注">
                </el-table-column>
                <el-table-column
                  label="编辑"
                  align="center"
                  width="80">
                  <template slot-scope="scope">
                    <Icon @click="handleEdit(scope.$index,scope.row)" class="courseLibrary_edit" type="ios-create-outline" size="30"/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  align="center"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="createUser"
                  align="center"
                  label="创建人">
                </el-table-column>
                <el-table-column
                  prop="editTime"
                  align="center"
                  label="修改时间">
                </el-table-column>
                <el-table-column
                  prop="releaseUser"
                  align="center"
                  label="发布人">
                </el-table-column>
              </el-table>
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
  require("../viewstyle/courseLibrary.scss")
  export default {
    name: 'courseLibrary',
    components: {
      Nav,
      Head,
      Bottom,
    },
    data() {
      return {
        courseLibraryData:[
          {
            'name':'张三',
            'account':'3',
            'remark':'无',
            'createTime':'2019.5.20.09:33',
            'createUser':'admin',
            'editTime':'2019.5.20.09:33',
            'releaseUser':'xiexie'
          },{
            'name':'张三',
            'account':'3',
            'remark':'无',
            'createTime':'2019.5.20.09:33',
            'createUser':'admin',
            'editTime':'2019.5.20.09:33',
            'releaseUser':'xiexie'
          }
          ],
        searchText: '',
        initSelect:'最后修改在线'
      }
    },
    created() {
    },
    methods: {
      searchcourseLibrary() {

      },
      selectItem(value) {

      },
      handleEdit(index,scope){
        console.log('index',index);
        console.log('scope',scope);
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
      },
    }

  }
</script>
