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
            <!--<h1 class='tittle'>课程库</h1>-->
            <div class="courseLibrary_head">
              <div class="courseLibrary_head_left">
                <span>课程库'<'创建新课程</span>
              </div>
              <div class="courseLibrary_head_right">
                <span class="courseLibrary_head_right_add">
                  确认创建
                </span>
              </div>
            </div>

            <div class="courseLibrary_content">
              <div class="courseLibrary_content_head">
                <div class="demo-input-suffix">
                  课程名称
                  <el-input></el-input>
                  <span>（3/10）</span>
                </div>
                <div class="demo-input-suffix" style="margin: 0 35px;">
                  课程备注
                  <el-input></el-input>
                  <span>（3/10）</span>
                </div>
              </div>
              <p class="courseLibraryForm_content_title">
                <span >正文*</span>
                <span>(280/300)</span>
                <span class="courseLibraryForm_content_span">核心内容*</span>
                <span>(50/180)</span>
                <span class="courseLibraryForm_content_span">考点个数*</span>
                <span>(2/10)</span>
              </p>

              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="grid-content">
                    <span class="courseLibraryForm_content_round">A</span>
                    <textarea name="" id=""class="courseLibraryForm_content_textarea"></textarea>
                    <el-button class="courseLibrary_content_button">
                      确认
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content">
                    <span class="courseLibraryForm_content_round">B</span>
                    <textarea name="" id=""class="courseLibraryForm_content_textarea"></textarea>
                  </div>
                    <div style="text-align: center">
                      <el-button class="courseLibrary_content_button">
                        核心内容标记
                      </el-button>
                      <el-button class="courseLibrary_content_button">
                        考点标记
                      </el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content">
                    <span class="courseLibraryForm_content_round">C</span>
                    <textarea name="" id=""class="courseLibraryForm_content_textarea"></textarea>
                  </div>
                </el-col>
              </el-row>

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

  require("../viewstyle/courseLibrary.scss")
  export default {
    name: 'courseLibrary',
    components: {
      Nav,
      Head,
      Bottom,
    },
    data() {
      return {
        courseLibraryData: [
          {
            'name': '张三',
            'account': '3',
            'remark': '无',
            'createTime': '2019.5.20.09:33',
            'createUser': 'admin',
            'editTime': '2019.5.20.09:33',
            'releaseUser': 'xiexie'
          }, {
            'name': '张三',
            'account': '3',
            'remark': '无',
            'createTime': '2019.5.20.09:33',
            'createUser': 'admin',
            'editTime': '2019.5.20.09:33',
            'releaseUser': 'xiexie'
          }, {
            'name': '张三',
            'account': '3',
            'remark': '无',
            'createTime': '2019.5.20.09:33',
            'createUser': 'admin',
            'editTime': '2019.5.20.09:33',
            'releaseUser': 'xiexie'
          }, {
            'name': '张三',
            'account': '3',
            'remark': '无',
            'createTime': '2019.5.20.09:33',
            'createUser': 'admin',
            'editTime': '2019.5.20.09:33',
            'releaseUser': 'xiexie'
          }
        ],
        searchText: '',
        initSelect: '最后修改在线'
      }
    },
    created() {
    },
    methods: {
      searchcourseLibrary() {

      },
      selectItem(value) {

      },
      handleEdit(index, scope) {
        console.log('index', index);
        console.log('scope', scope);
      }
    }

  }
</script>
