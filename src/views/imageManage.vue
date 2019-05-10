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
                    <h1 class='tittle'>图像管理</h1>
                    <p >共上传了{{num}}张图像</p>
										<Divider />
                    <!-- 内容区 -->
                    <div v-if="showChat" :class="showChatFlag ? 'wechat':'notwechat'" >
                        <span style="    margin-left: -32px;
                        position: absolute;
                        margin-top: -32px;">

                          <i @click="cancel"  class="el-icon-close" style="font-size:35px;cursor: pointer;"></i>

                        </span>
                        <div class="sidebar">
                            <div class="m-card">
                                <header>
                                    <img align="middle" class="avatar" width="40" height="40" :alt="text" :src="text">
                                    <p class="name">ddd</p>
                                </header>
                                <footer>
                                    <input class="search" type="text" placeholder="search user..." v-model="text">
                                </footer>
                            </div>

                            <div class="m-list" style="
                            height: 360px;">
                                <ul style=" overflow-y: auto;height: 350px;">
                                    <li v-for="item in 4">
                                        <img class="avatar"  width="30" height="30" :alt="text" :src="text">
                                        <p class="name">sdffd</p>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div class="main">
                            <div class="m-message" >
                                <ul>
                                    <li v-for="item in 6">
                                        <p class="time"><span>2019-05-09</span></p>
                                        <div class="main" >
                                            <img class="avatar" width="30" height="30" :src="text" />
                                            <div class="text">撒打算打算</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="m-text">
                                <textarea placeholder="按 Ctrl + Enter 发送" v-model="text" @keyup="inputing"></textarea>
                            </div>
                        </div>
                    </div>


										<div v-show="!showChat" class="courseScoreContent">
											<!-- 学员成绩表 -->
                      <div class="studentTranscript">
                          <div class="groupCard" v-show="showStudentTable">
                            <!-- 卡片 -->
                            <el-form  label-width="100px">
                                <el-form-item >
                                    <el-upload
                                      class="avatar-uploader"
                                      action="http://localhost/mark_item_php/index/uploadPic"
                                      :data="uploadData"
                                      :show-file-list="false"
                                      :on-success="handleAvatarSuccess"
                                      :before-upload="beforeAvatarUpload">
                                      <i class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                              </el-form>

                              <el-card  style="width: 178px;
                              height: 178px;
                              margin-left: 30px;" v-for="(item, index) in data"  :key="index" >
                                  <div class="content"  style="">
                                    <div style="align-items: center;
                                    display: flex;
                                    justify-content: center;    height: 140px;" @mouseenter="enter(index)" @mouseleave="leave(index)">
                                      <img  style="width: 175px;height: 175px;"  :src="imageUrl+item.url" class="avatar">
                                      <div v-show="seen&&index==current" style="position: absolute;
                                      height: 178px;
                                      display: flex;
                                      width: 178px;
                                      justify-content: center;
                                      align-items: center;
                                      background: rgba(255,255,255,0.8);">
                                          <i @click="handleEdit(item.id)"  class="el-icon-edit" style="font-size:35px;cursor: pointer;"></i>
                                          <i @click="handleDel(item.id)" class="el-icon-delete" style="font-size:35px;margin-left: 10px;cursor: pointer;"></i>
                                      </div>

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
// import Wechat from '@/vue-wechat/app.vue'

require('../viewstyle/courseScore.scss');
require('../viewstyle/wechat.scss');
// require('../viewstyle/studentGrade.scss');

export default {
  data() {
    return {
      showMark: false,
      showChat: false,
      showChatFlag: false,
      data: {},
      text: '',
      current: 0,
      seen: false,
      num: 0,
      uploadData: { id: 1 },
      newFriendName: '',
      imageUrl: '',
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
    inputing(e) {
      if (e.keyCode === 13 && this.text.length) {
        const data = {
          text: this.text,
          date: new Date(),
          self: true,
        };
        this.text = '';
        console.log('data', data);
      }
    },

    handleEdit(index) {
      this.showChat = true;
      this.showChatFlag = true;
    },
    cancel() {
      this.showChatFlag = false;
      setTimeout(() => {
        this.showChat = false;
      }, 400);

    },
    handleDel(id) {
      this.$confirm('是否删除该图像?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.delImage(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    delImage(index) {
      ParamidaPay.ApiCaller.post('index/delOnepic', { id: index },
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
    enter(index) {
      console.log('ddd');
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message({
        message: '上传成功',
        type: 'success',
      });
      this.getContent();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt8M = file.size / 1024 / 1024 < 8;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt8M) {
        this.$message.error('上传头像图片大小不能超过 8MB!');
      }
      return isJPG && isLt8M;
    },

    getContent() {
      this.imageUrl = Config.pic_url;
      ParamidaPay.ApiCaller.post('index/showUploadPic', { id: 1 },
        (response) => {
          if (response.errcode == 0) {
            this.data = response.data;
            this.num = response.data.length;

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
      ParamidaPay.ApiCaller.post('index/delOneFriend', { firendID: index, id: 1 },
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
        ParamidaPay.ApiCaller.post('index/addOneFriend', { friendName: this.newFriendName, id: 1 },
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
