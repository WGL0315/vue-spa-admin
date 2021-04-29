// 处理'用户'所有状态属性

import {login, getUserInfo, logout} from '@/api/login';
import {getToken, setToken, getUser, setUser, removeInfo} from '@/utils/auth';

const user = {
    state: {
        // token: null,
        token: getToken(), //getToken()作为token赋初值，解决'刷新页面之后token为null'的问题
        user: getUser(),
    },
    mutations: {
        SET_TOKEN(state, token){
            state.token = token;
            setToken(token);
        },
        SET_USER(state, user){
            state.user = user;
            setUser(user);
        }
    },
    actions: {
        // 登录。获取token
        Login({commit}, form){
            return new Promise(
                (resolve, reject) => {
                    login(form.username.trim(),form.password).then(
                        response => {
                            const resp = response.data;
                            // console.log('Login: ', resp);
                            commit('SET_TOKEN', resp.data.token);
                            resolve(resp);
                        }
                    ).catch(
                        error => {
                            reject(error);
                        }
                    )
                }
            );
        },
        // 通过token,获取用户信息
        GetUserInfo({commit, state}){
            return new Promise(
                (resolve, reject) => {
                    getUserInfo(state.token).then(
                        response => {
                            const resp = response.data;
                            // console.log('GetUserInfo: ', resp);
                            commit('SET_USER', resp.data);
                            resolve(resp); //resp是resolve()返回的数据
                        }
                    ).catch(
                        error => {
                            reject(error); //error是reject()返回的数据
                        }
                    );
                }
            );
        },
        // 退出登录
        Logout({state}){
            return new Promise(
                (resolve, reject) => {
                    logout(state.token).then(
                        response => {
                            const resp = response.data;
                            // console.log('Logout: ', resp);
                            // 清除本地数据
                            removeInfo();
                            state.token = getToken(); //给token赋最新的值
                            state.user = getUser(); //给user赋最新的值
                            resolve(resp);
                        }
                    ).catch(
                        error => {
                            reject(error);
                        }
                    );
                }
            );
        }
    }
}
export default user