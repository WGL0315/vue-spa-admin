// 导入axios(是一个基于Promise的HTTP库，可发送异步请求)
import axios from 'axios';

// 实现加载效果和统一异常处理。
// 导入相关ElementUI组件
import { Loading, Message } from 'element-ui';

// 手动创建一个axios对象
const request = axios.create({
    // 根据不同环境设置baseURL,最终发送请求时的URL为："baseURL+发送请求时所写的URL";
    // 比如当baseURL='/dev-api'时,get('/test'),最终发送请求是: "/dev-api/test"
    // baseURL: '/',
    // 根目录下的.env.development文件与.env.production文件中配置了VUE_APP_BASE_API
    baseURL: process.env.VUE_APP_BASE_API, // '/dev-api'
    timeout: 5000, //请求超时。单位为毫秒
});

// 加载数据时打开和关闭动效对象
const loading = {
    loadingInstance: null, //Loading实例
    open: function(){ //打开加载
        // console.log('加载中', this.loadingInstance);
        if(this.loadingInstance === null){ //创建单例，防止切换路由重复加载
            // console.log('创建加载实例');
            this.loadingInstance = Loading.service({
                text: '拼命加载中...',
                target: '.main', //效果显示区域。class="main"的区域
                background: 'rgba(0,0,0,0.5)', //加载背景
            });
        }
    },
    close: function(){ //关闭加载
        if(this.loadingInstance !== null){
            this.loadingInstance.close();
            // console.log('结束加载');
        }
        this.loadingInstance = null; //注销实例。下次再重新创建
    }
};

// 请求拦截器。request.interceptors.request.use();
// 实现加载效果：加载数据时，实现加载中动效，提高用户体验度
request.interceptors.request.use(
    config => { //正常请求。response是服务接口返回的响应数据
        loading.open(); //打开加载效果
        return config
    },
    error => { //出现异常
        loading.close(); //关闭加载效果
        return Promise.reject(error);
    }
);

// 响应拦截器。request.interceptors.response.use();
// 统一异常处理。Message();一般都是再请求后台服务接口时会出现异常，而请求服务接口都是通过axios发送的请求
// 所以可在axios响应拦截器进行统一处理
request.interceptors.response.use(
    response => {
        loading.close(); //关闭加载窗口
        const resp = response.data;
        // 如果后台响应状态码不是2000,说明后台服务有异常，统一可在此处处理
        // 注意：后台接口响应正常时，对应的状态码要与这里设置的'2000'要一致
        if(resp.code !== 2000){
            Message({
                message: resp.message || '系统异常',
                type: 'warning',
                duration: 5*1000 //停留时长，单位：毫秒
            });
        }
        return response;
    },
    error => {
        loading.close(); //关闭加载效果
        // 当请求接口出错时，进行弹出错误提示，如404，500，请求超时
        console.log('response error', error.response.status);
        Message({
            message: error.message,
            type: 'error',
            duration: 5*1000 //停留时长，单位：毫秒
        });
        return Promise.reject(error);
    }
);

export default request; //导出自定义的axios对象。request是一个封装好的Axios对象,可发送异步请求