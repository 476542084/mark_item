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
                    <h1 v-if="!showMark" class='tittle'>图像管理</h1>
                    <p v-if="!showMark" >你一共上传了{{num}}张图像</p>
										<Divider v-if="!showMark" />
                    <!-- 内容区 -->
                    <div v-if="!showMark" style="float: right;" class="partialMatch_head_right">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link">
                            <Icon type="ios-options" size="24"></Icon>{{initSelect}}
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="0">按上传时间顺序排序</el-dropdown-item>
                            <el-dropdown-item command="-1">按上传时间倒序排序</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>

                    <div v-if="showMark">
                        <i @click="hideMarkImage" class="el-icon-close" style="font-size:35px;cursor: pointer;"></i>
                      <TestPage v-if="showMark" :imageData="imageData" >
                      </TestPage>
                    </div>

                    <div style="top: -56%; z-index: 9999" v-if="showChat" :class="showChatFlag ? 'wechat':'notwechat'" >
                        <span style="  z-index:99999;margin-left: -32px;
                        position: absolute;
                        margin-top: -32px;">
                          <i @click="cancel"  class="el-icon-close" style="font-size:35px;cursor: pointer;"></i>

                        </span>
                        <div class="sidebar">
                            <div class="m-card">
                                <header style="display: flex;
                                box-sizing: border-box;
                                justify-content: center;
                                align-items: center;">
                                    <img align="middle" class="avatar"   width="40" height="40" :alt="text" :src="headUrl + selfHeadUrl">
                                    <p class="name">{{selfUserName}}</p>
                                </header>
                                <footer>
                                    <input disabled class="search" type="text" placeholder="参与人员">
                                </footer>
                            </div>

                            <div class="m-list" style="
                            height: 360px;">
                                <ul style=" overflow-y: auto;height: 350px;">
                                    <li v-for="item in userList" >
                                        <img class="avatar"  width="30" height="30" :alt="text" :src="headUrl + item.head_url">
                                        <p class="name">{{item.user_name}}</p>
                                    </li>
                                </ul>
                            </div>

                        </div>
                        <div class="main">
                            <div class="m-message" >
                                <ul>
                                    <li v-for="item in chatList" :class="item.user_name == selfUserName ? 'self' : ''">
                                        <p class="time"><span>{{item.time |dataFormat}}</span></p>
                                        <div class="main" >
                                            <img class="avatar" width="30" height="30" :src="headUrl + item.head_url" />
                                            <div class="text">{{item.content}}</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="m-text">
                                <textarea placeholder="按 Ctrl + Enter 发送" v-model="text" @keyup="inputing"></textarea>
                            </div>
                        </div>
                    </div>


										<div v-show="!showChat && !showMark" class="courseScoreContent">
											<!-- 学员成绩表 -->
                      <div class="studentTranscript">
                          <div class="groupCard">
                            <!-- 卡片 -->
                            <div @click="showUploadStatus()">
                                <el-form label-width="100px">
                                    <el-form-item >
                                        <el-upload
                                          :disabled="enUpload == '0'? true : false "
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
                            </div>
                              <el-card  style="width: 178px;
                              height: 178px;
                              margin-left: 30px;" v-for="(item, index) in data"  :key="index" >
                                  <div class="content"  style="">
                                    <div style="align-items: center;
                                    position: relative;
                                    display: flex;
                                    justify-content: center;" @mouseenter="enter(index)" @mouseleave="leave(index)">
                                      <img  style="width: 175px;height: 175px;"  :src="imageUrl+item.url" >
                                      <div v-show="seen&&index==current" style="position: absolute;
                                      height: 178px;
                                      display: flex;
                                      width: 178px;
                                      justify-content: center;
                                      align-items: center;
                                      background: rgba(255,255,255,0.8);">
                                          <i @click="handleEdit(index)"  class="el-icon-edit" style="font-size:35px;cursor: pointer;"></i>
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
				<Footer class="layout-footer-center" style="background:#fff;text-align:center">图像标注在线协作系统 2019 &copy; 20150390237 黄志谋</Footer>
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
import TestPage from '@/components/pages/TestPage.vue';
import vm from '@/utils/vm';


require('../viewstyle/courseScore.scss');
require('../viewstyle/wechat.scss');
// require('../viewstyle/studentGrade.scss');

