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
					<Content :style="{padding: '24px', minHeight: '760px', background: '#fff'}">
						<h1 class='tittle'>权限管理</h1>
						<p>一共{{ num }}个用户</p>

						<Divider />
						<!-- 内容区 -->
						<div class="accountContent">
							<div class="accounttitle" style="    justify-content: flex-end;">
								<div style="">
									<!-- 搜索框 -->
									<div class="serach" style="">
										<Icon @click="serach" type="ios-search-outline" size="32" style="margin-top:4px;cursor: pointer;"/>
										<el-input v-model="serachName" style="width:160px;margin-left:5px;" placeholder="查找用户"></el-input>
									</div>
								</div>
							</div>
							<!-- 账号 -->
							<el-table
								:data="tableData"
								border
								style="width:100%;margin:10px 20px;">
								<!-- 名称 -->
								<el-table-column
									label="用户"
									align="center"
									header-align="center"
									width="150">
									<template slot-scope="scope">
										{{ scope.row.user_name }}
									</template>
								</el-table-column>
								<el-table-column
									label="头像"
									align="center"
									header-align="center"
									width="60">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
											<img width="50" height="50" :src="head_url + scope.row.head_url" alt="">
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="上传图像权限"
									align="center"
									header-align="center"
									width="110">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[0] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="addUploadStatus(scope.row.id,scope.row.type[0])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[0] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="删除图像权限"
									align="center"
									header-align="center"
									width="110">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[1] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="delUploadStatus(scope.row.id,scope.row.type[1])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[1] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="新增标注权限"
									align="center"
									header-align="center"
									width="110">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[2] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="addMarkStatus(scope.row.id,scope.row.type[2])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[2] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="修改标注权限"
									align="center"
									header-align="center"
									width="110">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[3] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="editMarkStatus(scope.row.id,scope.row.type[3])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[3] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="删除标注权限"
									align="center"
									header-align="center"
									width="110">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[4] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="delMarkStatus(scope.row.id,scope.row.type[4])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[4] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="留言权限"
									align="center"
									header-align="center"
									width="90">
									<template slot-scope="scope">
											<div style="display: flex;
											justify-content: center;
											align-items: center;">
													<span  :class="scope.row.type[5] == 1 ? 'enable_icon':'disable_icon'"></span>
													<Icon @click="chatStatus(scope.row.id,scope.row.type[5])" 
													style="position: absolute;
													font-size: 23px;
													cursor: pointer;
													color: rgb(255, 255, 255);" 
													slot="prefix" 
													:class="scope.row.type[5] == 1 ? 'el-icon-check':'el-icon-close'" 
													size="24"/>
											</div>
									</template>
								</el-table-column>
								<el-table-column
									label="注册时间"
									align="center"
									header-align="center"
									width="">
									<template slot-scope="scope">
										{{ scope.row.time }}
									</template>
								</el-table-column>
								<el-table-column
									label="操作"
									align="center"
									header-align="center"
									width="">
									<template slot-scope="scope">
										<i @click="delUser(scope.row.id)" style="cursor:pointer;font-size: 30px" class="el-icon-delete"></i>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</Content>
				</Layout>
			</Layout>
			<Footer class="layout-footer-center" style="background:#fff;text-align:center">图像标注在线协作系统 2019 &copy; 20150390237 黄志谋</Footer>
			<div class="accountPage">
		</div>
		</Layout>
	
	</div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"
import Config from '../config.js';
require("../viewstyle/Account.scss")
require("../viewstyle/partialMatch.scss")

