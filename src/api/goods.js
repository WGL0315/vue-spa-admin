// 商品管理api
//导入axios对象。request是一个封装好的Axios对象,可发送异步请求
import request from '@/utils/request';

export default {
    //分页查询
    // 前端页面提交的数据：page当前页码，size每页显示条数，searchCondition条件
    // 后台要通过page和size统计本次请求响应的数据
    search(page, size, searchCondition){
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchCondition
        });
    },

    // 新增商品。goods是前端页面提交的数据
    add(goods){
        return request({
            url: '/goods',
            method: 'post',
            data: goods
        });
    },
    
    // 查询商品ID对应的数据
    getById(id){
        return request({
            url: `/goods/${id}`,
            method: 'get',
        });
    },

    // 编辑完成后，更新商品ID对应的数据
    update(goods){
        return request({
            url: `/goods/${goods.id}`,
            method: 'put',
            data: goods
        });
    },

    // 删除商品ID对应的数据
    deleteById(id){
        return request({
            url: `/goods/${id}`,
            method: 'delete',
        });
    }
}