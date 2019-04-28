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
						<h1 class='tittle'>学员成绩表</h1>
						<Divider />
						<!-- 内容区 -->
						<div class="studentGradeContent">
							<div class="title">
								<p v-show="showStudentTable">当前共8组，共170名学员</p>
								<div v-show="!showStudentTable">
									<div style="cursor:pointer;" @click="backGroupTable">
										<el-breadcrumb separator-class="el-icon-arrow-left">
											<el-breadcrumb-item>学员成绩表</el-breadcrumb-item>
											<el-breadcrumb-item>XXX组</el-breadcrumb-item>
										</el-breadcrumb>
									</div>
								</div>
								<div style="display:flex;margin-right:100px;">
									<!-- 搜索框 -->
									<div class="serach">
										<Icon type="ios-search-outline" size="32" style="margin-top:4px;"/>
										<el-input style="width:160px;margin-left:5px;" placeholder="搜索"></el-input>
									</div>
									<!-- 切换分组排序状态 -->
									<div v-show="showStudentTable" class="changeSort">
										<Icon type="ios-funnel-outline" size="30" style="margin-top:5px;"/>
											<el-select v-model="sortMethods" class="selectGroup" placeholder="请选择">
											<el-option
												v-for="item in sortStatus"
												:key="item.value"
												:label="item.label"
												:value="item.value">
											</el-option>
										</el-select>
									</div>
								</div>
							</div>
							<!-- 学员成绩表 -->
							<div class="studentTranscript">
								<div class="groupCard" v-show="showStudentTable">
									<!-- 卡片 -->
									<el-card class="Card" v-for="(item, index) in cardList"  :key="index">
										<div class="content" @click="ToSeeStudentScore(index)">
											<p class="groupName">AAA 组</p>
											<Icon type="md-person" size="47" style="margin-top:12px;" />
											<p class="average">20人&nbsp;平均分XXX</p>
										</div>
									</el-card>
								</div>
								<div class="studentTable" v-show="!showStudentTable">
									<el-table></el-table>
								</div>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		<Footer class="layout-footer-center" style="background:#fff;text-align:center">建设银行智能私教管理后台 2019 &copy; 脑穿越</Footer>
		</Layout>
	</div>
</template>

<script>
import Nav from '@/components/Nav.vue' // @ is an alias to /src
import Head from '@/components/Head.vue'
import Bottom from '@/components/Bottom.vue'
import ParamidaPay from "../paramidaPay.js"

require("../viewstyle/studentGrade.scss")

export default {
	data() {
		return {
			showStudentTable: true, // 是否显示学员表
			cardList: [{},{},{},{},{},{},{},{},{},{},{},{}],
			// 排序状态
			sortStatus: [
				{
					value: '创建最早在前',
					label: '创建最早在前'
				},
				{
					value: '创建最晚在前',
					label: '创建最晚在前'
				}
			],
			sortMethods: '创建最早在前'
		}
	},
	methods: {
		// 具体分组查看学生的成绩
		ToSeeStudentScore(index) {
			this.showStudentTable = false
			console.log(index)
		},
		// 返回学员分组表
		backGroupTable() {
			this.showStudentTable = true
		}
	},
	components: {
		Nav,
		Head,
		Bottom,
	}
}
</script>
