import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueResource from 'vue-resource';

//Vue.http.headers.common['Authorization'] =store.state.token;
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(iView);
Vue.use(VueResource);

// 页面刷新时，重新赋值token
if (sessionStorage.getItem('token')) {
  store.commit('set_token', sessionStorage.getItem('token'))
}

if (sessionStorage.getItem('userName')) {
  store.commit('set_userName', sessionStorage.getItem('userName'))
}

// if (sessionStorage.getItem('account')) {
//   store.commit('set_Account', sessionStorage.getItem('account'))
// }

if (sessionStorage.getItem('password')) {
  store.commit('set_Account', sessionStorage.getItem('password'))
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
