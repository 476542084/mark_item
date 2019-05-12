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
						<h1 class='tittle'>消息管理</h1>
						<p>一共{{ num }}条消息</p>

						<Divider />
						<!-- 内容区 -->
						<div class="accountContent">
							<div class="accounttitle" style="    justify-content: flex-end;">
								<div style="display:flex;">
									<!-- 搜索框 -->
									<div class="serach" style="    margin-right: 20px;">
										<Icon @click="serach" type="ios-search-outline" size="32" style="margin-top:4px;cursor: pointer;"/>
										<el-input v-model="serachName" style="width:160px;margin-left:5px;" placeholder="查找用户"></el-input>
									</div>
									<!-- <Icon @click="addAccount" type="ios-add-circle-outline" size="31" style="margin:5px 30px;cursor:pointer;"/> -->
									<div class="partialMatch_head_right">
											<el-dropdown @command="handleCommand">
											  <span class="el-dropdown-link">
												<Icon type="ios-options" size="24"></Icon>{{initSelect}}
											  </span>
											  <el-dropdown-menu slot="dropdown">
												<el-dropdown-item command="0">按时间顺序排序</el-dropdown-item>
												<el-dropdown-item command="-1">按时间倒序排序</el-dropdown-item>
											  </el-dropdown-menu>
											</el-dropdown>
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
										{{ allUserData[scope.row.user_id] }}
									</template>
								</el-table-column>
								<el-table-column
									label="行为"
									align="center"
									header-align="center"
									width="200">
									<template slot-scope="scope">
										{{ scope.row.mapdata == underfine ? '回复了一条信息':'添加了一个标注' }}
									</template>
								</el-table-column>
								<el-table-column
									label="目标"
									align="center"
									header-align="center"
									width="200">
									<template slot-scope="scope">
										{{ scope.row.mapdata != underfine ? '图像编号:' + scope.row.img_id : '标注编号:' + scope.row.mark_id }}
									</template>
								</el-table-column>
								<el-table-column
									label="内容"
									align="center"
									header-align="center"
									width="">
									<template slot-scope="scope">
										{{ scope.row.mapdata == underfine ? scope.row.content: '标注地址:' + scope.row.mapdata }}
									</template>
								</el-table-column>
								<el-table-column
									label="时间"
									align="center"
									header-align="center"
									width="300">
									<template slot-scope="scope">
										{{ scope.row.time }}
									</template>
								</el-table-column>
							</el-table>
						</div>
					</Content>
				</Layout>
			</Layout>
			<Footer class="layout-footer-center" style="background:#fff;text-align:center">图像标注在线协作系统 2019 &copy; 20150390237 黄志谋</Footer>
			<div class="accountPage">
			<!-- <el-pagination
				background
				:page-size="5"
				:page-count="pageCount"
				@current-change="currentPageChange"
				layout="prev, pager, next">
			</el-pagination> -->
		</div>
		</Layout>
		<!-- 新增账号模态框 -->
		<el-dialog
			:title="dialogTitle"
			:close-on-click-modal="false"
			:visible.sync="addAccountModel"
			width="500px"
			>
			<el-form label-position="left" label-width="70px">
				<el-form-item label="人员名称">
					<el-input v-model="peopleName" :maxlength="10" @input="getNameNum" style="width:250px"></el-input>
					<span style="margin-left:30px; font-size:16px;">({{ peopleNumLength }}/10)</span>
				</el-form-item>
				<el-form-item label="账号">
					<el-input v-model="accountName" style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="部门">
					<el-input v-model="department" style="width:250px"></el-input>
				</el-form-item>
				<el-form-item label="职位">
					<el-input v-model="profession" style="width:250px"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addAccountModel = false">取 消</el-button>
				<el-button v-show="dialogTitle == '新增账号'" :disabled="createAccount" type="primary" @click="confirmAddAccount">创 建</el-button>
				<el-button v-show="dialogTitle == '账号编辑'" :disabled="createAccount" type="primary" @click="saveAccount">保 存</el-button>
  		</span> 
		</el-dialog>
	</div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"

require("../viewstyle/Account.scss")
require("../viewstyle/partialMatch.scss")

