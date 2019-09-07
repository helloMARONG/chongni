// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store.js'
import MuseUI, { Breadcrumbs } from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './assets/css/main.css'; //引入全局样式
import Toast from 'muse-ui-toast'; // 消息提示
import VueClipboard from 'vue-clipboard2' //复制粘贴复制插件
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
//import vueResource from 'vue-resource'
// Vue.use(vueResource) //
// Vue.http.options.emulateJSON = true; //

require('es6-promise').polyfill()
Es6Promise.polyfill()

axios.defaults.baseURL = 'https://api01.chongni.app';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//const token = localStorage.getItem("accessToken") || '';
//console.log('获取时token' + token)
//axios.defaults.headers.Authorization = token;

axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('accessToken')) {
            config.headers.Authorization = localStorage.getItem('accessToken');
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });
//localStorage.removeItem('accessToken')

Vue.prototype.$http = axios;

Vue.use(MuseUI)
Vue.use(Toast, {
    position: 'top-start', // 弹出的位置
    time: 2500, // 显示的时长
    closeIcon: 'close', // 关闭的图标
    close: false, // 是否显示关闭按钮
    successIcon: '', // 成功信息图标
    infoIcon: 'info', // 信息信息图标
    warningIcon: 'priority_high', // 提醒信息图标
    errorIcon: 'warning' // 错误信息图标
})
Vue.use(VueClipboard)

Vue.config.productionTip = false

//路由全局守卫
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem("accessToken") ? true : false;
    // 如果有token，或在其他不需要token的页面
    if (to.path === '/Login' || isLogin || to.path === '/Register' || to.path === '/Forget' || to.path === '/Guide') {
        next()
    } else {
        next("/Login")
    }
})
router.afterEach((to, form, next) => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
})

// 配置html plus 环境
document.addEventListener('plusready', function() {
    plus.navigator.setStatusBarBackground('#FFFFFF');
    plus.navigator.setStatusBarStyle('light');
    // store.state.topHeight = plus.navigator.getStatusbarHeight()
    // 监听返回按键
    let now = false;
    let time = null;
    plus.key.addEventListener('backbutton', function() {
        let canQuit = {
            '/Index': true,
            '/Login': true,
            '/Market': true,
            '/MyCenter': true,
        }
        let pathUrl = vueInstance.$route.path;
        if (canQuit[pathUrl]) {
            time = null;
            if (now) {
                now = false;
                plus.runtime.quit();
            } else {
                now = true;
                plus.nativeUI.toast("再按一次退出应用", { duration: 'short' });
                time = setTimeout(() => {
                    now = false;
                }, 1000);
            }
            // 如果是内页则执行路由返回操作
        } else {
            router.back();
        }
    })
})

// 请求拦截器
// axios.interceptors.request.use( 
//   config => {
//     store.dispatch('showloader');
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )
// 响应拦截器 
axios.interceptors.response.use(
        response => {
            store.dispatch('hideloader');
            const res = response.data;
            // console.log(res);
            switch (res.status) {
                case 997: // 账号冻结
                    router.push("/Login");
                    Toast.message(res.msg);
                    break;
                case 998: // 账号不存在
                    localStorage.clear();
                    router.push("/Login");
                    Toast.message(res.msg);
                    break;
                case 999: // 登陆过期
                    localStorage.clear();
                    router.push("/Login");
                    Toast.message(res.msg);
                    break;
                case 402: // 账号在其他设备登陆
                    router.push("/Login");
                    Toast.message(res.msg);
                    break;
            }
            return response;
        },
        error => {
            store.dispatch('hideloader');
            Toast.message("Network Error！");
            return Promise.reject(error);
        }
    )
    // 全局header公共组件
import AppHeader from './components/AppHeader'
Vue.component('app-header', AppHeader)
    /* eslint-disable no-new */
let vueInstance = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
})