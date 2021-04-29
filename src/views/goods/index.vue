<template>
    <div>
        <!-- 条件查询表单。:inline="true" 设置表单一行显示 :rules="rules"表单校验 -->
        <el-form ref="searchForm" :inline="true" :model="searchCondition" class="search-form">
            <el-form-item prop="name">
                <el-input v-model="searchCondition.name" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="searchCondition.code" placeholder="商品编码"></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
                <el-input v-model="searchCondition.supplierName" placeholder="请选择供应商" 
                    readonly @click.native="dialogSupplierVisible = true">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch('searchForm')">查询</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="handleAdd">新增</el-button>
                <el-button type="primary" icon="el-icon-circle-close" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- '选择供应商'对话框 -->
        <el-dialog title="选择供应商"
            :visible.sync="dialogSupplierVisible"
            :width="dialogWidth">
            <!-- 供应商组件 -->
            <!-- @自定义事件名称="事件处理函数",该自定义事件名称要与子组件一致 -->
            <supplier @select_supplier="selectSupplier" :isDialog="true"></supplier>
        </el-dialog>

        <!-- 数据列表。data绑定渲染的数据；border表格边框；highlight-current-row当前行高亮显示 -->
        <el-table :data="list" height="600px" border highlight-current-row>
            <!-- type="index"获取索引值，从1开始；label显示的标题；prop数据字段名；width列的宽度 -->
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="商品编码" prop="code"></el-table-column>
            <el-table-column label="商品规格" prop="spec"></el-table-column>
            <el-table-column label="零售价" prop="retailPrice"></el-table-column>
            <el-table-column label="进货价" prop="purchasePrice"></el-table-column>
            <el-table-column label="库存数量" prop="storageNum"></el-table-column>
            <el-table-column label="供应商" prop="supplierName"></el-table-column>
            <el-table-column label="操作" width="150">
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
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- '新增商品或编辑商品'对话框。相当于共用一套模板 -->
        <el-dialog title="商品" :visible.sync="dialogFormVisible" :width="dialogWidth">
            <el-form 
                :rules="rules"
                status-icon
                ref="goodsForm"
                :model="goods"
                label-width="100px"
                label-position="right"
                >
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="goods.name"></el-input>
                </el-form-item>
                <el-form-item label="商品编码" prop="code">
                    <el-input v-model="goods.code"></el-input>
                </el-form-item>
                <el-form-item label="商品规格" prop="spec">
                    <el-input v-model="goods.spec"></el-input>
                </el-form-item>
                <el-form-item label="零售价" prop="retailPrice">
                    <el-input v-model="goods.retailPrice"></el-input>
                </el-form-item>
                <el-form-item label="进货价" prop="purchasePrice">
                    <el-input v-model="goods.purchasePrice"></el-input>
                </el-form-item>
                <el-form-item label="库存数量" prop="storageNum">
                    <el-input v-model="goods.storageNum"></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplierId">
                    <el-input readonly
                        @click.native="editSelectSupplier"
                        v-model="goods.supplierName"
                        placeholder="请选择供应商"
                        style="max-width: 200px;">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('goodsForm')">重置</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button @click="goods.id === null? addData('goodsForm') : updateData('goodsForm')" type="primary">
                    确定
                </el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import goodsApi from '@/api/goods';

// Supplier作为子组件。点击'新增'时显示
import Supplier from '@/views/supplier';

