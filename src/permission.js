/*
    权限校验：
    通过router路由前置钩子函数beforeEach();
    在跳转路由前,进行拦截,根据'本地是否有token和用户信息'判断是否已经登录;
    如果已登录，则进行路由跳转；否则，回到'登录页'。
*/
import router from './router';
// import {getUserInfo} from '@/api/login';
// 导入store,改用vuex方式实现
import store from '@/store';

/*
    前置路由钩子函数beforeEach()
    to: 即将要进入的目标路由对象
    from: 当前导航正要离开的路由对象
    next: 调用该方法，进入目标路由
    注意：每次路由跳转时都会触发这个钩子函数
*/
router.beforeEach(
    (to, from, next) => {
        // 获取本地的token
        // const token = localStorage.getItem('vue-spa-admin-token');
        const token = store.state.user.token; //改用vuex方式实现

        // 若本地token为空，说明没有登录过，本地没有用户信息
        if(!token){
            if(to.path === '/login'){ //若即将要进入的目标路由对象[是]'登录页'
                next(); //进入该目标路由
            }else { //若即将要进入的目标路由对象[不是]'登录页'
                next({ //跳转到'登录页'
                    path: '/login'
                });
            }
        }else { //若本地token不为空，说明登录过，本地有用户信息(除非手动清掉)
            if(to.path === '/login'){ //若即将要进入的目标路由对象[是]'登录页'
                next(); //进入该目标路由
            }else { //若即将要进入的目标路由对象[不是]'登录页'
                // 获取本地用户信息
                // const userInfo = localStorage.getItem('vue-spa-admin-user');
                const userInfo = store.state.user.user; //改用vuex方式实现

                // console.log('登录前vuex的user: ', userInfo);
                if(userInfo){ //若本地用户信息不为空
                    next(); //进入该目标路由
                }else{ //若本地用户信息为空
                    // 调用接口，获取用户信息
                    // getUserInfo(
                    //     token
                    // ).then(
                    //     response => {
                    //         const resp = response.data;
                    //         console.log("用户信息：", resp);
                    //         if(resp.flag){
                    //             // 已获取到用户信息，保存到本地
                    //             localStorage.setItem('vue-spa-admin-user', JSON.stringify(resp.data));
                    //             next(); //进入该目标路由
                    //         }else{
                    //             // 未获到用户信息，重新登录
                    //             next({ //跳转到'登录页'
                    //                 path: '/login'
                    //             });
                    //         }
                    //     }
                    // ).catch(
                    //     error => {
                    //         console.log(error);
                    //     }
                    // );

                    // 改用vuex方式实现上述功能
                    store.dispatch('GetUserInfo').then(
                        response => {
                            // console.log("登录后vuex的user：", response.data);
                            if(response.flag){
                                next(); //进入该目标路由
                            }else{
                                // 未获到用户信息，重新登录
                                next({ //跳转到'登录页'
                                    path: '/login' 
                                });
                            }
                        }
                    ).catch(
                        error => {
                            console.log(error);
                        }
                    );
                }
            }
        }
    }
);