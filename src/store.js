import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    showLoading: false,
  },
  // 相当于computed
  getters: {
    showLoading(state){
      return state.showLoading
    }
  },
  // 方法，改变state状态
  mutations: {
    SHOWLOADING(state){
      state.showLoading = true;
    },
    HIDELOADING(state){
      state.showLoading = false;
    }
  },
  // 提交 mutation
  actions:{
    showloader:({ commit }) => {
      commit('SHOWLOADING')
    },
    hideloader:({ commit }) => {
      commit('HIDELOADING')
    },
  },
})