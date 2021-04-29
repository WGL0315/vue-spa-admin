module.exports = {
    devServer: {
        port: 8888, //端口号，如果端口号被占用，会自动提升1
        host: "localhost", //主机名，也可以写127.0.0.1或做真机测试时候0.0.0.0
        open: true, //启动服务器时，自动打开浏览器。有了这个，就不需要在pacakage.json的"script"选项中"serve"添加"--open"了
        https: false, //是否启用https协议

        // （重要）在devServer的proxy选项进行代理配置，用于解决跨域问题
        proxy: {
            // 匹配'/dev-api'开头的请求
            // '/dev-api': {
            [process.env.VUE_APP_BASE_API]: { //在.env.development文件中，用VUE_APP_BASE_API表示'/dev-api'
                // 目标服务器，代理访问到http://localhost:8001(这里指其他项目)
                // target: 'http://localhost:8001',
                target: process.env.VUE_APP_SERVICE_URL, //在.env.development文件中配置的;用VUE_APP_SERVICE_URL表示'http://localhost:8001'
                // 开启代理：会在本地创建一个虚拟服务器，然后发送请求的数据;
                // 并且同时接收请求的数据，这样服务端和服务端进行数据的交互;
                // 因此不会有跨域问题
                changeOrigin: true, //是否开启代理
                pathRewrite: {
                    // 会将'/dev-api'替换为'', 也就是'/dev-api'会被移除。
                    //如'/dev-api/db.json'代理到'https://localhost:8080/db.json'
                    // '^/dev-api':'',
                    ['^' + process.env.VUE_APP_BASE_API]: '',
                }
            }
        }
    },

    lintOnSave: false, //默认true,保存时是否关闭格式检查
    productionSourceMap: false, //打包时，不生产.map文件，加快打包速度
    // outputDir: "dist2", //指定打包目录。默认是dist，存放打包文件的目录,可以自定义
    // assetsDir: "assets", //默认在根目录。存放生成的静态资源(js,css,img,fonts)的（相对于outputDir）目录。
    // indexPath: "out/index.html", //默认index.html在根目录,指定生成的index.html的输出路径(相对于outputDir)

    pages: { //配置页面
        index: {
            entry: 'src/main.js', //page的入口
            // template: 'public/index.html', //模板来源
            // filename: 'index.html',
            title: 'Vue单页面应用', //页面标题
            // chunks: ['chunk-vendor','chunk-common', 'index'], //在这个页面中包含的块，默认情况会包含提取出来的通用chunk和vendor chunk
        }
    },
}