<template>
    <div style="padding:30px;">

        <!-- 头像 信息 钱包 -->
        <v-row>
            <v-col span="7">
                <div style="background:#fff;padding:20px 0 0 20px;height:288px;    border-radius: 300px 0 0 300px;">
                    <head-avatar 
                    :id="personAvatar"
                    :name="personUsername"
                    ></head-avatar>
                    <!-- {{loginContext.person.avatar}} -->
                </div>
            </v-col>
            <v-col span="9" class="user-msg">
                <div class="msg-bodr">
                    <v-row class="user-na">
                        {{loginContext.person.name || '您的昵称未设置'}}<span>,您好！</span>
                    </v-row>
                    <v-row>
                            <!-- WEAK -->
                        <span class="prgrs">账号安全等级：</span><span :class="{'prost':true, 'lev-color':loginContext.person.passwordStrength == 'WEAK'}">{{getSafeGrade(loginContext.person.passwordStrength,'string')}}</span>
                        <v-progress-line :percent="getSafeGrade(loginContext.person.passwordStrength,'number')" :show-info="false"></v-progress-line>
                    </v-row>
                    <v-row class="prgrs">
                        <span class="prona">信息完善度：</span><span class="prost">{{parseFloat(loginContext.person.infoCompletion)}}%</span>
                        <v-progress-line :percent="parseFloat(loginContext.person.infoCompletion) || 0" :show-info="false"></v-progress-line>
                    </v-row>
                    <router-link to='/account/userinfo'><img class="setimg" style="display:block;" src="/static/images/home/set.png"></router-link>
                </div>
            </v-col>
            <v-col span="8">
                <head-nav :navInfo="navInfo"></head-nav>
            </v-col>
            <!-- <v-col span="6">
                <head-balance :balance="balance" walLink='account/wallet'></head-balance>
            </v-col> -->
        </v-row>
        <div class="interlayer"></div>
        <!-- 创建公司 公司状态 -->
        <v-row :gutter="48">
            <v-col span="14">
                <v-card title="公司信息初始化" class="card-init">
                    <div slot="extra">
                        <span><v-icon class="comnotice" type="question-circle"  @click.native="showComNotice=true"></v-icon></span>
                    </div>

                    <!-- 未创建 未加入 或 待审核 或 创建失败 -->
                    <v-row v-show="(applystatus == null || applystatus=='pending' || applystatus=='refuse' ) && !showComNotice " class="init-top">
                        <v-col :span="applystatus==null ? 12 : 24" class="card-part" v-show="applystatus==null || applyCompanyInfo.companyType == 'create'">
                            <img src="/static/images/home/createcompany.png" style="padding-top: 15px;" alt="创建公司">
                            <button class="_btn" @click="createCom" v-show="applystatus==null"  >创建公司</button>
                            <button class="_btn" @click="cancelCreate" v-show="applystatus!=null" >取消创建</button>
                           
                        </v-col>
                        <v-col  :span="applystatus==null ? 12 : 24" class="card-part" style="background-color:#f5f5f5;" v-show="applystatus==null || applyCompanyInfo.companyType != 'create'">
                            <img src="/static/images/home/joincompany.png" alt="加入公司">
                            <button class="_btn" @click="joinCom"  v-show="applystatus==null" >+加入公司</button>
                            <button class="_btn" @click="cancelJoin"  v-show="applystatus!=null" >取消加入</button>
                        </v-col>
                    </v-row>

                    <!-- 创建、加入成功 -->
                    <v-row v-show="applystatus=='pass' && !showComNotice " class="init-top">
                        <v-col :span="12" class="card-part"  >
                            <img src="/static/images/home/inviteStaff.png" style="padding-top: 15px;" alt="邀请员工">
                            <button class="_btn" @click="editStaffFlag=true" >邀请员工</button>
                            
                        </v-col>
                        <v-col  :span="12" class="card-part" style="background-color:#f5f5f5;" >
                            <img src="/static/images/home/intoCom.png" alt="进入企业">
                            <button class="_btn redbg" @click="vistiLink('/company/#/home')">进入企业</button>
                        </v-col>
                    </v-row>

                    <v-row v-show="showComNotice" class="init-but">
                        <p @click="showComNotice = false" class="closebt"> X</p>
                        <h2> 企业创建与加入的规则</h2>
                        <div class="but-msg">
                            <p> 1.每个普通会员只可以创建或加入一家企业；</p>
                            <p> 2.创建公司后，并且平台后台审核通过，会开通通关企业管理及应用；</p>
                            <p> 3.申请创建公司的合法性和真实性由创建人负责；</p>
                            <p> 4.一家企业只有一个创建人，已经开通的公司不可被重复创建；</p>
                            <p> 5.创建公司的个人默认为该企业的管理员；</p>
                            <p>7.如遇到问题请咨询平台开户顾问，微信号：23234432。</p>
                        </div>

                    </v-row>


                </v-card>
            </v-col>
            <v-col span="10">
                <!-- --------------尚未创建或加入------------------  -->
                <v-card title="个人公司状态" v-show="applystatus==null">
                    <div class="comstate"><img src="/static/images/home/no_com_message.png" alt="公司logo"><p>尚无公司信息</p></div>
                </v-card>
                <!-- --------------待审核------------------  -->
                <v-card title="个人公司状态" class='state-ds' v-show="applystatus=='pending'">
                    <div style="height:290px;">
                        <div class="logo-wrap"><img src="/static/images/home/headdefault.png" alt="公司logo"></div>
                        <div class="dsmsg-wrap">
                            <div><p class="tit">公司名称</p><p class="msg">{{applyCompanyInfo.name}}</p></div>
                            <div style="border-left:1px solid #666;"><p class="tit">审核状态</p><p class="msg" style="color:#03a1ea">待审核</p></div>
                        </div>
                    </div>
                </v-card>
                <!-- -------------通过审核-------------------  -->
                <v-card title="个人公司状态" class="state-ytg" v-show="applystatus=='pass'">
                    <div style="height:338px;">
                        <div class="logo-wrap"><img src="/static/images/home/headdefault.png" alt="公司logo"></div>
                        <div class="ytg-msg">
                            <div class="commsg" style="padding-left:16%;">
                                <div> <span> 公司名称：</span><span>{{applyCompanyInfo.name}}</span> </div>
                                <div> <span> 审核状态：</span><span style="font-size:18px;font-weight:800;color:#03a1ea">已通过</span>                                    </div>
                            </div>
                            <div class="commsg" style="text-align:left;border-left:1px solid #666;">
                                <div> <span v-show="applyCompanyInfo.hsCode != '' || applyCompanyInfo.hsCode != null "> 海关代码：{{applyCompanyInfo.hsCode}}</span>                                    </div>
                                <div> <span v-show="applyCompanyInfo.creditCode != '' || applyCompanyInfo.creditCode != null "> 信用等级代码：{{applyCompanyInfo.creditCode}}</span>                                    </div>
                                <div> <span v-show="applyCompanyInfo.corporateMark != null "> 企业ID：{{applyCompanyInfo.corporateMark}}</span>                                    </div>
                            </div>
                        </div>
                    </div>
                </v-card>
                <!-- ---------------未通过审核-----------------  -->
                <v-card title="个人公司状态" class="state-ytg" v-show="applystatus=='refuse'">
                        <div style="height:338px;">
                            <div class="logo-wrap">
                                <img src="/static/images/home/headdefault.png" alt="公司logo">
                            </div>
                            <div class="ytg-msg">
                                <div class="commsg" style="padding-left:16%;">
                                    <div> <span> 公司名称：</span><span>{{applyCompanyInfo.name}}</span> </div>
                                    <div> <span> 审核状态：</span>
                                        <span style="font-size:16px;color:#FF513D;cursor:pointer;"  
                                        @click="editCom" v-show="applystatus !='pass'"
                                        ><v-icon type="edit"></v-icon>未通过</span>  
                                    </div>
                                </div>
                                <div class="commsg" style="text-align:left;border-left:1px solid #666;">
                                    <div> <span v-show="applyCompanyInfo.hsCode != '' || applyCompanyInfo.hsCode != null "> 海关代码：{{applyCompanyInfo.hsCode}}</span>                                    </div>
                                    <div> <span v-show="applyCompanyInfo.creditCode != '' || applyCompanyInfo.creditCode != null "> 信用等级代码：{{applyCompanyInfo.creditCode}}</span>                                    </div>
                                    <div> <span v-show="applyCompanyInfo.corporateMark != null "> 企业ID：{{applyCompanyInfo.corporateMark}}</span>                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-card>


            </v-col>
        </v-row>
        <div class="interlayer"></div>
        <!-- 客服顾问 -->
        <v-row>
            <contact-way></contact-way>
        </v-row>

        <!-- 创建公司 -->
        <create-com :showCreate="showCreateCom" :isEdit="isEdit" @cancel="showCreateCom = false" @ok="createSuc"></create-com>

        <!-- 加入公司 -->
        <v-modal title="加入公司" closable :width="690" :visible="joinComFlag" @cancel="joinComFlag=false">
            <div>
                <v-form direction="horizontal" :model="joinInfo" :rules="joinRules" ref="joinInfo">
                    <v-form-item label="企业名称 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="name">
                        <v-input size="large" v-model="joinInfo.name"></v-input>
                    </v-form-item>
                    <v-form-item label="企业ID " :label-col="labelCol" :wrapper-col="wrapperCol" prop="corporateMark">
                        <v-input size="large" v-model="joinInfo.corporateMark"></v-input>
                    </v-form-item>
                    <v-form-item label="真实姓名 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="relName">
                            <v-input size="large" v-model="joinInfo.relName"></v-input>
                    </v-form-item>

                    <v-form-item label="备注 " :label-col="labelCol" :wrapper-col="wrapperCol" prop="mark">
                        <v-input size="large" v-model="joinInfo.mark"></v-input>
                    </v-form-item>

                </v-form>
            </div>
            <div slot="footer">
                <button class="_btn" @click="ensureJoin('joinInfo')">确 定</button>
            </div>
        </v-modal>

        <!-- 邀请员工 -->
         <edit-modal 
         :modalTitle="modalTitle" 
         :editStaffFlag="editStaffFlag" 
         :staffInfo="selectStaffInfo" 
         @saveSuc="ensureInvite" 
         @cancelSave="editStaffFlag=false"
         ></edit-modal>


        <!-- 创建公司申请提交成功 -->
        <msg-model src='/static/images/home/alreadySubmit.png' title='创建公司！' msgTitle="已经提交审核！" msg='请保持电话的畅通，我们正在赶往联系您的路上！' :showFlag="createComState"
            @ensreClick="createComState=false">
        </msg-model>

        <!-- 加入公司申请 提交成功 -->
        <msg-model src='/static/images/home/alreadySubmit.png' title='加入公司' msgTitle="已经提交申请！" msg='请保持电话的畅通，我们正在赶往联系您的路上！' :showFlag="joinComState"
            @ensreClick="joinComState=false">
        </msg-model>


    </div>
