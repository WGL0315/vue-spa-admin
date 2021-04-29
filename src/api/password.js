// 密码管理api
//导入axios对象。request是一个封装好的Axios对象,可发送异步请求
import request from '@/utils/request';

export default {
    // 校验密码是否正确
    checkPassword(userId, password){
        return request({
            url: '/user/password',
            method: 'post',
            data: {
                userId,
                password
            }
        });
    },

    // 更改密码
    updatePassword(userId, password){
        return request({
            url: 'user/password',
            method: 'put',
            data: {
                userId,
                password
            }
        });
    }
}