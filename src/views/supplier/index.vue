<template>
    <div>
        <!-- 条件查询表单。:inline="true" 设置表单一行显示 :rules="rules"表单校验 -->
        <el-form ref="searchForm" :inline="true" :model="searchCondition" class="search-form">
            <el-form-item prop="name">
                <el-input v-model="searchCondition.name" placeholder="供应商名称"></el-input>
            </el-form-item>
            <el-form-item prop="linkman">
                <el-input v-if="!isDialog" v-model="searchCondition.linkman" placeholder="联系人"></el-input>
            </el-form-item>
            <el-form-item prop="mobile">
                <el-input v-if="!isDialog" v-model="searchCondition.mobile" placeholder="联系电话"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('searchForm')">查询</el-button>
                <el-button v-if="!isDialog" type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
                <el-button v-if="!isDialog" type="primary" icon="el-icon-circle-close" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 数据列表。data绑定渲染的数据；border表格边框；highlight-current-row当前行高亮显示 -->
        <el-table :data="list" height="600px" border 
            highlight-current-row
            @current-change="clickCurrentChange">
            <!-- type="index"获取索引值，从1开始；label显示的标题；prop数据字段名；width列的宽度 -->
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="供应商名称" prop="name"></el-table-column>
            <el-table-column label="联系人" prop="linkman"></el-table-column>
            <el-table-column v-if="!isDialog" label="联系电话" prop="mobile"></el-table-column>
            <el-table-column v-if="!isDialog" label="备注" prop="remark"></el-table-column>
            <el-table-column v-if="!isDialog" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
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
            :total="total"
            :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper' : 'prev, pager, next'">
        </el-pagination>

        <!-- '新增供应商或编辑供应商'对话框。相当于共用一套模板 -->
        <el-dialog v-if="!isDialog" title="供应商" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <!-- status-icon 当表单校验不通过时，输入框右侧有个'x'小图标 -->
            <el-form
                :rules="rules"
                status-icon
                ref="supplierForm"
                :model="supplier"
                label-width="100px"
                label-position="right">
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="supplier.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="linkman">
                    <el-input v-model="supplier.linkman"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="supplier.mobile"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="supplier.remark" type="textarea"
                        :autosize="{minRows: 2, maxRows: 4}" placeholder="请输入地址">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('supplierForm')">重置</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button @click="supplier.id === null ? addData('supplierForm') : updateData('supplierForm')" type="primary">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import supplierApi from '@/api/supplier';

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            list: [], //供应商列表数据
            total: 0, //总条数
            currentPage: 1, //当前页，默认第一页
            pageSize: 10, //每页显示条数，10条
            searchCondition: { //条件查询绑定条件值
                name: '', //供应商名称
                linkman: '', //联系人
                mobile: '', //联系电话
            },
            supplier: { //供应商数据模板
                id: null, //增加id
                name: '',
                linkman: '',
                mobile: '',
                remark: ''
            },
            dialogFormVisible: false, //控制新增对话框是否显示。true显示，false不显示
            // 表单校验规则
            rules: {
                name: [
                    {
                        required: true,
                        message: '供应商名称不能为空',
                        trigger: 'blur'
                    }
                ],
                linkman: [
                    {
                        required: true,
                        message: '联系人不能为空',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true,
                        message: '联系电话不能为空',
                        trigger: 'blur'
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
    props: { //通信方式。父-->子
        // 接收父组件goods传递过来的数据，通过isDialog来判断‘是否为弹框’
        // 如果为true,则是弹框，false就是列表
        isDialog: Boolean, //supplier组件以对话框形式展示时，通过v-if="!isDialog"条件控制对应标签隐藏
    },
    beforeCreate() {  // 创建前。数据和模板均未获取到
    },
    created() {  // 创建后。已初始化data，但数据未挂载到模板中。使用PubSubJS时，需要先在created()中订阅消息PubSub.subscribe('消息名称', (event,参数)=>{...});
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
            // supplierApi.getList().then(
            //     (response) => {
            //         this.list = response.data;
            //         console.log('供应商数据this.list：', this.list);
            //     }
            // ).catch(
            //     (error) => {
            //         console.log(error);
            //     }
            // );

            // 调用分页方法查询，不要少了this
            supplierApi.search(
                this.currentPage, //当前页码
                this.pageSize, //每页条数
                this.searchCondition //查询条件
            ).then(
                (response) => {
                    const resp = response.data.data;
                    // console.log(resp);
                    this.total = resp.total,
                    this.list = resp.rows;
                    // console.log(this.list);
                }
            ).catch(
                (error) => {
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
        // 查询供应商
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
        // 新增供应商
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
                    // 清除ref='supplierForm'的表单数据
                    this.$refs['supplierForm'].resetFields();
                }
            );
        },
        // 提交"新增供应商"数据
        addData(formName){
            // console.log("addData");
           this.$refs[formName].validate(
               valid => {
                   if(valid){
                       // 验证通过，提交添加
                       supplierApi.add(this.supplier).then(
                           (response) => {
                               const resp = response.data;
                            //    console.log("新增供应商: ", resp);
                               if(resp.flag){
                                   // 新增成功
                                   this.fetchData();
                                   this.dialogFormVisible = false; //关闭对话框
                               }else{
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
        // 表单重置。在el-form-item标签属性prop上，指定了字段名，重置才会生效
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleEdit(id){
            // console.log('编辑', id);
            this.handleAdd();
            supplierApi.getById(id).then(
                response => {
                    const resp = response.data;
                    // console.log('编辑', resp);
                    this.supplier = resp.data;
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
        },
        // 更新编辑后的会员数据
        updateData(formName){
            // console.log('更新数据', formName);
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        supplierApi.update(this.supplier).then(
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
                    }else{
                        // 验证不通过
                        return false;
                    }
                }
            );
        },
        // 删除供应商ID对应的数据
        handleDelete(id){
            // console.log('删除', id);
            // 详细用法见'ElementUI'的'MessageBox弹框'
            this.$confirm(
                '确认删除这条记录吗？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(
                //选择'确定'的回调函数
                () => {
                    supplierApi.deleteById(id).then(
                        response => {
                            const resp = response.data;
                            // console.log(resp);
                            // 提示信息
                            this.$message({
                                message: resp.message,
                                type: resp.flag ? 'success' : 'error'
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
        clickCurrentChange(currentRow){
            // console.log('当前供应商: ', currentRow);
            // 点击后，要将点击的数据传递到父组件(goods/index.vue)中的'select-supplier'
            // 触发之后，父组件可以在@select_supplier='selectSupplier(currentRow)'这个事件处理函数中进行接收数据'currentRow'
            this.$emit('select_supplier', currentRow); //this.$emit('自定义事件名称', 参数)
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

/* iphone6,7,8(375)；iphoneX(375) */
@media(max-width: 375px){
    .search-form .el-form-item {
        margin-right: 0px;
        margin-left: 0px;
        width: 100%;
        padding: 0px 5px;
    }
}

</style>