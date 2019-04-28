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
						<h1 class='tittle'>账号管理</h1>
						<Divider />
						<!-- 内容区 -->
						<div class="accountContent">
							<div class="accounttitle">
								<p>共{{ total }}个账号</p>
								<div style="display:flex;margin-right:100px;">
									<!-- 搜索框 -->
									<div class="serach">
										<Icon @click="serach" type="ios-search-outline" size="32" style="margin-top:4px;"/>
										<el-input v-model="serachName" style="width:160px;margin-left:5px;" placeholder="搜索"></el-input>
									</div>
									<Icon @click="addAccount" type="ios-add-circle-outline" size="31" style="margin:5px 30px;cursor:pointer;"/>
								</div>
							</div>
							<!-- 账号 -->
							<el-table
								:data="tableData"
								border
								style="width:100%;margin:10px 20px;">
								<!-- 名称 -->
								<el-table-column
									label="名称"
									align="center"
									header-align="center"
									width="180">
									<template slot-scope="scope">
										{{ scope.row.nickName }}
									</template>
								</el-table-column>
								<!-- 登陆账号 -->
								<el-table-column
									label="登录账号"
									align="center"
									header-align="center"
									width="160">
									<template slot-scope="scope">
										{{ scope.row.userName }}
									</template>
								</el-table-column>
								<!-- 部门 -->
								<el-table-column
									label="部门"
									align="center"
									header-align="center"
									width="160">
									<template slot-scope="scope">
										{{ scope.row.department }}
									</template>
								</el-table-column>
								<!-- 职位 -->
								<el-table-column
									label="职位"
									align="center"
									header-align="center"
									width="160">
									<template slot-scope="scope">
										{{ scope.row.positionName }}
									</template>
								</el-table-column>
								<!-- 创建时间 -->
								<el-table-column
									label="创建时间"
									align="center"
									header-align="center"
									width="180">
									<template slot-scope="scope">
										{{ scope.row.createTime }}
									</template>
								</el-table-column>
								<!-- 更新时间 -->
								<el-table-column
									label="更新时间"
									align="center"
									header-align="center"
									width="180">
									<template slot-scope="scope">
										{{ scope.row.updateTime }}
									</template>
								</el-table-column>
								<!-- 状态 -->
								<el-table-column
									label="状态"
									align="center"
									header-align="center"
									width="180">
									<template slot-scope="scope">
										<span v-show="scope.row.status == 1" style="color: green;">启用</span>
										<span v-show="scope.row.status == 0" style="color: red;">停用</span>
									</template>
								</el-table-column>
								<!-- 操作 -->
								<el-table-column
									label="操作"
									align="center"
									header-align="center"
									width="300">
									<template slot-scope="scope">
										<Icon @click="editAccountInfo(scope.row)" style="cursor:pointer;" type="ios-create-outline" size="30"/>
										<Icon v-show="scope.row.status == 1" @click="offLine(scope.row)" style="margin-left:5px;cursor:pointer;" type="ios-cloud-download-outline" size="30"/>
										<Icon v-show="scope.row.status == 0" @click="onLine(scope.row)" type="ios-cloud-upload-outline" style="margin-left:5px;cursor:pointer;" size="30"/>
										<Icon @click="reset(scope.row)" style="margin-left:5px;cursor:pointer;" type="ios-lock-outline" size="30"/>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</Content>
				</Layout>
			</Layout>
			<Footer class="layout-footer-center" style="background:#fff;text-align:center">建设银行智能私教管理后台 2019 &copy; 脑穿越</Footer>
			<div class="accountPage">
			<el-pagination
				background
				:page-size="10"
				:page-count="pageCount"
				@current-change="currentPageChange"
				layout="prev, pager, next">
			</el-pagination>
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

export default {
	data() {
		return {
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
				console.log(response)
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
		// 搜索
		serach() {
			ParamidaPay.ApiCaller.get('/systemUser/systemUsers',	{
				searchField: this.serachName,
				pageNo: this.Page,
				pageSize: 10
			}, response => {
				console.log(response)
				if(response.errcode == 0) {
					this.tableData = response.body.rows	
					this.pageCount = response.body.pageCount
					this.total = response.body.total
				}
			})
		},
	},
	mounted() {
		this.getAllAccount()
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

