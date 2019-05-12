import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:'',
    userName:'admin',
    account:'',
    password:''
  },
  mutations: {
    set_token(state, token) {
      state.token = token
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    set_userName(state,userName){
      state.userName = userName
      sessionStorage.userName = userName
    },
    set_Account(state,password){
    //  state.account = account
      state.password = password
      //sessionStorage.account = account
      sessionStorage.password = password
    }
  },
  actions: {

  },
});