export default {
	data() {
		return {
			head_url:Config.head_url,
			userType:sessionStorage.getItem('userType'),
			num:0,
			allUserTypeData:{},
			initSelect:'按最近时间排序',
			underfine:null,
			allUserData:{},
			initAllUserData:{},
			userId: sessionStorage.getItem('userId') || -1,
			serachName: '', // 搜索框名字
			resetPassword: '', // 重置密码
			editRow: {}, // 修改行
			userId: '',  // 修改Id
			tableData: [], // 表格数据
			dialogTitle: '', // 模态框标题
			addAccountModel: false, // 添加账户模态框
			createAccount: false, // 是否能创建
			peopleNumLength: 0, // 人员名称长度
			peopleName: '', // 人员名称
			accountName: '', // 账号
			department: '', // 部门
			profession: '',  // 职位
			pageCount:0 , // 总页数
			Page:1, // 当前页
			total: 0, // 总数
		}
	},
	methods: {
		delUser(id){
			this.$confirm('确定要删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.enableDelUser(id);
      }).catch(() => {
			});
		},
		addUploadStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 :1;
			let info = (status == 1) ? '是否禁止该用户上传图像':'是否允许该用户上传图像';
			type = this.replacepos(type,1,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		delUploadStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 :1;
			let info = (status == 1) ? '是否禁止该用户删除图像':'是否允许该用户删除图像';
			type = this.replacepos(type,2,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		addMarkStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 : 1;
			let info = (status == 1) ? '是否禁止该用户新添标注':'是否允许该用户新添标注';
			type = this.replacepos(type,3,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		editMarkStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 : 1;
			let info = (status == 1) ? '是否禁止该用户修改标注':'是否允许该用户修改标注';
			type = this.replacepos(type,4,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		delMarkStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 : 1;
			let info = (status == 1) ? '是否禁止该用户删除标注':'是否允许该用户删除标注';
			type = this.replacepos(type,5,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		chatStatus(id,status){
			let type = this.allUserTypeData[id];
			let flag = (status == 1) ? 0 :1;
			let info = (status == 1) ? '是否禁止该用户进行留言':'是否允许该用户进行留言';
			type = this.replacepos(type,6,flag);
			this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.savaUserPower(id,type);
      }).catch(() => {
			});
		},
		savaUserPower(id,type){
			ParamidaPay.ApiCaller.post('index/savaUserPower', {userId:id,userType:type},
				(response) => {
				if (response.errcode == 0) {
						this.$message({
							message: '修改成功',
							type: 'success',
						});
						this.getAllUser();
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
		enableDelUser(id){
			ParamidaPay.ApiCaller.post('index/delOneUser', {userId:id},
				(response) => {
				if (response.errcode == 0) {
						this.$message({
							message: '删除成功',
							type: 'success',
						});
						this.getAllUser();
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
		//替换
		replacepos(strObj, pos, replacetext){
   	 var str = strObj.substr(0, pos-1) + replacetext + strObj.substring(pos, strObj.length);
		 return str;
		},
		// 搜索
		serach() {
			if(this.serachName == ''){
				this.getAllUser()
			}else{
				let searchId = 0;
				let tmpData = this.initAllUserData;
				for(let index in this.allUserData){
					if(this.serachName == this.allUserData[index]){
						searchId = index;
						break;	
					}
				}
				let tmpList = [];
				for(let index in tmpData){
					if(tmpData[index]['id'] == searchId){
						tmpList.push(tmpData[index]);
					}
				}
				this.tableData = tmpList;
				this.num = tmpData.length;
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
        this.initSelect = '按最近时间排序';
        this.tableData = this.ascNum(this.tableData,'time');
      } else if (e == -1) {
        this.initSelect = '最先时间排序';
        this.tableData = this.descNum(this.tableData,'time');
      }
    },
		

		getAllUser() {
			ParamidaPay.ApiCaller.post('index/showAllUserSurper', {id:this.userId},
				(response) => {
				if (response.errcode == 0) {
				this.tableData = response.data;
				this.initAllUserData = response.data;

				this.num = response.data.length;
				let userData ={},userTypeData = {};
				for(let index in response.data){
					userData[response.data[index].id] = response.data[index].user_name;
					userTypeData[response.data[index].id] = response.data[index].type;
				}
				this.allUserData = userData;
				this.allUserTypeData = userTypeData;
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
		this.userId = sessionStorage.getItem('userId') || -1;
		this.getAllUser()
	},
	updated() {
		this.peopleNumLength = this.peopleName.length
		if(this.peopleName == '' || this.accountName == '' || this.department == ''
		|| this.profession == ''
		) {
			this.createAccount = true
		} else {
			this.createAccount = false
		}
	},
	components: {
		Nav,
		Head,
		Bottom,
	}
}
</script>

<style scoped>
	.enable_icon{
		cursor: pointer;
		position: absolute;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background-color: greenyellow;
	}
	.disable_icon{
		cursor: pointer;
		position: absolute;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background-color:red;
	}
</style>

