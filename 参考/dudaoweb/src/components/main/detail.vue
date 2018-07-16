<template>
  <div class="ins-main-con">
    <div class="ins-header">
        <!-- 导航按钮 -->
        <div @mouseleave="openMenu(0)" @mouseenter="openMenu(1)"  class="ins-menu-btn">
            <a>全部导航<i class="ins-s-ml-10 el-icon-arrow-down"></i></a>
            <!-- 导航菜单 -->
            <div class="ins-nav-con">
                <nav-bar :menu="menu" :menuShow="menuShow" @context="test"></nav-bar>
            </div>
        </div>
        <!-- 学校logo -->
        <a class="ins-sch-logo">
            <img alt="" src="../../assets/images/logo.png"/>
            <span>{{schoolName?schoolName:'instai智慧校园'}}</span>
        </a>
        <!-- 首页 -->
        <a @click="jumpPage('/')" class="com_fl">首页</a>
        <!-- 快捷导航 -->
        <!-- <div class="ins-shortcut-nav" v-for="(item,key) in shortMenu" :key='key'>
            <el-cascader
            :options="item.children"
            v-model="selectedOptions" @change="jumpPage(selectedOptions[selectedOptions.length-1])">
            </el-cascader>
        </div> -->
        <!-- loading层 -->
        <!-- <div class="ins-loading">
            <span>
            </span>
            <img alt="" src="../../assets/images/loading.gif">
            </img>
        </div> -->
        <!-- 设置 -->
        <!-- <a class="ins-setting">
            <i class="el-icon-setting com_fc_f"></i>
        </a> -->
        <!-- 用户 -->
        <a class="ins-user com_fs_1" @click="showOpa=!showOpa">
            用户名：{{userName}}
        </a>
        <!-- 消息 -->
        <!-- <a class="ins-message">
            <i class="el-icon-message com_fc_f"></i>
        </a> -->
    </div>
    <ul :class="{'ins-show':showOpa}" class="ins-system-opa">
        <li @click="exitLogin()">退出登录</li>
    </ul>
    <div class="ins-s-sf ins-s-of-h">
        <!-- <div class="ins-main" :class="{'home':!(barNameArr&&barNameArr.length)}"> -->
            <!-- 面包屑导航 -->
            <!-- <div class="ins-page-title" v-if="barNameArr&&barNameArr.length">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item v-for="(item,key) in barNameArr" :key="key">{{item}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div> -->
            <transition name="slide-fade">
                <router-view>
                </router-view>
            </transition>
        <!-- </div> -->
    </div>
</div>
</template>
<script src="./js/detail.js"></script>