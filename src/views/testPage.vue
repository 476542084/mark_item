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
							<TestPage></TestPage>
						</div>
					</Content>
				</Layout>
			</Layout>
			<Footer class="layout-footer-center" style="background:#fff;text-align:center">建设银行智能私教管理后台 2019 &copy; 脑穿越</Footer>
			<div class="accountPage">
		</div>
		</Layout>
	</div>
</template>

<script>
import Nav from '@/components/Nav.vue'; // @ is an alias to /src
import Head from '@/components/Head.vue';
import Bottom from '@/components/Bottom.vue';
import ParamidaPay from '../paramidaPay.js';
import TestPage from '@/components/pages/TestPage.vue';


require('../viewstyle/Account.scss');

export default {
  data() {
    return {
      serachName: '', // 搜索框名字
      resetPassword: '', // 重置密码
      editRow: {}, // 修改行
      userId: '', // 修改Id
      tableData: [], // 表格数据
      dialogTitle: '', // 模态框标题
      addAccountModel: false, // 添加账户模态框
      createAccount: false, // 是否能创建
      peopleNumLength: 0, // 人员名称长度
      peopleName: '', // 人员名称
      accountName: '', // 账号
      department: '', // 部门
      profession: '', // 职位
      pageCount: 0, // 总页数
      Page: 1, // 当前页
      total: 0, // 总数
    };
  },
  methods: {
    // 初始化数据
    initData() {
      this.peopleName = '';
      this.accountName = '';
      this.department = '';
      this.profession = '';
    },
    // 日期转化
    formatDateTime(date) {
      const y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? (`0${m}`) : m;
      let d = date.getDate();
      d = d < 10 ? (`0${d}`) : d;
      const h = date.getHours();
      let minute = date.getMinutes();
      minute = minute < 10 ? (`0${minute}`) : minute;
      let second = date.getSeconds();
      second = second < 10 ? (`0${minute}`) : second;
      return `${y}-${m}-${d} ${h}:${minute}:${second}`;
    },
    // 点击显示添加账户模态框
    addAccount() {
      this.initData();
      this.dialogTitle = '新增账号';
      this.addAccountModel = true;
    },
    // 获取输入人员名称长度
    getNameNum(value) {
      this.peopleNumLength = value.length;
    },
    //  重置密码
    reset(row) {
      ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
        userId: row.userId,
        isReset: 1,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.resetPassword = response.body;
          this.$alert(`密码已重置为初始密码: ${this.resetPassword}`, '密码已重置', {
            confirmButtonText: '确定',
            callback: (action) => {
            },
        	});
        }
      });
    },
    // 获取所有账户
    getAllAccount() {
      ParamidaPay.ApiCaller.get('/systemUser/systemUsers', {
        pageNo: this.Page,
        pageSize: 10,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.tableData = response.body.rows;
          this.pageCount = response.body.pageCount;
          this.total = response.body.total;
        }
      });
    },
    // 当前页的改变
    currentPageChange(Page) {
      this.Page = Page;
      if (this.serachName == '') {
        this.getAllAccount();
      }
      else {
        this.serach();
      }
    },
    // 确定添加账户
    confirmAddAccount() {
      const addItem = {};
      addItem.nickName = this.accountName;
      addItem.userName = this.peopleName;
      addItem.department = this.department;
      addItem.positionName = this.profession;
      addItem.createTime = this.formatDateTime(new Date());
      addItem.updateTime = this.formatDateTime(new Date());
      addItem.status = 0;
      ParamidaPay.ApiCaller.post('/systemUser/systemUser', {
        userName: this.peopleName,
        nickName: this.accountName,
        department: this.department,
        positionName: this.profession,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          if (this.tableData.length <= 9) {
            this.tableData.push(addItem);
          } else {
            this.pageCount++;
          }
          this.addAccountModel = false;
        }
      });
    },
    // 编辑账户信息
    editAccountInfo(row) {
      console.log(row);
      this.editRow = row;
      this.dialogTitle = '账号编辑';
      this.addAccountModel = true;
      this.peopleName = row.nickName;
      this.accountName = row.userName;
      this.department = row.department;
      this.profession = row.positionName;
      this.userId = row.userId;
    },
    // 保存账户
    saveAccount() {
      ParamidaPay.ApiCaller.put('/systemUser/systemUser', {
        userId: this.userId,
        userName: this.accountName,
        nickName: this.peopleName,
        department: this.department,
        positionName: this.profession,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.tableData.forEach((item, index) => {
            if (item == this.editRow) {
              item.nickName = this.peopleName;
              item.userName = this.accountName;
              item.department = this.department;
              item.positionName = this.profession;
            }
          });
          this.addAccountModel = false;
        }
      });
    },
    // 下线
    offLine(row) {
      ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
        userId: row.userId,
        status: 0,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.tableData.forEach((item, index) => {
            if (item == row) {
              item.status = 0;
            }
          });
        }
      });
    },
    // 上线
    onLine(row) {
      ParamidaPay.ApiCaller.put('/systemUser/systemUser',	{
        userId: row.userId,
        status: 1,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.tableData.forEach((item, index) => {
            if (item == row) {
              item.status = 1;
            }
          });
        }
      });
    },
    // 搜索
    serach() {
      ParamidaPay.ApiCaller.get('/systemUser/systemUsers',	{
        searchField: this.serachName,
        pageNo: this.Page,
        pageSize: 10,
      }, (response) => {
        console.log(response);
        if (response.errcode == 0) {
          this.tableData = response.body.rows;
          this.pageCount = response.body.pageCount;
          this.total = response.body.total;
        }
      });
    },
  },
  mounted() {
    // this.getAllAccount()
  },
  updated() {
    this.peopleNumLength = this.peopleName.length;
    if (this.peopleName == '' || this.accountName == '' || this.department == ''
		|| this.profession == ''
    ) {
      this.createAccount = true;
    } else {
      this.createAccount = false;
    }
  },
  components: {
    Nav,
    Head,
    Bottom,
    TestPage,
  },
};
</script>

<style scoped>
</style>
