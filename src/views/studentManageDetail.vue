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
            <p class='tittle'>
              <router-link :to="{path: 'studentManage'}"><span>学员管理 </span></router-link>
              <span>{{detailGroup}}</span>
              <span>（共{{totalPerson}}人）</span>
            </p>
            <div class="student_head">
              <div class="student_head_right">
                <span class="student_seach">
                  <Icon @click="searchStudentDetail" type="ios-search" size="24" class="student_head_right_icon"></Icon>
                  <input @keyup.13="searchStudentDetail" v-model="searchText" type="text" autocomplete="off"
                         placeholder="搜索"
                         class="el-input__inner student_head_right_search">
                </span>
                <el-upload
                  :show-file-list="false"
                  :action="uploadUrl()"
                  :data="uploadData()"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  style="display: inline-block;"
                >
                  <Icon type="ios-download" size="25" class="student_head_right_icon"></Icon>
                </el-upload>
                <a :href="url+'/student/downloadTemplate'" style="margin: 15px;">下载模板</a>
                <a :href="exportPath|objectToString(url)">导出名单</a>




              </div>
            </div>
            <div class="student_content">
              <el-table
                :data="studentDetailData.rows"
                :border="true"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  align="center"
                  label="名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="account"
                  align="center"
                  label="学员账号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  align="center"
                  label="上传时间">
                </el-table-column>
                <el-table-column
                  prop="createUser"
                  align="center"
                  label="上传人">
                </el-table-column>
              </el-table>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Footer class="layout-footer-center" style="background:#fff;text-align:center">中国大地保险 2018 &copy; 脑穿越</Footer>
    </Layout>

    <el-dialog
      title="导入失败"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>有X个学员账号已存在</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="importSame">导出重复学员名单</el-button>
    <el-button @click="centerDialogVisible = false" type="primary">确定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import Nav from '@/components/Nav.vue'; // @ is an alias to /src
  import Head from '@/components/Head.vue';
  import Bottom from '@/components/Bottom.vue';
  import ParamidaPay from '../paramidaPay.js';
  import Config from '../config.js'

  require('../viewstyle/studentManage.scss');

  export default {
    name: 'studentManageDetail',
    components: {
      Nav,
      Head,
      Bottom,
    },
    data() {
      return {
        studentDetailData: [],
        totalPerson: 0,
        detailGroup: '',
        groupId: null,
        centerDialogVisible: false,
        searchText: '',
        url: Config.api,
        exportPath:{'groupId':null, 'pageNo':1, 'pageSize':20, 'searchField':' '}
      };
    },
    created() {
    },
    mounted() {
      this.initTable();
    },
    methods: {
      initTable() {
        this.groupId = this.$route.query.code;
        this.exportPath.groupId = this.$route.query.code;
        let data = {'pageNo': 1, 'pageSize': 20, 'groupId': this.groupId};
        console.log(this.$route.query.code);
        ParamidaPay.ApiCaller.get('/student/students', data,
          response => {
            if (response.errcode == 0) {
              console.log('body', response.body);
              this.studentDetailData = response.body;
              this.detailGroup = '<' + this.$route.query.name;
              this.totalPerson = response.body.total || 0;
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
      uploadUrl(){
        return this.url+"/student/importExcel";
      },
      uploadData(){
        return {
          'groupId': this.groupId,
          'token': this.token
        }
      },
      uploadSuccess(){
        this.$message({
          'message':'上传成功',
          'type':'success'
        });
      },
      uploadError(){
        this.$message({
          'message':'上传失败',
          'type':'error'
        });
        this.centerDialogVisible = true;
      },
      searchStudentDetail() {
        console.log('searchText', this.searchText);
        let data = {'searchField': this.searchText, 'groupId': this.groupId}
        ParamidaPay.ApiCaller.get('/student/students', data,
          response => {
            if (response.errcode == 0) {
              this.studentDetailData = response.body;
              this.exportPath.searchField = this.searchText;
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
    },
    filters:{
      objectToString: function(value,url){
          let str = '';
          for(let item in value){
            str += '' + item + '=' + value[item] + '&';
          }
          return url+'/student/downloadTemplate/?'+str.slice(0,str.length-1);

      }
    }
  };
</script>