</template>


<script>
    import msgModel from '@/components/msgModel.vue';
    import contactWay from '@/components/dataDisplay/contactWay.vue';
    import createCom from '@/components/dataEntry/createCom.vue'

    import headAvatar from '@/components/dataDisplay/headAvatar.vue'
    import headNav from '@/components/dataDisplay/headNav.vue'
    // import headBalance from '@/components/dataDisplay/headBalance.vue'
    import editStaffModal from '@/components/dataEntry/staffEdit.vue';


    import perapi from '@/api/person/common';
    import comapi from '@/api/company/common';

    import payapi from '@/api/pay';

    // 头像
    import api from '@/api/person.js';
    import avatar from '@/components/avatar.vue'

    export default {
        components: {
            'msgModel': msgModel,
            'avatar': avatar,
            'contactWay': contactWay,
            'headAvatar': headAvatar,
            'headNav': headNav,
            // 'headBalance': headBalance,
            'createCom': createCom,
            'editModal':editStaffModal,
        },

        data() {
            return {
                navInfo: { 
                    msgName: '消息', msgCount: 8, 
                    guideName: '指南',guideLink:'https://mp.weixin.qq.com/s?__biz=MjM5MTUzMDI3NA==&mid=2662090561&idx=1&sn=095cb2375da020ed80f66672eff25f50&chksm=bdeccb0c8a9b421ab34896fd2e11b2e50793dee5d21d3ef2d151d30a01995186c053a4e0c0d1&scene=0&key=3be1498843ffb2f57ba5d483cfc583cd05677a9c800d067bfe192d57ca0f4661b46cc9843a65d1332a975dc0781f18502d469048f1d9010cf7b937d6311a5a17e3cdec35534fecd200ed82599de4067d&ascene=0&uin=MjY5Mzc2MzM2MA%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.11.4+build(15E65)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=04dAMBlZmc%2BZ53z52zOYcr1%2BQNJOrYqYeYoEIHgGYBIzfVKeLFuZWGV470c8zi6U',
                    searchName: '查询',searchLink:'http://www.yunbaoguan.cn/Yunbaike/HSsearch.html',
                    comName: '公司',comLink: '/company/#/home'
                },
                // balance: null,
                // 头像
                person: { name: "" },
                isEdit: false,

                showCreateCom: false,
                //创建公司规则
                noticeShowFlag: false,
                createComState: false,

                //加入公司
                joinComFlag: false,
                joinComState: false,
                joinInfo: { contactsName: "", corporateMark: "", mark: '' },
                joinRules: {
                    name: [{ required: true, message: '必填信息' }],
                    corporateMark: [{ required: true, message: '必填信息' }],
                    relName: [{ required: true, message: '必填信息' }],
                },

                //创建公司 加入公司说明
                showComNotice: false,

                // 公司审核状态
                applystatus: null,
                applyCompanyInfo: {},
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },

                //邀请员工
                modalTitle:'邀请员工',
                editStaffFlag:false,
                selectStaffInfo:{},
            }
        },
        computed: {
            loginContext() {
                return this.$store.getters.loginContext == null ? { currentCorporate: '', person: '' } : this.$store.getters.loginContext;
            },
            
            personAvatar(){
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.person.avatar;
            },
            personUsername(){
                return this.$store.getters.loginContext == null ? 'Img' : this.$store.getters.loginContext.person.username;
            },
            personWalletId() {
                return this.$store.getters.loginContext == null ? null : this.$store.getters.loginContext.person.walletId
            }
        },
        // watch: {
        //     personWalletId() {
        //         this.getBalancce();
        //     }
        // },
        created() {
            // this.getBalancce();
            this.getVrifyStatus();
            let _this = this;
        },
        methods: {
            //加入公司
            joinCom() {
                this.joinComFlag = true;
                this.joinInfo = { name: "", corporateMark: "" };
            },
            //确认加入
            ensureJoin(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        comapi.joinCompany(_this.joinInfo).then(
                            req => {
                                if (req.success) {
                                    this.$message.info('请求成功！');
                                    _this.joinComState = true;
                                    _this.joinComFlag = false;
                                    //刷新公司状态
                                    this.getVrifyStatus();
                                } else {
                                    this.$message.info('数据请求失败！' + req.message);
                                }
                            })
                            .catch(message => {
                                _this.$message.info('数据请求失败！' + message);
                            });
                    } else {
                        _this.$message.info('数据验证未通过，请重新填写！');
                        return false;
                    }
                });
            },
            //公司创建成功
            createSuc() {
                this.showCreateCom = false;
                this.createComState = true;
                this.getVrifyStatus(); //刷新公司显示的状态
            },
            createCom() { this.isEdit = false; this.showCreateCom = true; },
            editCom() {
                let _this = this;
                comapi.getComList()
                .then(req=>{
                    if(req.length >0 ){ 
                        //有公司 表示 是创建公司的编辑
                        _this.isEdit = true; this.showCreateCom = true;
                    }else{
                        //表示 是加入公司 的编辑 
                        _this.$message.info('您的申请被拒绝了！',4);
                    };
                })
                .catch(message => { _this.$message.info('数据请求失败！' + message); });
                },

            getSafeGrade(val, stringName) {
                let vals;
                val = val || '没有值';
                switch (val) {
                    case 'WEAK': vals = { name: "低", val: 30 }; break;
                    case 'MEDIUM': vals = { name: "中", val: 60 }; break;
                    case 'STRONG': vals = { name: "高", val: 90 }; break;
                    default: vals = { name: "未查到结果", val: 0 }; break;
                }
                if (stringName == 'string') {
                    return vals.name;
                } else {
                    return vals.val;
                }
            },
            // 公司审核情况
            getVrifyStatus() {
                comapi.applystatus()
                    .then(resp => {
                        if (resp.success) {
                            if (resp.result.length == 0) { this.applystatus = null; } else {
                                this.applystatus = resp.result[resp.result.length - 1].isPending;
                                this.applyCompanyInfo = resp.result[resp.result.length - 1];
                            }
                        } else { this.$message.info('数据请求失败！' + resp.error, 4); }
                    })
                    .catch( error => { this.$message.info('请求失败！' + error.message, 4); });
            },
            // getBalancce() {
            //     if(this.loginContext.person.walletId == null ){ return false;}
            //     payapi.getBalancce({ walletId: this.loginContext.person.walletId })
            //         .then(req => { this.balance = req; })
            //         .catch(message => { this.$message.info('数据请求失败！' + message); });
            // },
            cancelCreate(){
                //当只允许创建一个公司，id默认取最后一个
                if(!this.applyCompanyInfo.corporateid) return false;
                comapi.cancelCreate(this.applyCompanyInfo.corporateid)
                    .then(resp => {
                        if (resp.success) {
                            //解绑成功，刷新公司创建/加入情况
                            this.$message.info(resp.message);
                            this.getVrifyStatus();
                         } else { this.$message.info('数据请求失败！' + resp.error, 4); }
                    })
                    .catch(error => { this.$message.info('请求失败！' + error.message, 4); });
            },
            cancelJoin(){
                comapi.cancelJoin()
                    .then(resp => {
                        if (resp.success) {
                            //解绑成功，刷新公司创建/加入情况
                            this.$message.info(resp.message);
                            this.getVrifyStatus();
                         } else { this.$message.info('数据请求失败！' + resp.error, 4); }
                    })
                    .catch(error => { this.$message.info('请求失败！' + error.message, 4); });
            },
            vistiLink(href){ if(href == ''){ return false; }  else{  window.location.href=href; } },
            //邀请员工
            ensureInvite(){
                this.editStaffFlag = false;
            }
        },
    }

