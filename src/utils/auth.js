// 封装'token和用户信息'工具模块

const TOKEN_KEY = 'vue-spa-admin-token';
const USER_KEY =  'vue-spa-admin-user';

// 获取token
export function getToken(){
    return localStorage.getItem(TOKEN_KEY);
}
// 保存token
export function setToken(token){
    return localStorage.setItem(TOKEN_KEY, token);
}

// 获取用户信息
export function getUser(){
    return JSON.parse(localStorage.getItem(USER_KEY));
}
// 保存用户信息
export function setUser(user){
    return localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// 移除本地信息
export function removeInfo(){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}