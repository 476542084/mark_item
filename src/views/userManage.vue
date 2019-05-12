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
						<h1 class='tittle'>个人信息</h1>
						<Divider />
						<!-- 内容区 -->
						<div class="studentGradeContent">
									<el-form  label-width="100px">
											<el-form-item label="账号">
												<el-input :disabled="true" style="width:200px;" v-model="data.account"></el-input>
                      </el-form-item>
                      <el-form-item label="用户名">
                          <el-input :disabled="true" style="width:200px;" v-model="data.user_name"></el-input>
                          <el-button type="primary" style="margin-left:50px;" @click="editUserName =true" >修改</el-button>
                        </el-form-item>
											<el-form-item label="密码">
													<el-input :disabled="true"  type="password"   style="width:200px;" value="testapassword" ></el-input>
													<el-button type="primary" style="margin-left:50px;" @click="editPassWord = true" >修改</el-button>
												</el-form-item>
											<el-form-item label="头像">
													<el-upload
														class="avatar-uploader"
														action="http://localhost/mark_item_php/index/editUserPic"
														:data="uploadData"
														:show-file-list="false"
														:on-success="handleAvatarSuccess"
														:before-upload="beforeAvatarUpload">
														<img style="width: 200px; height: 200px"  :src="url" >
													</el-upload>
											</el-form-item>
										</el-form>
						</div>
					</Content>
				</Layout>
			</Layout>
		<Footer class="layout-footer-center" style="background:#fff;text-align:center">图像标注在线协作系统 2019 &copy; 20150390237 黄志谋</Footer>
    </Layout>
    
    <el-dialog
			title="修改密码"
			:close-on-click-modal="false"
			:visible.sync="editPassWord"
			width="500px"
			>
			<el-form label-position="left" label-width="90px">
				<el-form-item label="新密码">
					<el-input type="password" v-model="newPassWordFirst" @input="getnewPassWordFirstNum" :maxlength="16"  style="width:250px"></el-input>
					<span style="margin-left:30px; font-size:16px;">({{ newPassWordFirstNum }}/16)</span>
				</el-form-item>
				<el-form-item label="再输入一次">
          <el-input type="password" v-model="newPassWordSecond" @input="getnewPassWordSecondNum" :maxlength="16" style="width:250px"></el-input>
					<span style="margin-left:30px; font-size:16px;">({{ newPassWordSecondNum }}/16)</span>
          
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handlePassWord">确认修改</el-button>
				<el-button @click="editPassWord = false">取 消</el-button>
      </span> 
    </el-dialog>

    <el-dialog
			title="修改用户名"
			:close-on-click-modal="false"
			:visible.sync="editUserName"
			width="500px"
			>
			<el-form label-position="left" label-width="90px">
				<el-form-item label="新用户名">
					<el-input  v-model="newUserName" @input="getnewUserNameNum" :maxlength="12"  style="width:250px"></el-input>
					<span style="margin-left:30px; font-size:16px;">({{ newUserNameNum }}/12)</span>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleName">确认修改</el-button>
				<el-button @click="editUserName = false">取 消</el-button>
      </span> 
    </el-dialog>

	</div>
</template>
<script>
import Nav from '@/components/Nav.vue'; // @ is an alias to /src
import Head from '@/components/Head.vue';
import Bottom from '@/components/Bottom.vue';
import ParamidaPay from '../paramidaPay.js';
import Config from '../config.js';
import md5 from 'js-md5'
;

require('../viewstyle/studentGrade.scss');

export default {
  data() {
    return {
      newUserNameNum:0,
      newUserName:'',
      newPassWordFirstNum:0,
      newPassWordSecondNum:0,
      newPassWordFirst:'',
      newPassWordSecond:'',
      editPassWord:false,
      editUserName:false,
      userId: sessionStorage.getItem('userId') || -1,
      url: '',
      data: {},
      uploadData: {},
      realName: '',
      password: '',
    };
  },
  methods: {
    // 获取第一次密码长度
		getnewPassWordFirstNum(value) {
			this.newPassWordFirstNum = value.length
    },
    // 获取第二次密码长度
		getnewPassWordSecondNum(value) {
			this.newPassWordSecondNum = value.length
    },
    getnewUserNameNum(value){
			this.newUserNameNum = value.length
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message({
        message: '修改成功',
        type: 'success',
      });
      this.getContent();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    getContent() {
      ParamidaPay.ApiCaller.post('index/userOne', { id: this.userId },
        (response) => {
          if (response.errcode == 0) {
            this.data = response.data;
            this.url = Config.head_url + this.data.head_url;
            sessionStorage.setItem('head_url',this.data.head_url)
            this.realName = response.data.user_name;
            this.uploadData = { id: this.data.id || '' };
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
    handleName() {
      if (this.newUserName === '') {
        this.$message({
          message: '用户名不能为空',
          type: 'error',
        });
        return false;
 
      }
      if (this.newUserName === this.data.user_name) {
        this.$message({
          message: '与原名相同，修改失败',
          type: 'error',
        });
        return false;
      } else {
        	ParamidaPay.ApiCaller.post('index/editUserName', { user_name: this.newUserName, id: this.userId },
          (response) => {
            if (response.errcode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              sessionStorage.setItem('userName',this.newUserName);
              this.editUserName = false;
              this.newUserName = '';
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
    handlePassWord() {
      if(this.newPassWordFirstNum == 0 || this.newPassWordSecondNum == 0){
        this.$message({
          message: '密码不能为空',
          type: 'error',
        });
        return true;
      }

      if(this.newPassWordFirst !== this.newPassWordSecond){
        this.$message({
          message: '两次密码输入不一致',
          type: 'error',
        });
        return true;
      }
        ParamidaPay.ApiCaller.post('index/editPassword', { password: md5(this.newPassWordFirst), id: this.userId },
          (response) => {
            this.editPassWord = false;
            if (response.errcode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
              });
              this.newPassWordFirst = '';
              this.newPassWordSecond = '';
              this.newPassWordFirstNum = 0;
              this.newPassWordSecondNum = 0;
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
