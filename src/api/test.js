// @代表"/src"
// 导入封装好的Axios对象--request
import request from "@/utils/request";

// 测试1：直接调用get方式发送get请求
request.get('/db.json').then(
    response => {
        console.log("get1请求成功：", response.data);
    }
).catch(
    error => {
        console.log("get1请求失败：", error.message);
    }
);

// const BASE_URL = 'http://localhost:8888';
//const BASE_URL = 'http://localhost:8001'; //测试跨域
// const BASE_URL = '/dev-api'; //解决跨域。vue.config.js已经写了target: 'http: //localhost:8001'
// const BASE_URL = ''; //配置不同环境的常量值。request.js文件中，baseURL已经配好了'/dev-api'

const BASE_URL = 'http://localhost:88888'; //改回初值

// 测试2：使用对象形式传入请求配置，如请求url, 请求方法method, 请求参数param
request({
    url: BASE_URL + '/db.json',
    method: 'get'
}).then(
    response => {
        console.log("get2请求成功：", response.data);
    }
).catch(
    error => {
        console.log("get2请求失败：", error);
    }
);

// 测试3：导出对象方式（最常用）。
// 方法返回值是一个Promise对象,通过该对象调用.then()获取响应数据
export default {
    getList(){
        const req = request({
            url: BASE_URL + '/db.json',
            method: 'get'
        });
        return req;
    }
}