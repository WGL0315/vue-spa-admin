<template>
    <div class="header">
        <!-- 头部左侧Logo和标题 -->
        <div class="logo">
            <a href="javascript: void(0)">
                <img src="@/assets/my-logo2.png" alt="logo">
                <span class="company">Vue单页面应用</span>
            </a>
        </div>
        <!-- 头部右侧下拉菜单 -->
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{ localUser.name }}<i class="el-icon-caret-bottom" style="margin-left: 10px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!-- '修改密码'对话框 -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <el-form :model="user" status-icon :rules="rules" ref="userForm" label-width="80px">
                <el-form-item label="原密码" prop="oldPassword">
                    <!-- show-password属性，可得到一个可切换显示隐藏的密码框 -->
                    <el-input type="password" v-model="user.oldPassword" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="user.password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input type="password" v-model="user.checkPassword" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" @click="submitForm('userForm')">提交</el-button>
                    <el-button @click="resetForm('userForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
// import {logout} from '@/api/login';
import passwordApi from '@/api/password';

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象

        //自定义校验规则--校验原密码 。rule当前校验表单对象
        const validateOldPassword = (rule, value, callback) => {
            // console.log('本地用户id', this.localUser.id);
            passwordApi.checkPassword(this.localUser.id, value).then(
                response => {
                    const resp = response.data;
                    if(resp.flag){
                        callback();
                    }else{
                        callback(new Error(resp.message));
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
            // 获取本地localUser.id,作比较后，更新本地账号
        };
        // 自定义校验规则--校验新密码。rule当前校验表单对象
        const validatePassword = (rule, value, callback) => {
            // if(value === ''){
            //     callback(new Error('请再次输入密码'));
            // }else 
            if(value != this.user.password){
                callback(new Error('"新密码"与"确认密码"不一致!'));
            }else{
                callback();
            }
        };

        return {
            dialogFormVisible: false,
            user: {
                oldPassword: '',
                password: '',
                checkPassword: ''
            },
            // localUser:  JSON.parse(localStorage.getItem('vue-spa-admin-user')),
            localUser: this.$store.state.user.user, // 改用vuex方式实现。第一个user是指modules中的user.js模块
            rules: {
                oldPassword: [
                    {
                        required: true,
                        message: '原密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: validateOldPassword,
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'blur'
                    },
                ],
                checkPassword: [
                    {
                        required: true,
                        message: '确认密码不能为空',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePassword,
                        trigger: 'change'
                    }
                ]
            },
            // 在ElementUI的Dialog中，需要实现其宽度随浏览器宽度变化而变化，并设定默认值，
            // 当浏览器宽度大于该值时，Dialog保持该宽度，小于该值时，使用100%宽度。
            // 代码使用 window.onresize 事件触发变化
            dialogWidth: '500px',
        };
    },
    components: {  //子组件。也可在实例外部，通过Vue.component('组件名称', {template: ``, data:function(){ return {...} }});注册组件
    },
    beforeCreate() {  // 创建前。数据和模板均未获取到
    },
    created() {  // 创建后。已初始化data，但数据未挂载到模板中。使用PubSubJS时，需要先在created()中订阅消息PubSub.subscribe('消息名称', (event,参数)=>{...});
        // this.getLocalUser();
        this.setDialogWidth(); //设置对话框宽度
    },
    beforeMount() {  // 挂载前。模板已获取到，但数据未挂载到模板上
    },
    mounted() {  // 编译完成，数据已挂载到模板中
        window.onresize = () => {
            return () => {
                this.setDialogWidth(); //监测窗口宽度，调用“设置对话框宽度”
            }
        };
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
        //查看用户信息 
        // getLocalUser(){
        //     console.log('用户信息: ', this.localUser);
        // },
        handleCommand(command){
            // this.$message({
            //     message: '点击: ' + command,
            //     type: 'warning'
            // });
            switch(command){
                case 'changePassword': this.handlePassword(); break;
                case 'logout': this.handleLogout(); break;
                default: break;
            }
        },
        // 表单重置。在el-form-item标签属性prop上，指定了字段名，重置才会生效
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        // 修改密码
        handlePassword(){
            // 打开'修改密码'对话框
            this.dialogFormVisible = true;
            /**
                this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
                弹出窗口打开之后，需要加载Dom，就需要花费一点时间;
                我们应该等待它加载完dom之后，再进行调用resetFilds方法，重置表单和清除样式
            */
            this.$nextTick(
                () => {
                    this.$refs['userForm'].resetFields();
                }
            );
        },
        // 退出登录
        handleLogout(){
            // logout(
            //     // 获取本地token。token作为api的提交参数
            //     localStorage.getItem('vue-spa-admin-token')
            // ).then(
            //     response => {
            //         const resp = response.data;
            //         if(resp.flag){
            //             // 清除本地数据
            //             localStorage.removeItem('vue-spa-admin-token');
            //             localStorage.removeItem('vue-spa-admin-user');
            //             // 跳转到"登录组件"
            //             this.$router.push('/login');
            //         }else{
            //             // 失败，弹出提示
            //             this.$message({
            //                 message: resp.message,
            //                 type: 'warning',
            //                 duration: 500 //弹出停留时间
            //             });
            //         }
            //     }
            // ).catch(
            //     error => {
            //         console.log(error);
            //     }
            // );

            // 改用vuex实现上述功能
            // console.log('退出系统前vuex的user: ', this.$store.state.user.user);
            this.$store.dispatch('Logout').then(
                response => {
                    if(response.flag){
                        // 跳转到"登录组件"
                        this.$router.push('/login');
                        // console.log('退出系统后vuex的user: ', this.$store.state.user.user);
                    }else{
                        // 失败，弹出提示
                        this.$message({
                            message: response.message,
                            type: 'warning',
                            duration: 500 //弹出停留时间
                        });
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
            // console.log('退出系统后vuex的user: ', this.$store.state.user.user); //这里的user和退出前相同，因为是‘退出登录接口’是异步执行的
        },
        // '修改密码'对话框的提交按钮
        submitForm(formName){
            // console.log('提交', formName);
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        // 验证通过，提交添加
                        passwordApi.updatePassword(
                            this.localUser.id,
                            this.user.checkPassword
                        ).then(
                            response => {
                                const resp = response.data;
                                console.log('提交', resp);
                                this.$message({
                                    message: resp.message,
                                    type: resp.flag ? 'success' : 'warning'
                                });
                                if(resp.flag){
                                    // 修改成功，清除本地数据，重新登录
                                    this.handleLogout();
                                    // 关闭"修改密码"对话框
                                    this.dialogFormVisible = false;
                                }
                            }
                        ).catch(
                            error => {
                                console.log(error);
                            }
                        );
                    }else{
                        // 验证不通过
                        return false;
                    }
                }
            );
        },
        // 设置对话框宽度。实现el-dialog对话框响应式布局
        setDialogWidth(){
            // console.log("当前客户端设备宽度", document.body.clientWidth);
            var clientWidth = document.body.clientWidth;
            const defaultWidth = 500; //默认宽度
            if(clientWidth > defaultWidth){ //若设备宽度大于默认宽度
                // 不处理
                // this.dialogWidth = clientWidth + 'px';
                
            }else{ //若设备宽度小于等于默认宽度
                this.dialogWidth = clientWidth + 'px';
            }
        },
    },
    watch: {  //监听器。当属性数据发生变化时，对应属性的回调函数会自动调用，在函数内部进行计算。也可在实例外部，通过vm.watch()来监听
    },
    directives: { //注册局部自定义指令。也可在实例外部，通过Vue.directive('指令名称', {inserted: function(el, binding){...}});注册全局自定义指令
        //示例:  '指令名称': { inserted(el, binding){...} }
    },
}

</script>
<style lang='scss' scoped>
.logo {
    position: relative;
    margin-left: 40px;
    margin-right: 120px;
}
.logo img {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 25px;
    height: 25px;
    border-radius: 25px;
}
.company {
    margin-left: 30px;
    font-size: 18px;
    line-height: 50px;
    color: #ffffff;
}
// 下拉菜单
.el-dropdown {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    margin-right: 40px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #ffffff;
}

/* iphone6,7,8(375)；iphoneX(375) */
@media(max-width: 375px){
    .logo {
        margin-left: 20px;
        margin-right: 80px;
    }
    .el-dropdown {
        margin-right: 20px;
    }
}

</style>