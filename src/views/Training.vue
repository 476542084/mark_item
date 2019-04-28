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
						<el-row :gutter="10">
							<h1 class='tittle'>培训数据</h1>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
								<el-Input style="margin-bottom:20px;" placeholder="请输入工号或者名称" v-model="search"></el-Input>
							</el-col>
							<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="8" style="margin-bottom:20px;">
								<el-button size="mini" class="btnOne" round  @click='handleSearch()'>查询</el-button>
					
								<el-button size="mini" round type="primary" @click='handleDown()'>下载</el-button>
							</el-col>
						</el-row>
						<el-table :data="tableData" border style="width: 100%">
							<el-table-column :prop="item.key"  v-for="item in levelName" :label="item.name"></el-table-column>
						</el-table>
						<div class="pagination">
							<el-pagination
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
								:current-page="currentPage"
								layout="total, sizes, prev, pager, next, jumper"
								:total="total">
							</el-pagination>
						</div>
                    </Content>
                </Layout>
            </Layout>
				<Footer class="layout-footer-center" style="background:#fff;text-align:center">中国大地保险 2018 &copy; 脑穿越</Footer>
        </Layout>
    </div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"

require("@/assets/min.scss")

export default {
	data() {
		return {
			currentPage:1,
			pageSize:10,
			search:'',
			tableData: [],
			colName:[],
			total:'',
			levelName:[],
			getLevelInfoList:[],
			token:this.$store.state.token
		}
	},
	created(){
		ParamidaPay.ApiCaller.post("/level/getLevelInfoList",{token:this.token}, response => {
			if(response.errcode == 0) {
				this.getLevelInfoList = response.body
				this.total = response.body.total
			} else {
					this.$message({
						message:response.errmsg,
						type: 'error'
					});
				}
			},response => {
					this.$message({
						message:response.errmsg,
						type: 'error'
					});
			}),
		ParamidaPay.ApiCaller.post("/user/getUserTrainData",{token:this.token}, response => {
		if(response.errcode == 0) {
			this.tableData = response.body.rows
			//格式化时间，把后台秒转化为分钟
				if(this.tableData.length>0){
					this.tableData.forEach(item => {
						item.mobileTime = (item.mobileTime/60).toFixed(1)
						item.totalTime = (item.totalTime/60).toFixed(1)
						item.vrTime = (item.vrTime/60).toFixed(1)
					})
				}
			this.levelName =[
				{
					key:'userId',
					name:'工号'
				},
				{
					key:'region',
					name:'地区'
				},
				{
					key:'organId',
					name:'机构'
				},
				{
					key:'userName',
					name:'姓名'
				},
				{
					key:'totalTime',
					name:'总时长(分)'
				},
				{
					key:'vrTime',
					name:'VR时长(分)'
				},
				{
					key:'mobileTime',
					name:'手机时长(分)'
				},
				{
					key:'sceneScore1',
					name:'零售服务场景总分'
				},
				{
					key:'sceneScore2',
					name:'餐饮娱乐场景总分'
				},
				{
					key:'averageNum',
					name:'关卡平均通关次数'
				},
				{
					key:'averageScore',
					name:'关卡平均得分'
				},
			]
			this.getLevelInfoList.map((item)=>{
				// var obj = {key:'levelMap['+ item.code +'].score', name:item.name +"得分"};
				// this.levelName.push(obj)
				var obj = {key:'levelMap['+ item.code +'].count', name:item.name +"次数"};
				this.levelName.push(obj)
			})

			this.total = response.body.total
		} else {
				this.$message({
					message:response.errmsg,
					type: 'error'
				});
			}
		},response => {
				this.$message({
					message:response.errmsg,
					type: 'error'
				});
		})		
	},
	methods: {
		 	handleSizeChange(val) {
				 this.pageSize = val
				 this.handleDateSearch()
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val
				this.handleDateSearch()
			},
			handleSearch(type){
				this.currentPage =1
				this.handleDateSearch()
			},
			handleDateSearch(){
				ParamidaPay.ApiCaller.post("/user/getUserTrainData",{token:this.token,search:this.search,pageNo:this.currentPage,pageSize:this.pageSize}, response => {
					if(response.errcode == 0) {
						this.tableData = response.body.rows
						this.total = response.body.total
					} else {
							this.$message({
								message:response.errmsg,
								type: 'error'
							});
						}
					},response => {
							this.$message({
								message:response.errmsg,
								type: 'error'
							});
					})
			},
			handleDown(){
				ParamidaPay.ApiCaller.down("/user/downloadTrainData",{token:this.token,search:this.search,pageNo:this.currentPage,pageSize:this.pageSize})
			}
    },
	components: {
		Nav,
		Head,
		Bottom,
	}
}
</script>
