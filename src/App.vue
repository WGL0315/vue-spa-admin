<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/> -->

    <!-- 路由组件渲染出口 -->
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
* { //初始化所有标签
  margin: 0 0;
  padding: 0 0;
  box-sizing: border-box;
}
*:focus {
  outline: none;
}
body {
  font-family: '微软雅黑';
  background: #ffffff;
}
a {
  text-decoration: none;
  color: #000000;
}
a:hover {
  outline: none;
  color: #17768a;
}

.el-table th>.cell {
  text-align: center !important;
}
.el-pagination::after, .el-pagination::before {
  display: none !important;
}
.el-pagination {
  white-space: normal !important;
}

</style>
