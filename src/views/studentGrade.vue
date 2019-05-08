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
							<el-image
							style="width: 100px; height: 100px"
							:src="url"
							></el-image>
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

require('../viewstyle/studentGrade.scss');

export default {
  data() {
    return {
      url: `${Config.head_url}476542084.png`,
    };
  },
  methods: {
    // 具体分组查看学生的成绩
    ToSeeStudentScore(index) {
      this.showStudentTable = false;
      console.log(index);
    },
    // 返回学员分组表
    backGroupTable() {
      this.showStudentTable = true;
    },
  },
  components: {
    Nav,
    Head,
    Bottom,
  },
};
</script>
