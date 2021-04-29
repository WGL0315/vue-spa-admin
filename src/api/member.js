// 会员管理api
//导入axios对象。request是一个封装好的Axios对象,可发送异步请求
import request from '@/utils/request';

export default {
    // 获取会员列表
    getList(){
        return request({
            url: '/member/list',
            method: 'get'
        })
    },

    //分页查询
    // 前端页面提交的数据：page当前页码，size每页显示条数，searchCondition条件
    // 后台要通过page和size统计本次请求响应的数据
    search(page, size, searchCondition){
        return request({
            url: `/member/list/search/${page}/${size}`, //反单引号``
            method: 'post',
            data: searchCondition
        });
    },

    // 新增会员。member是前端页面提交的数据
    add(member){
        return request({
            url: '/member',
            method: 'post',
            data: member
        });
    },

    // 查询会员ID对应的数据
    getById(id){
        return request({
            url: `/member/${id}`,
            method: 'get'
        });
    },

    // 编辑完成后，更新数据
    update(member){
        return request({
            url: `/member/${member.id}`,
            method: 'put',
            data: member
        });
    },

    // 删除会员ID对应的数据
    deleteById(id){
        return request({
            url: `/member/${id}`, //反单引号``
            method: 'delete', //delete方式提交
        });
    }
}