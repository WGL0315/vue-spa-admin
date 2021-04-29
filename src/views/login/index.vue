<template>
    <div class="login-container">
        <!-- :rules="rulse"表单验证；ref相当于id；:model是表单数据对象；label-width是表单域标签的宽度 -->
        <!-- 表单输入框，如果没有使用v-model绑定值，是不允许输入值的 -->
        <el-form :rules="rules" ref="loginForm" :model="form" label-width="60px" class="login-form">
            <div class="login-title">Vue单页面应用</div>
            <el-form-item label="账号" prop="username">
                <!-- 表单输入框。如果没有使用v-model绑定值，是不允许输入值的 -->
                <el-input v-model="form.username" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('loginForm')" type="primary">登录</el-button>
                <!-- 有prop属性才可以重置 -->
                <el-button @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
            <div class="tips">
                tips: 账号和密码可随意创建
            </div>
        </el-form>
        
    </div>
</template>

<script>
// import {login, getUserInfo} from '@/api/login';

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            form: {}, //表单
            rules: { //表单校验
                username: [ //对应el-form-item的prop值
                    {
                        required: true, //是否必填
                        message: '请输入有效账号', //错误时，提示信息
                        trigger: 'blur', //失去焦点时触发,开始进行校验
                    },
                    {
                        min: 2,
                        max: 6,
                        message: '长度在2到6个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入有效密码',
                        tirgger: 'blur'
                    }
                ]
            }
        };
    },
    components: {  //子组件。也可在实例外部，通过Vue.component('组件名称', {template: ``, data:function(){ return {...} }});注册组件
    },
    beforeCreate() {  // 创建前。数据和模板均未获取到
    },
    created() {  // 创建后。已初始化data，但数据未挂载到模板中。使用PubSubJS时，需要先在created()中订阅消息PubSub.subscribe('消息名称', (event,参数)=>{...});
        // this.getTokenAndUserInfo();//查看当前的token和user
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
        submitForm(formName){ //提交表单。注意：按钮上调用的函数名称要一致
            // formName是指ref="loginForm"，与:model="form"无关
            // console.log('formName: ', formName);
            // console.log('this.$refs[formName]: ', this.$refs[formName]);
            this.$refs[formName].validate(
                (valid) => {
                    if(valid){
                        // 验证账号和密码是否通过
                        // login(this.form.username, this.form.password).then(
                        //     response => {
                        //         const resp = response.data;
                        //         // console.log(resp.code, resp.message, resp.data.token, resp.code === 2000);
                        //         if(resp.flag){
                        //             // 通过，获取用户信息，异步请求
                        //             getUserInfo(resp.data.token).then(
                        //                 response => {
                        //                     // 存入session中
                        //                     const respUser = response.data;
                        //                     if(respUser.flag){
                        //                         // 将信息保存到浏览器的localStorage中
                        //                         localStorage.setItem('vue-spa-admin-user', JSON.stringify(respUser.data));
                        //                         // 方便后面重新验证
                        //                         localStorage.setItem('vue-spa-admin-token', resp.data.token);
                        //                         // 跳转到默认组件（即首页），前往首页
                        //                         this.$router.push('/');
                        //                         this.$message({
                        //                             message: '欢迎访问Vue单页面应用',
                        //                             type: 'success'
                        //                         });
                        //                     }else {
                        //                         // 获取失败，弹出警告弹窗。提示信息为接口返回的'message'
                        //                         this.$message({
                        //                             message: respUser.message,
                        //                             type: 'error'
                        //                         });
                        //                     }
                        //                 }
                        //             ).catch(
                        //                 error => {
                        //                     console.log(error);
                        //                 }
                        //             );
                        //         }else {
                        //             // 获取用户信息失败，弹出警告弹窗。提示信息为接口返回的'message'
                        //             this.$message({
                        //                 message: resp.message,
                        //                 type: 'warning'
                        //             })
                        //         }
                        //     }
                        // ).catch(
                        //     error => {
                        //         console.log(error);
                        //     }
                        // );

                        // 用vuex方式实现上述功能：
                        this.$store.dispatch('Login', this.form).then(
                            response => {
                                if(response.flag){
                                    // 前往首页
                                    this.$router.push('/');
                                    this.$message({
                                        message: '欢迎访问Vue单页面应用',
                                        type: 'success'
                                    });
                                }else{
                                    // 获取失败，弹出警告弹窗。提示信息为接口返回的'message'
                                    this.$message({
                                        message: response.message,
                                        type: 'error'
                                    });
                                }
                            }
                        ).catch();
                    }else {
                        console.log("验证失败");
                        return false;
                    }
                }
            );
        },
        resetForm(formName){ //重置表单
            this.$refs[formName].resetFields();
            // console.log("重置表单");
        },
        // 查看token和user的信息
        // getTokenAndUserInfo(){
        //     // 第一个user是指store/modules/user.js
        //     console.log('当前token: ', this.$store.state.user.token);
        //     console.log('当前user: ', this.$store.state.user.user);
        // }
    },
    watch: {  //监听器。当属性数据发生变化时，对应属性的回调函数会自动调用，在函数内部进行计算。也可在实例外部，通过vm.watch()来监听
    },
    directives: { //注册局部自定义指令。也可在实例外部，通过Vue.directive('指令名称', {inserted: function(el, binding){...}});注册全局自定义指令
        //示例:  '指令名称': { inserted(el, binding){...} }
    },
}

</script>
<style lang='scss' scoped>
.login-container {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: url('../../assets/bg.jpg') center center no-repeat;
    background-size: cover;
    overflow: hidden;
}
.login-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    // margin: 160px auto;
    background: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 20px;
}
.login-title {
    font-size: 24px;
    margin: 20px 0px;
    color: #303133;
    text-align: center;
}
.tips {
    color: #666666;
    text-align: center;
}

// /* iPadPro（横屏1366) */
// @media(max-width: 1300px){
// }

// /* iPadPro(1024), iPad(横屏1024)，iPhone X(横屏812)，Pixel2 XL(横屏823)*/
// @media(max-width: 1024px){
// }

// /* iPad(768);Glaxy Fold(653);Pixel2(横屏731);iPhone6/7/8Plus(横屏736)*/
// @media(max-width: 768px){
// }

// /* Surface Duo(横屏720) */
// @media(max-width: 720px){
// }

// /* Surface Duo(540) */
// @media(max-width: 540px){
// }

/* iPhone 6/7/8 Plus(414) */
@media(max-width: 450px) {
    .login-form {
        width: 320px;
        padding: 10px;
        border-radius: 10px;
    }
}

// /* iphone6,7,8(375)；iphoneX(375) */
// @media(max-width: 375px){
// }

// /* iPhone5/SE(320) */
// @media(max-width: 320px){}
</style>