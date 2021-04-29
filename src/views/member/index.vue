<template>
    <div>
        <!-- 条件查询表单。:inline="true" 设置表单一行显示 :rules="rules"表单校验 -->
        <el-form ref="searchForm" :inline="true" :model="searchCondition" class="search-form">
            <el-form-item prop="cardNum">
                <el-input v-model="searchCondition.cardNum" placeholder="会员卡号"></el-input>
            </el-form-item>
            <el-form-item prop="name">
                <el-input v-model="searchCondition.name" placeholder="会员姓名"></el-input>
            </el-form-item>
            <el-form-item prop="payType">
                <el-select v-model="searchCondition.payType" placeholder="支付类型" style="width: 110px;">
                    <!-- key标识，label下拉显示的文本，value表单值 -->
                    <el-option
                        v-for="option in payTypeOptions"
                        :key="option.type"
                        :label="option.name"
                        :value="option.type">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="birthday">
                <!-- value-format是指定绑定值的格式 -->
                <el-date-picker value-format="yyyy-MM-dd" v-model="searchCondition.birthday" placeholder="会员生日" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('searchForm')">查询</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
                <el-button type="primary" icon="el-icon-circle-close" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 数据列表。data绑定渲染的数据；border表格边框；highlight-current-row当前行高亮显示 -->
        <el-table :data="list" border height="600px" highlight-current-row>
            <!-- type="index"获取索引值，从1开始；label显示的标题；prop数据字段名；width列的宽度 -->
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
            <el-table-column prop="name" label="会员姓名" width="90"></el-table-column>
            <el-table-column prop="birthday" label="会员生日"></el-table-column>
            <el-table-column prop="phone" label="手机号码"></el-table-column>
            <el-table-column prop="integral" label="可用积分"></el-table-column>
            <el-table-column prop="money" label="开卡金额"></el-table-column>
            <el-table-column prop="payType" label="支付类型">
                <template slot-scope="scope">
                    <!-- 过滤器 -->
                    <span>{{ scope.row.payType | payTypeFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="会员地址"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页模板 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10,20,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- '新增会员或编辑会员'对话框。相当于共用一套模板 -->
        <el-dialog title="会员" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <!-- status-icon 当表单校验不通过时，输入框右侧有个'x'小图标 -->
            <el-form
                status-icon
                ref="memberForm"
                :model="member"
                label-width="100px"
                label-position="right"
                :rules="rules">
                <el-form-item label="会员卡号" prop="cardNum">
                    <el-input v-model="member.cardNum"></el-input>
                </el-form-item>
                <el-form-item label="会员姓名" prop="name">
                    <el-input v-model="member.name"></el-input>
                </el-form-item>
                <el-form-item label="会员生日" prop="birthday">
                    <el-date-picker
                        v-model="member.birthday"
                        type="date"
                        placeholder="请点击选择"
                        style="max-width: 150px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="member.phone"></el-input>
                </el-form-item>
                <el-form-item label="开卡金额" prop="money">
                    <el-input v-model="member.money"></el-input>
                </el-form-item>
                <el-form-item label="可用积分" prop="intergral">
                    <el-input v-model="member.integral"></el-input>
                </el-form-item>
                <el-form-item label="支付类型" prop="payType">
                    <el-select v-model="member.payType" class="filter-item" placeholder="请点击选择">
                        <el-option
                            v-for="option in payTypeOptions"
                            :key="option.type"
                            :label="option.name"
                            :value="option.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="会员地址" prop="">
                    <el-input
                        v-model="member.address"
                        type="textarea"
                        :autosize="{minRows: 2, maxRows: 4}"
                        placeholder="请输入地址">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('memberForm')">重置</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button @click="member.id === null ? addData('memberForm') : updateData('memberForm')" type="primary">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import memberApi from '@/api/member';

// 支付类型
const payTypeOptions = [
    {type: '1', name: '现金'},
    {type: '2', name: '微信'},
    {type: '3', name: '支付宝'},
    {type: '4', name: '银行卡'},
];

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            list: [], //会员列表数据
            total: 0, //总条数
            currentPage: 1, //当前页，默认第一页
            pageSize: 10, //每页显示条数，10条
            searchCondition: { //条件查询绑定条件值
                cardNum: '', //会员卡号
                name: '', //会员姓名
                payType: '', //支付类型
                birthday: '', //会员生日
            },
            payTypeOptions, //支付类型，ES6语法。相当于payTypeOptions: payTypeOptions
            member: { //会员数据模板
                id: null, //增加id
                cardNum: '',
                name: '',
                birthday: '',
                phone: '',
                money: 0,
                integral: 0,
                payType: '',
                address: ''
            },
            dialogFormVisible: false, //控制'新增或编辑'对话框是否显示。true显示，false不显示
            // 表单校验规则
            rules: {
                cardNum: [
                    {
                        required: true,
                        message: '会员卡号不能为空',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '会员姓名不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 6,
                        message: '长度在2到6个字符',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '手机号码不能为空',
                        trigger: 'blur'
                    },
                ],
                payType: [
                    {
                        required: true,
                        message: '请选择支付类型',
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
        // console.log("当前位置：", this.$route.meta.title);
        this.fetchData(); //获取数据
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
        fetchData(){
            // memberApi.getList().then(
            //     response => {
            //         this.list = response.data;
            //         console.log('会员数据this.list：', this.list);
            //         console.log(typeof(this.list));
            //     }
            // ).catch(
            //     error => {
            //         console.log(error);
            //     }
            // );

            // 调用分页方法查询，不要少了this
            memberApi.search(
                this.currentPage, //当前页码
                this.pageSize, //每页条数
                this.searchCondition //查询条件
            ).then(
                response => {
                    // 获取后台API返回的数据
                    const resp = response.data.data;
                    // console.log("memberList: ", resp);
                    this.total = resp.total;
                    this.list = resp.rows;
                    // console.log(this.total, this.list);
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
        },
        // '每页显示条数'改变时触发，重新获取数据
        handleSizeChange(val){
            this.pageSize = val;
            this.fetchData();
        },
        // '当前页'改变时触发，重新获取数据
        handleCurrentChange(val){
            this.currentPage = val;
            this.fetchData();
        },
        // 表单重置。在el-form-item标签属性prop上，指定了字段名，重置才会生效
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        // 查询会员
        handleSearch(formName){
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        // 验证通过，提交添加
                        // this.fetchData();
                    }else {
                        // 验证不通过，返回false
                        // this.$message({
                        //     message: '请输入有效值',
                        //     type: 'warning'
                        // });
                        return false;
                    }
                    
                }
            );
            this.fetchData();
        },
        // 新增会员
        handleAdd(){
            // 打开'新增'对话框
            this.dialogFormVisible = true;
            /**
                this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
                弹出窗口打开之后，需要加载Dom，就需要花费一点时间;
                我们应该等待它加载完dom之后，再进行调用resetFilds方法，重置表单和清除样式
            */
            this.$nextTick(
                () => {
                    // 清除ref='memberForm'的表单数据
                    this.$refs['memberForm'].resetFields();
                }
            );
        },
        // 提交"新增会员"数据
        addData(formName){
            // console.log("addData");
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        // 验证通过，提交添加
                        // alert("提交新增会员数据");
                        memberApi.add(this.member).then(
                            response => {
                                const resp = response.data;
                                // console.log("新增会员: ", resp);
                                if(resp.flag){
                                    // 新增成功
                                    this.fetchData();
                                    this.dialogFormVisible = false; //关闭对话框
                                }else {
                                    // 新增失败，弹出提示
                                    this.$message({
                                        message: resp.message, //后台API返回失败的信息
                                        type: 'warning'
                                    });
                                }
                            }
                        ).catch(
                            error => {
                                console.log(error);
                            }
                        );

                    }else {
                        // 验证不通过，返回false
                        return false;
                    }
                    
                }
            );
        },
        // 编辑会员ID查询对应的数据
        handleEdit(id){
            // console.log('编辑 ', id);
            // 清空原来数据，打开对话框
            this.handleAdd();
            // 通过id查询对应的数据
            memberApi.getById(id).then(
                response => {
                    const resp = response.data;
                    if(resp.flag){
                        this.member = resp.data;
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );

        },
        // 更新编辑后的会员数据
        updateData(formName){
            // console.log("更新数据");
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        memberApi.update(this.member).then(
                            response => {
                                const resp = response.data;
                                if(resp.flag){
                                    this.fetchData();//刷新数据列表
                                    this.dialogFormVisible = false; //关闭窗口
                                }else{
                                    // 失败，弹出提示
                                    this.$message({
                                        message: resp.message,
                                        type: 'warning'
                                    });
                                }
                            }
                        ).catch(
                            error => {
                                console.log(error);
                            }
                        );
                    }else {
                        // 验证不通过
                        return false;
                    }
                }
            );
        },
        // 删除会员ID对应的数据
        handleDelete(id){
            // console.log('删除 ', id);
            // 详细用法见'ElementUI'的'MessageBox弹框'
            this.$confirm(
                '确认删除这条记录吗？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(
                //选择'确定'的回调函数
                () => {
                    memberApi.deleteById(id).then(
                        response => {
                            const resp = response.data;
                            // 提示信息
                            this.$message({
                                message: resp.message,
                                type: resp.flag ? 'success' : 'error',
                            });
                            if(resp.flag){
                                // 删除成功,刷新数据列表
                                this.fetchData();
                            }
                        }
                    ).catch(
                        error => {
                            console.log(error);
                        }
                    );
                }
            ).catch(
                //选择'取消'的回调函数
                () => {
                    // 不理会
                    // console.log('取消删除');
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
    filters: { //过滤器
        payTypeFilter(type){
            /* payTypeOptions.find(obj => {
                return obj.type === type
            }) */
            // 在过滤 器当中不能引用当前实例 this。 this.payTypeOptions 错误的
            const payObj = payTypeOptions.find(
                obj => {
                    return obj.type === type
                }
            );
            return payObj ? payObj.name : null
        }
    }
}

</script>
<style lang='scss' scoped>
.search-form {
    margin-top: 20px;
}
.search-form .el-form-item {
    max-width: 200px;
    margin-left: 10px;
}
.search-form .el-form-item:last-child {
    max-width: 300px;
}
.search-form .el-date-editor.el-input, .el-date-editor.el-input__inner {
    max-width: 200px !important;
}
/* iphone6,7,8(375)；iphoneX(375) */
@media(max-width: 375px){
    .search-form .el-form-item {
        margin-right: 0px;
        margin-left: 0px;
        max-width: 100%;
        width: 100%;
        padding: 0px 5px;
    }
}
</style>