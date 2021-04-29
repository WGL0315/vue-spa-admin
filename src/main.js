import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 完整引入ElementUI
import ElementUI from 'element-ui'; //组件库
import 'element-ui/lib/theme-chalk/index.css'; //样式

// 权限拦截。若本地无token,用户信息，则跳转到"登录页"，禁止跳转到“非登录页”
import './permission';

// 使用ElementUI
Vue.use(ElementUI);

// 由环境配置决定是否开启消息提示；true表示开启，false表示不开启
// 开发环境(development)：选择开启，Vue会提供很多警告来方便调试代码；
// 生产环境(production)：选择不开启，警告却没有用，反而会增加应用的体积。
// Vue.config.productionTip = process.env.NODE_ENV==='production';
Vue.config.productionTip = process.env.NODE_ENV==='development';

// console.log("当前环境: ", process.env.NODE_ENV);
// console.log("当前环境的BASE_API: ", process.env.VUE_APP_BASE_API);

new Vue({
  router,
  store, //注册store
  render: h => h(App)
}).$mount('#app')
