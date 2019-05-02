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
            <!--<h1 class='tittle'>学员管理</h1>-->
            <div class="student_head">
              <div class="student_head_left">
                <span>当前共{{studentData.groupCount}}组，共{{studentData.studentCount}}名学员</span>
              </div>
              <div class="student_head_right">
                <span class="student_seach">
                  <Icon @click="searchStudent" type="ios-search" size="24" class="student_head_right_icon"></Icon>
                  <input @keyup.13="searchStudent" v-model="searchText" type="text" autocomplete="off" placeholder="搜索"
                         class="el-input__inner student_head_right_search">
                </span>

                <el-dropdown @command="selectItem">
                  <span class="el-dropdown-link">
                    <Icon type="ios-options" size="24"></Icon>{{initSelect}}
                  </span>
                 <input @click="test" type="button" value="test">
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">最后修改在线</el-dropdown-item>
                    <el-dropdown-item command="-1">创建最早在前</el-dropdown-item>
                    <el-dropdown-item command="1">创建最晚在前</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <span @click="centerDialogVisible = true" class="student_head_right_add">
                  +创建分组
                </span>
              </div>
            </div>
            <div class="student_content">
              <ul>
                <li v-for="(item,index) in studentData.datas" :key="'student'+index">
                  <router-link :to=" { path:
                  'studentManageDetail',query: { code: item.groupId, name: item.groupName }}">
                    <div class="student_item">
                      <div class="student_item_content">
                        <p class="student_item_content_title">{{item.groupName}}</p>
                        <Icon type="ios-person" size="40" style="color: gray"></Icon>
                        <p style="color: gray">{{item.studentNum}}人</p>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center" style="background:#fff;text-align:center">中国大地保险 2018 &copy; 脑穿越</Footer>
    </Layout>

    <el-dialog
      title="创建分组"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>分组名称*</span>
      <el-input v-model="add_group" type="text" placeholder="请输入分组名称" style="    width: 280px;
    margin-left: 20px;margin-right: 20px"></el-input>
      <span>({{maxLength}}/10)</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addGroup">下一步</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Nav from '@/components/Nav.vue'; // @ is an alias to /src
  import Head from '@/components/Head.vue';
  import Bottom from '@/components/Bottom.vue';
  import ParamidaPay from '../paramidaPay.js';

  require('../viewstyle/studentManage.scss');

  export default {
    name: 'studentManage',
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
    created() {
    },
    mounted() {
     
    },
    methods: {
      test(){
        console.log("dsdsd")

        ParamidaPay.ApiCaller.post('index/selectAllUser', {id:1},
        response => {
          if (response.errcode == 0) {
            console.log('response',response)
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



      },
      searchStudent() {
        let data = {};
        if (this.searchText != '') {
          data = {'groupName': this.searchText};
        }
        ParamidaPay.ApiCaller.get('/student/studentGroups', data,
          response => {
            if (response.errcode == 0) {
              this.studentData = response.body;
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

      },
      seachStudent(item) {
        return true;
      },

      selectItem(value) {
        let data = {};
        if (value != '') {
          data = {'order': value};
          ParamidaPay.ApiCaller.get('/student/studentGroups', data,
            response => {
              if (response.errcode == 0) {
                this.studentData = response.body;
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
      },

      handleCommand(e) {
        if (e == 0) {
          this.initSelect = '最后修改在前';
        } else if (e == -1) {
          this.initSelect = '创建最早在前';
        } else if (e == 1) {
          this.initSelect = '创建最晚在前';
        }
      },
      addGroup() {
        if (this.maxLength > 10) {
          this.$message.error('分组名称超过限定长度');
        } else {
          let data = {'groupName': this.add_group, 'token': this.token}
          ParamidaPay.ApiCaller.post('/student/studentGroup', data,
            response => {
              if (response.errcode == 0) {
                this.$message({
                  'message': '创建成功',
                  'type': 'success'
                })
                this.searchStudent();
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
          this.centerDialogVisible = false;
          return true;
        }
      },
      getGroups() {
        // this.$prompt('创建分组', '分组名称*', {
        //
        // })
      }


    },
    watch: {
      add_group(newValue, oldValue) {
        this.maxLength = newValue.length;
      }
    },
    components: {
      Nav,
      Head,
      Bottom,
    }
  };
</script>

