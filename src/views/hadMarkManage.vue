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
              <h1 class='tittle'>已标注管理</h1>
              <p >一共标注了{{num}}张图像</p>
              <Divider />
            <div class="partialMatch_head">
            
              <div class="partialMatch_head_right">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <Icon type="ios-options" size="24"></Icon>{{initSelect}}
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">标注数从高到低</el-dropdown-item>
                    <el-dropdown-item command="-1">标注数从低到高</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="groupCard" style="width: 100%;
            min-height: 200px;
            height: auto;
            display: flex;
            flex-wrap: wrap;
            margin-left: -10px;">

                <el-card  style="width: 178px;    margin-top: 20px;
                height: 178px;
                margin-left: 30px;" v-for="(item, index) in data"  :key="index" >
                    <div class="content"  style="">
                      <div style="align-items: center;position: relative;
                      display: flex;
                      justify-content: center;" @mouseenter="enter(index)" @mouseleave="leave(index)">
                        <img  style="width: 175px;height: 175px;"  :src="imageUrl+item.url" >
                        <label class="partialMatch_content_label"><Icon class="partialMatch_content_icon" type="md-checkmark" /></label>
                        <div v-show="seen&&index==current" style="position: absolute;
                        height: 178px;
                        display: flex;
                        width: 178px;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        background: rgba(255,255,255,0.8);">
                            <!-- <i @click="handleEdit(index)"  class="el-icon-edit" style="font-size:35px;cursor: pointer;"></i> -->
                            <i @click="handleDel(item.id)" class="el-icon-delete" style="font-size:35px;cursor: pointer;"></i>
                            <div>
                                <p style="    overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                font-weight: bold;
                                text-align: center;
                                width: 175px;
                                margin-top: 5px;
                                font-size: 20px;">标注数：{{item.nums}}</p>

                            </div>
                        </div>

                      </div>
                    </div>
                  </el-card>

              <!-- <ul>
                <li v-for="(item,index) in 7" :key="'student'+index">
                    <div class="partialMatch_item">
                      <label class="partialMatch_content_label"><Icon class="partialMatch_content_icon" type="md-checkmark" /></label>
                      <div class="partialMatch_item_content">
                        <p class="partialMatch_item_content_title">{{item}}</p>
                        <Icon type="ios-person" size="40" style="color: gray"></Icon>
                        <p style="color: gray">{{item}}人</p>
                      </div>
                    </div>
                </li>
              </ul> -->
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center" style="background:#fff;text-align:center">图像标注在线协作系统 2019 &copy; 20150390237 黄志谋</Footer>
    </Layout>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"
import Config from '../config.js';
require("../viewstyle/partialMatch.scss")
require('../viewstyle/courseScore.scss');

export default {
  name:'partialMatch',
  components: {
    Nav,
    Head,
    Bottom,
  },
	data() {
    return {
      current: 0,
      seen: false,
      data:[],
      imageUrl:Config.pic_url,
      userId:sessionStorage.getItem('userId') || -1,
      num:0,
      studentData: [],
      groupCount: 0,
      initSelect: '标注数从高到低',
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
            this.initContent();
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
    initContent() {
      ParamidaPay.ApiCaller.post('index/showHadMarkImage', { id: this.userId},
        (response) => {
          if (response.errcode == 0) {
            this.data = response.data;
            this.data = this.ascNum(this.data,'nums');
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
    handleCommand(e) {
      if (e == 0) {
        this.initSelect = '标注数从高到低';
        this.data = this.ascNum(this.data,'nums');
      } else if (e == -1) {
        this.initSelect = '标注数从低到高';
        this.data = this.descNum(this.data,'nums');
      }
    }
  },
  mounted() {
    this.initContent();
  },
}
</script>
>

