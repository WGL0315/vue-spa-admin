// 组装模块，并导出store

import Vue from 'vue';
import Vuex from 'vuex';

// 导入modules
import user from './modules/user';

// 使用Vuex插件
Vue.use(Vuex);

// Vuex的核心就是store(是一个对象)。包含项目中大部分的状态值(state,共享的数据属性)
const store = new Vuex.Store({ //注意：V和S都是大写字母
  // 存放状态（即共享的数据属性）
  state: {
  },
  getters: {
  },
  // 突变,改变state状态
  mutations: {
  },
  // 提交mutation，从而间接改变state
  actions: {
  },
  // 模块化store
  modules: {
    user
  }
});
export default store;
// dispatch：异步操作，写法： this.$store.dispatch('mutations方法名',payload)
// commit：同步操作，写法：this.$store.commit('mutations方法名',payload)
// payload是额外传递的参数，可不填
