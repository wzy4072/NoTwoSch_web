# ppfe

> A Vue.js project of  passport backend

## Build Setup

``` bash
# install dependencies
npm install

# 用淘宝加速镜像：
npm --registry=https://registry.npm.taobao.org install

# serve with hot reload at localhost:8083
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Main Directory Structure

```
ppfe/
    |-- config              路由配置
    |-- html                待填充静态页面
    |-- mock                模拟数据(暂时不用)
    |-- static              静态文件存放
    `-- src                 代码源文件存放
        |-- api           	定义ajax接口
        |-- assets          存放图片等文件
        `-- components      业务小型组件
            |-- navigation      导航组件
            |-- dataEntry       数据输入组件
            |-- dataDisplay     数据展示组件
            |-- feedback        反馈提示组件
        |-- modules         view组件
        |-- navigations     菜单和路由配置
        |-- store           vuex文件
        |-- admin.js        管理员后台js入口
        |-- Admin.vue       管理员后台vue入口
        |-- app.js          个人版js入口
        |-- App.vue         个人版vue入口
        |-- company.js      公司版js入口
        |-- Company.vue     公司版vue入口
        |-- root.js         登录注册js入口
        |-- Root.vue        登录注册vue入口
```

## about communal header

公共头部代码使用原生js书写，不需要依赖任何库

#### 使用

```html
<link rel="stylesheet" href="http://192.168.3.146:81/commonHeader.css">
<script src="http://192.168.3.146:81/js/commonHeader/commonHeader.js"></script>
```

#### 依赖
* window['ENDPOINT_URL'], 即ppbe的服务器地址

#### 说明

* 前端baseURL取值是引入的script标签的src；后端baseURL取值是打包时配置的endpoint值
* 输出两个js：一个是webpack默认打包方式的，依赖webpack，用于平台；另一个是umd打包，不需要任何依赖，可直接用于各应用

