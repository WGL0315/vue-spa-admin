// 供应商管理api
//导入axios对象。request是一个封装好的Axios对象,可发送异步请求
import request from '@/utils/request';

export default {
    // 获取供应商列表
    getList(){
        return request({
            url: 'supplier/list',
            method: 'get'
        });
    },
    
    // 分页查询
    // 前端页面提交的数据：page当前页码，size每页显示条数，searchCondition条件
    // 后台要通过page和size统计本次请求响应的数据
    search(page, size, searchCondition){
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchCondition
        });
    },

    // 新增供应商。supplier是前端页面提交的数据
    add(supplier){
        return request({
            url: '/supplier',
            method: 'post',
            data: supplier
        });
    },

    // 查询供应商ID对应的数据
    getById(id){
        return request({
            url: `/supplier/${id}`, //反单引号``
            method: 'get'
        });
    },

    // 编辑完成后，更新数据
    update(supplier){
        return request({
            url: `/supplier/${supplier.id}`,
            method: 'put',
            data: supplier
        });
    },

    // 删除供应商ID对应的数据
    deleteById(id){
        return request({
            url: `/supplier/${id}`, //反单引号``
            method: 'delete', //delete方式提交
        });
    }
}