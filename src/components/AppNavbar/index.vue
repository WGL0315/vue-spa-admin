<template>
    <div class="navbar">
        <!-- 
            el-menu标签上的:router="true"具有开启导航路由功能，el-menu-item的index指定路由地址;
            default-active默认选中哪个菜单，选中为黄色;
            注意：v-bind:default-active才可以指定表达式。
         -->
        <el-menu
            :router="true"
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#ffffff"
            active-text-color="#ffd04b">
            <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/supplier">
                <i class="el-icon-s-cooperation"></i>
                <span slot="title">供应商管理</span>
            </el-menu-item>
            <el-menu-item index="/goods">
                <i class="el-icon-s-goods"></i>
                <span slot="title">商品管理</span>
            </el-menu-item>
            <el-menu-item index="/member">
                <i class="el-icon-user-solid"></i>
                <span slot="title">会员管理</span>
            </el-menu-item>
            <el-menu-item index="/staff">
                <i class="el-icon-user"></i>
                <span slot="title">员工管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            //
        };
    },
    components: {  //子组件。也可在实例外部，通过Vue.component('组件名称', {template: ``, data:function(){ return {...} }});注册组件
    },
    beforeCreate() {  // 创建前。数据和模板均未获取到
    },
    created() {  // 创建后。已初始化data，但数据未挂载到模板中。使用PubSubJS时，需要先在created()中订阅消息PubSub.subscribe('消息名称', (event,参数)=>{...});
    },
    beforeMount() {  // 挂载前。模板已获取到，但数据未挂载到模板上
    },
    mounted() {  // 编译完成，数据已挂载到模板中
    },
    beforeUpdate() {  // 当data改变后，更新模板中的数据前 被调用
    },
    updated() {  // data被Vue渲染之后的Dom数据模板
    },
    beforeDestroy() {  // 实例被销毁前调用
    },
    destroyed() {  // 实例被销毁后调用
    },
    computed: {  //计算属性。类似于methods中的函数，会进行缓存，默认get方法,可设置set方法
    },
    methods: {  //指定事件处理方法。在模板页面中通过 v-on:事件名称 来调用
    },
    watch: {  //监听器。当属性数据发生变化时，对应属性的回调函数会自动调用，在函数内部进行计算。也可在实例外部，通过vm.watch()来监听
    },
    directives: { //注册局部自定义指令。也可在实例外部，通过Vue.directive('指令名称', {inserted: function(el, binding){...}});注册全局自定义指令
        //示例:  '指令名称': { inserted(el, binding){...} }
    },
}

</script>
<style lang='scss' scoped>
.el-menu {
    border: none;
}
@media(max-width: 1024px){
    .el-menu-item {
        float: left;
    }
}
@media(max-width: 375px){
  .el-menu-item {
    height: auto !important;
    width: 50% !important;
  }
}
</style>