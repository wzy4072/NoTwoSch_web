<template>
  <div class="ins-s-sf" style="min-height: 680px;min-width: 1200px;padding-right: 2px;">
    <div class="ins-login-content">
        <div class="ins-content-left">
            <!-- <img alt src="static/images/login_icon.png"/> -->
            <img alt src="static/images/lg_icon.png"/>
        </div><div class="ins-content-right" :class="{'ins-show':showTable}">
            <!-- 待修改 -->
            <div class="loginfrom">
                <div style="padding: 0 40px">
                    <div class="ins-login-switch">
                        <span class="ins-s-hand ins-s-mr-5" :class="{'active':loginWay==1}" @click="loginWay=1">账号登录</span>
                        <span class="ins-s-hand" :class="{'active':loginWay==2}" @click="loginWay=2;showQrcode=false">扫码登录</span>
                    </div>
                    <!-- 账号密码登录 -->
                    <div v-show="loginWay==1">
                        <div style="margin-bottom:50px;height:256px;overflow:hidden;padding-top: 12px;">
                            <div class="ins-login-input" :class="{'ins-show':showQrcode}">
                                <!-- 账号密码登录 -->
                                <div class="ins-login-pc">
                                    <!-- 选择幼儿园 -->
                                    <el-select v-if="formData.loginType==1" :collapse-tags="true"  placeholder="请选择幼儿园" style="width:293px;margin-bottom:10px;" v-model="formData.loginCode" clearable>
                                        <el-option :key="key" :label="item.krtenName" :value="item.krtenCode" v-for="(item,key) in schoolList">
                                        </el-option>
                                    </el-select>
                                    <div  class="w_p100 ps_r thloainpassk" style="margin-bottom:20px;">
                                        <div class="ps_a thloginpass thloaginzh">
                                        </div>
                                        <input @keyup="keyup($event,'password')" autocomplete="off" class="formData-control" id="username" name="loginName" placeholder="请输入用户名" size="25" style="height:40px" tabindex="1" type="text" v-model="formData.loginName" value/>
                                    </div>
                                    <div class="w_p100 ps_r thloainpassk" style="margin-bottom: 20px;">
                                        <div class="thloginpass">
                                        </div>
                                        <input @keyup="keyup($event)" autocomplete="off" class="form-control password" id="password" name="password" placeholder="请输入密码" size="25" style="height:40px" tabindex="2" type="password" v-model="formData.password" value/>
                                    </div>
                                    <!-- <div class="verify">
                                        <div class="verify_box fl">
                                            <input class="input_box" maxlength="10" name="captcha" placeholder="请输入验证码" type="text"/>
                                            <input name="showCaptcha" type="hidden" value="true"/>
                                        </div>
                                        <div class="ver_img fl">
                                            <img src="static/images/captcha.jpg"/>
                                        </div>
                                    </div> -->
                                    <div class="re_password thlogincz">
                                        <div class="remember fl hand">
                                            <input class="magic-radio" id="cbRememberMe" name="checkbox" type="checkbox" v-model="selectred"/>
                                            <label for="cbRememberMe">
                                                记住密码
                                            </label>
                                            <input id="rememberMe" name="rememberMe" type="hidden" value="true"/>
                                        </div>
                                        <a class="fr hand" @click="forgetPwd">
                                            忘记密码?
                                        </a>
                                        <div class="cl ">
                                        </div>
                                    </div>
                                    <button @click="submit" class="thlbottom thlbottom1" style="margin-top: 20px;">登录</button>
                                </div>
                                <!-- 移动端关注 -->
                                <div class="ins-login-mb">
                                    <img src="../../assets/images/logcode.png" alt>
                                    <p>请用微信扫码</p>
                                    <p>关注督导系统服务号</p>
                                    <p>即可使用移动端功能</p>
                                </div>
                            </div>
                        </div>
                        <div class="thloginline">
                            <p @click="showQrcode=!showQrcode">移动端入口</p>
                        </div>
                    </div>
                    <!-- 扫码登录 -->
                    <div v-show="loginWay==2" style="height:310px;text-align: center;padding-top: 30px;">
                        <img src="../../assets/images/logcode.png" alt>
                        <p>请使用微信扫描二维码登录</p>
                    </div>
                    <!-- <div class="thloginline">
                        <p>
                            其他方式登陆
                        </p>
                    </div>
                    <div class="t_c" style="margin-top:20px;margin-top:20px;z-index: 9999 !important;position: relative;">
                        <a class="thloginqq" href="#">
                        </a>
                        <a class="thloginqq thloginwc">
                        </a>
                    </div> -->
                </div>
            </div>
            <div class="ins-right-con" v-show="!this.formData.loginType">
                <div @click="opaList()" class="ins-right-icon">
                    <span v-text="showTable?'隐藏':'显示'"></span>辖区幼儿园列表
                </div>
                <div class="ins-notice-list">
                    <div class="ins-table">
                        <!-- 表格标题-->
                        <div class="ins-title">
                            <span class="title-icon"><img src="../../assets/images/tab_title_icon.png" alt></span>
                            <span class="ins-s-fs-medium">盐田区教育局下辖幼儿园基本信息公示栏
                                </span>
                            <span v-show="!showDetails" class="ins-s-fr" style="margin-right: 8px;">共{{tableData.length}}所</span>
                            <el-button v-show="showDetails" class="ins-s-fr ins-s-pr" style="top:4px;"  size="small" @click="showDetails = !showDetails" icon="el-icon-back">返回</el-button>
                        </div>
                        <!-- 表格内容 + 详情 -->
                        <div class="ins-notice-all ins-tab-con" :class="{'active':showDetails}">
                            <!-- 表格内容 -->
                            <el-table :data="tableData" border height="100%" stripe>
                                <el-table-column align="center" label="幼儿园名称" prop="krtenName" sortable >
                                </el-table-column>
                                <el-table-column align="center" label="办学性质" prop="schoolNatrue" sortable  >
                                </el-table-column>
                                <el-table-column align="center" header-align="center" label="办学等级" prop="SCHOOL_LEVEL" show-overflow-tooltip sortable >
                                </el-table-column>
                                <el-table-column align="center" header-align="center" label="具体地址" prop="KRTEN_ADDR" show-overflow-tooltip sortable>
                                </el-table-column>
                                <el-table-column align="center" width="120" label="查看详情" >
                                    <template slot-scope="scope">
                                        <el-button icon="el-icon-tickets" plain size="mini" type="primary" @click="checkDetails(scope.row)">
                                            查看详情
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table><div class="ins-notice-details">
                                <div class="ins-details-item">
                                    <p>
                                        办学编码：
                                        <span v-text="detailsData.f"></span>
                                    </p>
                                    <div>
                                        <p class="ins-s-fl">
                                            办学性质：
                                            <span v-text="detailsData.schoolNatrue"></span>
                                        </p>
                                        <p class="ins-s-fr">
                                            办学等级：
                                            <span v-text="detailsData.SCHOOL_LEVEL"></span>
                                        </p>
                                        <div class="ins-s-cl"></div>
                                    </div>
                                    <div>
                                        <p class="ins-s-fl">
                                            占地面积：
                                            <span v-text="(detailsData.AREA_COVERED?detailsData.AREA_COVERED:'-')+' 平方米'"></span>
                                        </p>
                                        <p class="ins-s-fr">
                                            生均面积：
                                            <span v-text="(detailsData.STUDENT_AREA?detailsData.STUDENT_AREA:'-')+' 平方米/人'"></span>
                                        </p>
                                        <div class="ins-s-cl"></div>
                                    </div>
                                    <div>
                                        <p class="ins-s-fl">
                                            基础设置：
                                            <span v-text="detailsData.INFRASTRUCTURE"></span>
                                        </p>
                                        <p class="ins-s-fr">
                                            官方网站：
                                            <span v-text="detailsData.OFFICIAL_WEBSITE"></span>
                                        </p>
                                        <div class="ins-s-cl"></div>
                                    </div>
                                    <p>
                                        具体地址：
                                        <span v-text="detailsData.KRTEN_ADDR"></span>
                                    </p>
                                </div>
                                <div class="ins-details-item">
                                    <p>
                                        在职员工人数：
                                        <span v-text="(detailsData.f?detailsData.f:'-')+' 人'"></span>
                                    </p>
                                    <p>
                                        在任园长信息：
                                        <span>张三四（园长），王五六（副园长），田七八（副园长）</span>
                                    </p>
                                </div>
                                <div class="ins-details-item">
                                    <p>
                                        在职教师人数：
                                        <span>100人</span>
                                    </p>
                                    <p>
                                        优秀教师信息：
                                        <span>李四五（2018年深圳市优秀教师）</span>
                                    </p>
                                </div>
                                <div class="ins-details-item">
                                    <p>
                                        在校学生人数：
                                        <span>100人</span>
                                    </p>
                                    <p>
                                        在校班级情况：
                                        <span>大班（共2个班）；中班（共3个班）；小班（共4个班）；混龄班（共1个班）</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ins-stars1">
    </div>
    <div class="ins-stars2">
    </div>
    <div class="ins-stars3">
    </div>
    <!-- 底部备案号等信息 -->
    <div class="ins-login-bottom">
        <p class="thlogorownColor copyright">
            Copyright©2015-2018 Instai. All Rights Reserved.深圳英之泰教育科技有限公司 版权所有 粤ICP备15117556号-1
        </p>
        <p class="thlogorownColor contactInfo">
            联系电话:0755-33942929 | 企业邮箱:yw@instai.cn
        </p>
    </div>
</div>
</template>
<script src="./js/login.js"></script>


