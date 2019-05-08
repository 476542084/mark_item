import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/login.vue'),
    },
    {
      path: '/logon',
      name: 'logon',
      component: () => import('./views/logon.vue'),
    },
    {
      path: '/userManage',
      name: 'userManage',
      component: () => import('./views/userManage.vue'),
    },
    {
      path: '/friendManage',
      name: 'friendManage',
      component: () => import('./views/friendManage.vue'),
    },
    {
      path: '/imageManage',
      name: 'imageManage',
      component: () => import('./views/imageManage.vue'),
    },
    {
      path: '/Training',
      name: 'Training',
      component: () => import('./views/Training.vue'),
    },
    {
      path: '/Account',
      name: 'Account',
      component: () => import('./views/Account.vue'),
    },
    {
      path: '/courseLibrary',
      name: 'courseLibrary',
      component: () => import('./views/courseLibrary.vue'),
    },
    {
      path: '/courseLibraryForm',
      name: 'courseLibraryForm',
      component: () => import('./views/courseLibraryForm.vue'),
    },
    {
      path: '/courseScore',
      name: 'courseScore',
      component: () => import('./views/courseScore.vue'),
    },
    {
      path: '/partialMatch',
      name: 'partialMatch',
      component: () => import('./views/partialMatch.vue'),
    },
    {
      path: '/studentGrade',
      name: 'studentGrade',
      component: () => import('./views/studentGrade.vue'),
    },
    {
      path: '/studentManage',
      name: 'studentManage',
      component: () => import('./views/studentManage.vue'),
    },
    {
      path: '/studentManageDetail',
      name: 'studentManageDetail',
      component: () => import(/* webpackChunkName: "about" */ './views/studentManageDetail.vue'),
    },
  ],
});

// // 页面刷新时，重新赋值token
// if (sessionStorage.getItem('token')) {
//   this.$store.commit('set_token', sessionStorage.getItem('token'))
// }

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆

//
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(r => r.meta.requireAuth)) {           //这里的requireAuth为路由中定义的 meta:{requireAuth:true}，意思为：该路由添加该字段，表示进入该路由需要登陆的
//     if (store.state.token) {
//       next();
//     }
//     else {
//       next({
//           path: '/login',
//           query: {redirect: to.fullPath}
//         })
//       }
//   }
//   else {
//     next();
//   }
// })