</script>
<style scoped>
    @import '/static/css/common.css';
    @import '/static/css/modal.css';

.redbg{
    background-color:#FF513D;
}
    .user-msg {
        padding: 35px;
        background-color: #fff;
        padding: 20px;
        padding-left: 0;
        height: 288px;
    }

    .user-msg .msg-bodr {
        height: 100%;
        position: relative;
        padding: 14px 44px;
        border: 1px solid #ccc;
        border-left: none;
    }

    .user-msg .msg-bodr .setimg {
        position: absolute;
        right:  -1px;
        bottom:  -1px;
    }

    .user-msg .user-na {
        font-size: 28px;
        margin: 15px 0;
        text-align: center;
    }

    .user-msg .user-na span {
        font-size: 16px;
    }

    .prgrs {
        padding: 8px 0;
    }

    .card-init .card-part {
        text-align: center;
        padding-top: 36px;
        height: 100%;
    }

    .card-init .init-top {
        height: 338px;
    }

    .card-init .card-part img {
        margin-bottom: 20px;
    }

    .card-init .init-but {
        padding: 35px;
    }

    .card-init .init-but .but-msg p {
        font-size: 16px;
        padding: 8px 0;
    }

    .comnotice {
        margin-right: 8px;
        cursor: pointer;
        font-size: 16px;
    }

    .init-but>p {
        font-size: 30px;
        text-align: right;
        margin-bottom: -48px;
        line-height: 0px;
        height: 36px;
        cursor: pointer;
    }

    .logo-wrap {
        padding: 16px 0;
        background-color: #fff;
    }

    .logo-wrap>img {
        display: block;
        height: 150px;
        width: 150px;
        margin: 0 auto;
        border: 1px solid #F5F5F5;
        border-radius: 100%;
    }

    .comstate {
        height: 290px;
    }

    .comstate>img {
        display: block;
        margin: 0 auto;
        padding-top: 60px;
    }

    .comstate>p {
        text-align: center;
        color: #dcdcdc;
        font-size: 14px;
    }
    /* 间隔高度 */

    .interlayer {
        height: 30px;
    }


    .qukenav {
        height: 40px;
        width: 40px;
        background-size: cover;
        background: no-repeat url('/static/images/home/headqukenav.png');
        cursor: pointer;
    }



    .state-ds .dsmsg-wrap {

        width: 300px;
        background-color: #f5f5f5;
        padding: 15px;
        margin: 0 auto;
        margin-top: 8px;
    }

    .state-ds .dsmsg-wrap>div {
        width: 49%;
        display: inline-block;
        vertical-align: top;
    }

    .state-ds .dsmsg-wrap>div p {
        text-align: center;
        font-family: '黑体';
        font-size: 18px;
        margin: 4px 0;
    }

    .state-ds .dsmsg-wrap>div p.tit {
        color: #999;
    }

    .state-ds .dsmsg-wrap>div p.msg {
        font-weight: 800;
        color: #666;
        font-size: 20px;
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .commsg {
        display: inline-block;
        width: 49%;
        vertical-align: top;
        padding: 0 20px;
        font-size: 16px;
        text-align: left;
    }

    .commsg>div {
        margin: 8px 0;
    }

    .ytg-msg {
        padding-top: 30px;
    }
</style>
<style>

.card-init  .ant-card-extra{
    position: absolute;
    right: 20px;
    /* top: 16px; */
}

    .card-init .ant-card-head-title{
        height: 100%;
    }
    .card-init .ant-card-body {
        padding: 0px;
        height: 338px;
    }
    /*审核通过*/

    .state-ytg .ant-card-body {
        padding: 0;
        background: #f5f5f5;
    }
    .lev-color{
        color:#FF513D;
    }
</style>