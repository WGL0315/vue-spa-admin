//导入axios对象。request是一个封装好的Axios对象,可发送异步请求
import request from '@/utils/request';

// 注意：导出的是普通成员函数
// 登录
export function login(username, password){
    return request({
        url: '/user/login',
        method: 'post',
        data: { //data用于接收接口返回的数据
            username,
            password
        }
    });
}

// 获取用户信息
export function getUserInfo(token){
    return request({
        url: `/user/info/${token}`, //注意：是反单引号``
        method: 'get'
    });
}

// 退出系统
export function logout(token){
    return request({
        url: '/user/logout',
        method: 'post',
        data: { //提交参数
            token
        }
    });
}