export default {
	data() {
		return {
			num:0,
			initSelect:'按时间顺序排序',
			underfine:null,
			allUserData:{},
			userId: sessionStorage.getItem('userId') || -1,
			serachName: '', // 搜索框名字
			resetPassword: '', // 重置密码
			editRow: {}, // 修改行
			userId: '',  // 修改Id
			tableData: [], // 表格数据
			initTableData: [], // 表格数据
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
		// 搜索
		serach() {
			// this.getContent();
			if(this.serachName == ''){
				this.getContent()
			}else{
				let tmpData = this.initTableData;
				let searchId = 0;
				for(let index in this.allUserData){
					if(this.serachName == this.allUserData[index]){
						searchId = index;
						break;
					}
				}
				let tmpList = [];
				for(let index in tmpData){
					if(tmpData[index]['user_id'] == searchId){
						tmpList.push(tmpData[index]);
					}
				}
				this.tableData = tmpList;
				this.num = tmpList.length;
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
        this.initSelect = '按时间顺序排序';
        this.tableData = this.ascNum(this.tableData,'time');
      } else if (e == -1) {
        this.initSelect = '按时间倒序排序';
        this.tableData = this.descNum(this.tableData,'time');
      }
    },
		getContent() {
		ParamidaPay.ApiCaller.post('index/showAllMessage', { id: this.userId },
			(response) => {
			if (response.errcode == 0) {
				//
				let chatList = [],markList = [],tableList = [];
				for(let chatIndex in response.chatList){
					for(let chatIndexSecond in response.chatList[chatIndex]){
						chatList.push(response.chatList[chatIndex][chatIndexSecond]);
					}
				}
				for(let markIndex in response.markList){
					for(let markIndexSecond in response.markList[markIndex]){
						markList.push(response.markList[markIndex][markIndexSecond]);
					}
				}
				this.tableData = chatList.concat(markList);
				this.initTableData = chatList.concat(markList);
				this.num = this.tableData.length;

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

		getAllUser() {
		ParamidaPay.ApiCaller.post('index/showAllUser', {},
			(response) => {
			if (response.errcode == 0) {
			// this.allUserData = response.data;
			let userData ={};
			for(let index in response.data){
				userData[response.data[index].id] = response.data[index].user_name;
			}
			this.allUserData = userData;
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
	
		// 初始化数据
		initData() {
			this.peopleName = ''
			this.accountName = ''
			this.department = ''
			this.profession = ''
		},
		// 日期转化
    formatDateTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      var minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      var second = date.getSeconds();
      second = second < 10 ? ('0' + minute) : second;
      return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    },
		// 点击显示添加账户模态框
		addAccount() {
			this.initData()
			this.dialogTitle = '新增账号'
			this.addAccountModel = true
		},
		// 获取输入人员名称长度
		getNameNum(value) {
			this.peopleNumLength = value.length
		},
		//  重置密码
		reset(row) {
			ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
				userId: row.userId,
				isReset: 1
			}, response => {
				console.log(response)
				if(response.errcode == 0) {	
					this.resetPassword = response.body
					this.$alert('密码已重置为初始密码: ' + this.resetPassword, '密码已重置', {
						confirmButtonText: '确定',
						callback: action => {
						}
        	});
				}
			})
		},
		// 获取所有账户
		getAllAccount() {
			ParamidaPay.ApiCaller.get('/systemUser/systemUsers', {
				pageNo: this.Page,
				pageSize:10
			}, response => {
				if(response.errcode == 0) {
					this.tableData = response.body.rows
					this.pageCount = response.body.pageCount
					this.total = response.body.total
				}
			})
		},
		// 当前页的改变
		currentPageChange(Page) {
			this.Page = Page
			if(this.serachName == '') {
				this.getAllAccount()
			}
			else {
				this.serach()
			}
		},
		// 确定添加账户
		confirmAddAccount() {
			let addItem = {}
			addItem.nickName = this.accountName
			addItem.userName = this.peopleName
			addItem.department = this.department
			addItem.positionName = this.profession
			addItem.createTime = this.formatDateTime(new Date())
			addItem.updateTime = this.formatDateTime(new Date())
			addItem.status = 0
			ParamidaPay.ApiCaller.post('/systemUser/systemUser',{
				userName: this.peopleName,
				nickName: this.accountName,
				department: this.department,
				positionName: this.profession
			}, response => {
				console.log(response)
				if(response.errcode == 0) {
					if(this.tableData.length <= 9) {
						this.tableData.push(addItem)
					} else {
						this.pageCount++;
					}
					this.addAccountModel = false
				}
			})
		},
		// 编辑账户信息
		editAccountInfo(row) {
			console.log(row)
			this.editRow = row
			this.dialogTitle = '账号编辑'
			this.addAccountModel = true
			this.peopleName = row.nickName
			this.accountName=  row.userName
			this.department = row.department
			this.profession = row.positionName
			this.userId = row.userId
		},
		// 保存账户
		saveAccount() {
			ParamidaPay.ApiCaller.put('/systemUser/systemUser',{
				userId: this.userId,
				userName: this.accountName,
				nickName: this.peopleName,
				department: this.department,
				positionName: this.profession
			}, response => {
				console.log(response)
				if(response.errcode == 0) {
					this.tableData.forEach((item, index) => {
						if(item == this.editRow) {
							item.nickName = this.peopleName
							item.userName = this.accountName
							item.department = this.department
							item.positionName = this.profession
						}
					})
					this.addAccountModel = false
				}
			})
		},
		// 下线
		offLine(row) {
			ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
				userId: row.userId,
				status: 0
			}, response => {
				console.log(response)
				if(response.errcode == 0) {
					this.tableData.forEach((item, index) => {
						if(item == row) {
							item.status = 0
						}
					})
				}
			})
		},
		// 上线
		onLine(row) {
			ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
				userId: row.userId,
				status: 1
			}, response => {
				console.log(response)
				if(response.errcode == 0) {
					this.tableData.forEach((item, index) => {
						if(item == row) {
							item.status = 1
						}
					})
				}
			})
		},
		
	},
	mounted() {
		this.userId = sessionStorage.getItem('userId') || -1;
		this.getAllUser()
		this.getContent()
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
</style>

