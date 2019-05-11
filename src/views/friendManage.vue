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
							      <h1 class='tittle'>好友管理</h1>
										<Divider />
										<!-- 内容区 -->
										<div class="courseScoreContent">

                      <!-- 搜索框 -->
                      <div style="display:flex;margin-right:100px;">
                          <div class="serach" style="    margin-left: 10px;">
                              <!-- <Icon type="ios-add" size="32" @click="add" style="margin-top:4px;cursor: pointer;"/> -->
                              <input placeholder="输入需要添加用户" type="text" v-model="newFriendName" style="-webkit-appearance: none;
                              background-color: #FFFFFF;
                              background-image: none;
                              border-radius: 4px;
                              border: 1px solid #DCDFE6;
                              -webkit-box-sizing: border-box;
                              box-sizing: border-box;
                              color: #606266;
                              display: inline-block;
                              font-size: inherit;
                              height: 40px;
                              line-height: 40px;
                              outline: none;
                              padding: 0 15px;">
                              <el-button style="margin-left: 20px;"  @click="add" type="primary">添加好友</el-button>
                          </div>
                      </div>
											<!-- 学员成绩表 -->
                      <div class="studentTranscript">
                          <div class="groupCard" v-show="showStudentTable">
                            <!-- 卡片 -->
                            <el-card class="Card" v-for="(item, index) in data"   :key="index">
                              <div @click="del(item.id)" class="content"   style="display: flex;
                              align-items: center;
                              justify-content: center;
                              flex-wrap: wrap;">
                                <div style="    align-items: center;
                                display: flex;
                                justify-content: center;    height: 140px;" >
                                  <img style="width: 120px;height: 120px;"  :src="url+item.head_url" >
                                </div>
                                <div >
                                    <p style="margin-left: 15px;" >用户名：</p>
                                    <p style="margin-left: 15px;" class="groupName">{{item.user_name}}</p>
                                </div>
                              </div>
                             

                            </el-card>
                            
                          </div>
                      </div>
										</div>
                  </Content>
                </Layout>
            </Layout>
				<Footer class="layout-footer-center" style="background:#fff;text-align:center">中国大地保险 2018 &copy; 脑穿越</Footer>
        </Layout>
    </div>
</template>

<script>
import Nav from '@/components/Nav.vue'; // @ is an alias to /src
import Head from '@/components/Head.vue';
import Bottom from '@/components/Bottom.vue';
import ParamidaPay from '../paramidaPay.js';
import Config from '../config.js';

require('../viewstyle/courseScore.scss');
require('../viewstyle/studentGrade.scss');

export default {
  data() {
    return {
      current: 0,
      seen: false,
      userId:sessionStorage.getItem('userId') || -1,
      userName:sessionStorage.getItem('userName') || '',
      data: {},
      newFriendName: '',
      url: Config.head_url,
      showStudentTable: true, // 是否显示学员表
      cardList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      // 排序状态
      sortStatus: [
        {
          value: '创建最早在前',
          label: '创建最早在前',
        },
        {
          value: '创建最晚在前',
          label: '创建最晚在前',
        },
      ],
      sortMethods: '创建最早在前',
    };
  },
  created() {
  },
  methods: {
    enter(index) {
      console.log('ddd');
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },

    // 具体分组查看学生的成绩
    ToSeeStudentScore(index) {
      this.showStudentTable = false;
      console.log(index);
    },
    // 返回学员分组表
    backGroupTable() {
      this.showStudentTable = true;
    },
    getContent() {
      ParamidaPay.ApiCaller.post('index/showAllFriends', { id: this.userId },
        (response) => {
          if (response.errcode == 0) {
            this.data = response.data;

          } else {
            this.$message({
              message: response.errcode,
              type: 'error',
            });
            this.data = {};
          }
        },
        (response) => {
          this.$message({
            message: response.errcode,
            type: 'error',
          });
        },
      );
    },
    del(id) {
      this.$confirm('是否删除该好友?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delFriend(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    delFriend(index) {
      ParamidaPay.ApiCaller.post('index/delOneFriend', { firendID: index, id: this.userId },
        (response) => {
          if (response.errcode == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getContent();
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
    },
    add() {
      if (this.newFriendName != '') {
        this.newFriendName = this.newFriendName.replace(/\s*/g,"");
        if(this.newFriendName == this.userName){
          this.$message({
            message: '你不能添加你自己！',
            type: 'error',
            });
            return false;
          }
        ParamidaPay.ApiCaller.post('index/addOneFriend', { friendName: this.newFriendName, id: this.userId},
          (response) => {
            if (response.errcode == 0) {
              this.$message({
                type: 'success',
                message: '新添成功',
              });
              this.getContent();
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
      }else{
        this.$message({
                message: '请正确填写用户名',
                type: 'error',
              });
      }
    },
  },

  mounted() {
    this.getContent();
  },
  components: {
    Nav,
    Head,
    Bottom,
  },
};
</script>