export default {
  data() {
    return {
      enUpload:sessionStorage.getItem('enUpload'),
      enDelUpload:sessionStorage.getItem('enDelUpload'),
      enChat:sessionStorage.getItem('enChat'),
      initSelect:'按上传时间顺序排序',
      mark_id:'',
      selfHeadUrl:sessionStorage.getItem('head_url')||'',
      selfUserName:sessionStorage.getItem('userName')||'',
      userList:[],
      chatList:[],
      userId:sessionStorage.getItem('userId') || -1,
      imageData: {},
      showMark: false,
      showChat: false,
      showChatFlag: false,
      data: {},
      text: '',
      current: 0,
      seen: false,
      num: 0,
      uploadData: { id: sessionStorage.getItem('userId') || -1 },
      newFriendName: '',
      imageUrl: '',
      headUrl:Config.head_url
    };
  },
  created() {
  },
  methods: {
    showUploadStatus(){
      if(this.enUpload == 0){
        this.$message({
          message: '你已经被禁止上传图像',
          type: 'error',
        });
        return false;
      }
    },
    ascNum(array,key){
    return array.sort(function(a,b){
     var x = a[key];
     var y = b[key];
     return ((x>y)?-1:(x<y)?1:0)
    })
   },
   descNum(array,key){
    return array.sort(function(a,b){
     var x = a[key];
     var y = b[key];
     return ((x<y)?-1:(x>y)?1:0)
    })
   },

    handleCommand(e) {
      if (e == 0) {
        this.initSelect = '按上传时间顺序排序';
        this.data = this.ascNum(this.data,'time');
      } else if (e == -1) {
        this.initSelect = '按上传时间倒序排序';
        this.data = this.descNum(this.data,'time');
      }
    },
    inputing(e) {
      
      if (e.keyCode === 13 && this.text.length) {
        if(!(this.text.trim()).length){
          this.$message({
              message: '不能发送空消息',
              type: 'error',
            });
            this.text = '';
            return true;
        }

        if(this.enChat == 0){
        this.$message({
          message: '你已经被禁止留言',
          type: 'error',
        });
        this.text = '';
        return false;
      }

        this.text = this.text.trim()
        const data = {
          content: this.text,
          time: new Date().getTime(),
          self: true,
          head_url:this.selfHeadUrl,
          user_name:this.selfUserName
        };
        let dom = document.getElementsByClassName('m-message')[0]
        this.chatList.push(data)
        this.addOneMessageByMark(this.text);
        this.text = '';
        this.$nextTick(() => {
          dom.scrollTop = dom.scrollHeight - dom.clientHeight +95;
        });
      }else{
        
      }
    },
    hideMarkImage() {
      this.getContent();
      this.showMark = false;
      this.showChat = false;
    },
    handleEdit(index) {
      const image = {
        width: 960,
        height: 600,
        url: Config.pic_url + this.data[index].url,
        id: this.data[index].id,
      };

      this.imageData = image;
      this.showMark = true;

    },
    cancel() {
      this.showChatFlag = false;
      setTimeout(() => {
        this.showChat = false;
      }, 400);

    },
    handleDel(id) {
      if(this.enDelUpload == 0){
        this.$message({
          type: 'error',
          message: '你已经被禁止删除图像',
        });
        return false;
      }
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
      this.seen = true;
      this.current = index;
    },
    leave() {
      this.seen = false;
      this.current = null;
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
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
      ParamidaPay.ApiCaller.post('index/showUploadPic', { id: this.userId },
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
        ParamidaPay.ApiCaller.post('index/addOneFriend', { friendName: this.newFriendName, id: this.userId },
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
    addOneMessageByMark(postData){

      if(this.mark_id == undefined){
        this.$message({
              message: '请先保存再留言哦',
              type: 'error',
            });
      this.showChat = false;
      this.showChatFlag = false;
      return false;
      }
      ParamidaPay.ApiCaller.post('index/addOneMessageByMark', { mark_id: this.mark_id, user_id: this.userId,content:postData },
          (response) => {
            if (response.errcode == 0) {
              this.$message({
                type: 'success',
                message: '发送成功',
              });
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
  },
  filters:{
  dataFormat:function(time){
    var date=new Date(time);
    var year=date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
    var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
    var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
    var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
    var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
    // 拼接
    return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;

  }
  },
  mounted() {
    this.getContent();
  },
  created() {
    const that = this;
    vm.$off('showChat');
    vm.$on('showChat', (showChat) => {
      this.showChat = true;
      this.showChatFlag = true;
      this.userList = showChat.user || []
      this.chatList = showChat.data || []
      this.mark_id = showChat.mark_id
    });
  },
  components: {
    Nav,
    Head,
    Bottom,
    TestPage,
  },
};
</script>