export default {
    data () {  //指定初始化数据。是一个函数，与JS自身的特性有关，返回一个对象
        return {
            list: [], //商品列表数据
            total: 0, //总条数
            currentPage: 1, //当前页，默认第一页
            pageSize: 10, //每页显示条数，10条
            searchCondition: { //条件查询绑定条件值
                name: '', //商品名称
                code: '', //商品编码
                supplierName: '', //供应商名称
            },
            dialogSupplierVisible: false, //控制'选择供应商'对话框的显示
            dialogFormVisible: false, //控制'新增或编辑'对话框是否显示。true显示，false不显示
            goods: {
                id: null,
                name: '',
                code: '',
                spec: '',
                retailPrice: 0.0,
                purchasePrice: 0.0,
                storageNum: 0,
                supplierName: '',
                supplierId: null,
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: '商品名称不能为空',
                        trigger: 'blur'
                    }
                ],
                code: [
                    {
                        required: true,
                        message: '商品编码不能为空',
                        trigger: 'blur'
                    }
                ],
                retailPrice: [
                    {
                        required: true,
                        message: '售价不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            // 处理‘新增商品对话框中，点击供应商，数据没有回显’的问题
            // true表示'供应商组件'是在'新增对话框'中打开的；false表示'供应商组件'是在'条件查询表单'中打开的
            isEdit: false,
            // 在ElementUI的Dialog中，需要实现其宽度随浏览器宽度变化而变化，并设定默认值，
            // 当浏览器宽度大于该值时，Dialog保持该宽度，小于该值时，使用100%宽度。
            // 代码使用 window.onresize 事件触发变化
            dialogWidth: '500px',
        };
    },
    components: {  //子组件。也可在实例外部，通过Vue.component('组件名称', {template: ``, data:function(){ return {...} }});注册组件
        Supplier,
    },
    beforeCreate() {  // 创建前。数据和模板均未获取到
    },
    created() {  // 创建后。已初始化data，但数据未挂载到模板中。使用PubSubJS时，需要先在created()中订阅消息PubSub.subscribe('消息名称', (event,参数)=>{...});
        this.fetchData(); //获取列表数据
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
            goodsApi.search(
                this.currentPage,
                this.pageSize,
                this.searchCondition
            ).then(
                response => {
                    const resp = response.data;
                    this.total = resp.data.total;
                    this.list = resp.data.rows;
                    // console.log("数据列表: ",this.list);
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
        // 查询商品
        handleSearch(formName){
            // console.log(formName);
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
        // 选择供应商
        selectSupplier(currentRow){
            // console.log('选择的供应商：', currentRow);
            if(this.isEdit){
                // '新增'对话框
                this.goods.supplierName = currentRow.name; //供应商名称
                this.goods.supplierId = currentRow.id; //供应商ID
            }else{
                // 条件查询表单
                this.searchCondition.supplierName = currentRow.name; //供应商名称
                this.searchCondition.supplierId = currentRow.id; //供应商ID
            }
            this.isEdit = false;
            this.dialogSupplierVisible = false; //关闭'选择供应商'对话框
        },
        // 新增商品
        handleAdd(){
            // console.log('新增');
            // 打开'新增'对话框
            this.dialogFormVisible = true;
            /**
                this.$nextTick()是一个异步事件，当渲染结束之后，它的回调函数才会执行
                弹出窗口打开之后，需要加载Dom，就需要花费一点时间;
                我们应该等待它加载完dom之后，再进行调用resetFilds方法，重置表单和清除样式
            */
            this.$nextTick(
                () => {
                    // 清除ref='goodsForm'的表单数据
                    this.$refs['goodsForm'].resetFields();
                }
            );
        },
        addData(formName){
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        // console.log('submit');
                        // 验证通过，提交添加
                        goodsApi.add(this.goods).then(
                            response => {
                                const resp = response.data;
                                if(resp.flag){
                                    // 新增成功
                                    // console.log('新增成功');
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
                    }else{
                        // 验证不通过，返回false
                        return false;
                    }
                }
            );
        },
        // 在'编辑对话框'中打开'供应商组件'
        editSelectSupplier(){
            this.isEdit = true; //true表示'供应商组件'是在'新增对话框'中打开的
            this.dialogSupplierVisible = true; //打开'供应商组件'
        },
        // 表单重置。在el-form-item标签属性prop上，指定了字段名，重置才会生效
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        handleEdit(id){
            // console.log('编辑', id);
            // 清空原来数据，打开对话框
            this.handleAdd();
            goodsApi.getById(id).then(
                response => {
                    const resp = response.data;
                    // console.log('编辑', resp);
                    if(resp.flag){
                        this.goods = resp.data;
                    }else {
                        return false;
                    }
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
        },
        // 更新编辑后的商品数据
        updateData(formName){
            // console.log('更新数据', formName);
            this.$refs[formName].validate(
                valid => {
                    if(valid){
                        goodsApi.update(this.goods).then(
                            response => {
                                const resp = response.data;
                                // console.log(resp);
                                if(resp.flag){
                                    this.fetchData(); //刷新数据列表
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
        // 删除商品ID对应的数据
        handleDelete(id){
            // console.log('删除', id);
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
                    goodsApi.deleteById(id).then(
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