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
											<el-form-item label="个人用户名">
												<el-input style="width:200px;" v-model="data.user_name"></el-input>
												<el-button type="primary" style="margin-left:50px;" @click="handleName()" >修改</el-button>
											</el-form-item>
											<el-form-item label="个人密码">
													<el-input type="password" style="width:200px;" v-model="password"></el-input>
													<el-button type="primary" style="margin-left:50px;" @click="handlePassWord()" >修改</el-button>
												</el-form-item>
											<el-form-item label="个人头像">
													<el-upload
														class="avatar-uploader"
														action="http://localhost/mark_item_php/index/editUserPic"
														:data="uploadData"
														:show-file-list="false"
														:on-success="handleAvatarSuccess"
														:before-upload="beforeAvatarUpload">
														<img style="width: 200px; height: 200px"  :src="url" class="avatar">
													</el-upload>
											</el-form-item>
										</el-form>
						</div>
					</Content>
				</Layout>
			</Layout>
		<Footer class="layout-footer-center" style="background:#fff;text-align:center">建设银行智能私教管理后台 2019 &copy; 脑穿越</Footer>
		</Layout>
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
      url: '',
      data: {},
      uploadData: {},
      realName: '',
      password: '',
    };
  },
  methods: {
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
      ParamidaPay.ApiCaller.post('index/userOne', { id: 1 },
        (response) => {
          if (response.errcode == 0) {
            this.data = response.data;
            this.url = Config.head_url + this.data.head_url;
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
      if (this.realName === this.data.user_name) {
        this.$message({
          message: '与原名相同，修改失败',
          type: 'error',
        });
      } else {
        	ParamidaPay.ApiCaller.post('index/editUserName', { user_name: this.data.user_name, id: 1 },
          (response) => {
            if (response.errcode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
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
      }
    },
    handlePassWord() {
      if (this.password != '') {
        ParamidaPay.ApiCaller.post('index/editPassword', { password: md5(this.password), id: 1 },
          (response) => {
            if (response.errcode == 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
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
