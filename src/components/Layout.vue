<template>
    <div>
        <!-- 头部区域 -->
        <app-header></app-header>
        <div class="content">
            <!-- 左侧导航栏区域 -->
            <app-navbar></app-navbar>
            <!-- 右侧主区域 -->
            <app-main></app-main>
        </div>

        <!-- 
            element的响应式布局
            类似BootStrap的响应式布局,预设了五个响应尺寸。但是这里24表示撑满，12表示占据一半
            xs: <768px
            sm: >=768px
            md: >=992px
            lg: >=1200px
            xl: >=1920px
            详情查看：https://element.eleme.cn/#/zh-CN/component/layout
        -->
    </div>
</template>

<script>
// 导入布局组件
import AppHeader from './AppHeader';
import AppNavbar from './AppNavbar';
import AppMain from './AppMain';

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            //
        };
    },
    components: {  //子组件。也可在实例外部，通过Vue.component('组件名称', {template: ``, data:function(){ return {...} }});注册组件
        AppHeader,
        AppNavbar,
        AppMain
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
// 头部区域
.header {
    position: relative;
    width: 100%;
    min-height: 50px;
    background: #2d3a4b;
    color: #ffffff;
}

// 内容区
.content {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 50px;
    bottom: 0px;
    width: 100%;
}
// 左侧导航栏
.navbar {
    float: left;
    width: 230px;
    height: 100%;
    background: #545c64;
}
//右侧主区域
.main {
    height: 100%;
    margin-left: 230px;
}

@media(max-width: 1366px){
}

/* iPadPro(1024), iPad(横屏1024)，iPhone X(横屏812)，Pixel2 XL(横屏823)*/
@media(max-width: 1024px){
    .content {
        position: static;
    }
    .navbar {
        float: none;
        width: 100%;
    }
    .main {
        margin-left: 0px;
        padding-bottom: 50px;
        height: auto;
    }
    .main div.el-table {
        height: auto !important;
    }
    .main .el-table--scrollable-y .el-table__body-wrapper {
        height: auto !important;
    }
}

</style>