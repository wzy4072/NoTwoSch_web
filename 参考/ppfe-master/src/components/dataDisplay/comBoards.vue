<template>
    <div class="board" v-show="aeoInfo.show">
        <v-spin :spinning="spinning" tip='加载中'>
        </v-spin>
        <v-row class="tit">
            <span>我的单量：</span>
            <div class='tit-type' :class="{'tit-active':aeoShowType=='day'}" @click="aeoShowType = 'day'">
                日
                <div class="panel" v-show="aeoShowType=='day'"></div>
            </div>/
            <div class='tit-type' :class="{'tit-active':aeoShowType=='week'}"  @click="aeoShowType = 'week'">
                周
                <div class="panel" v-show="aeoShowType=='week'"></div>
            </div>/
            <div class='tit-type' :class="{'tit-active':aeoShowType=='month'}"  @click="aeoShowType = 'month'">
                月
                <div class="panel" v-show="aeoShowType=='month'"></div>
            </div>
            <span class="pull-right">单位：单</span>
        </v-row>

        <v-row class="bdy">

            <v-col :span="3" class="cl-once lis-total">
                <p>总单量</p>
                <span>{{aeoInfo[aeoShowType].total || 0}}</span>
            </v-col>
            <v-col :span="12" class="cl-once">
                <v-row class="lis-tit">
                    系统状态
                </v-row>
                <v-row class="lis-gray">
                    <v-col :span="6" class="lis">
                        <p>接单</p>
                        <span>{{aeoInfo[aeoShowType].jd || 0 }}</span>
                    </v-col>
                    <v-col :span="6" class="lis">
                        <p>审核</p>
                        <span>{{aeoInfo[aeoShowType].sh || 0 }}</span>
                    </v-col>
                    <v-col :span="6" class="lis">
                        <p>发送</p>
                        <span>{{aeoInfo[aeoShowType].fs || 0 }}</span>
                    </v-col>
                    <v-col :span="6" class="lis">
                        <p>完成</p>
                        <span>{{aeoInfo[aeoShowType].wc || 0 }}</span>
                    </v-col>
                </v-row>
            </v-col>
            <v-col :span="9" class="cl-once">
                <v-row class="lis-tit">
                    海关状态
                </v-row>
                <v-row class="err-lis">
                    <v-col :span="8" class="lis">
                        <p>查验</p>
                        <span>{{aeoInfo[aeoShowType].cy || 0 }}</span>
                    </v-col>
                    <v-col :span="8" class="lis">
                        <p>退单</p>
                        <span>{{aeoInfo[aeoShowType].td || 0 }}</span>
                    </v-col>
                    <v-col :span="8" class="lis">
                        <p>不接受</p>
                        <span>{{aeoInfo[aeoShowType].bsl || 0 }}</span>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>

</template>
<script>
import comapi from '@/api/company/common'
import tool from '@/api/tool';

export default {
    // components: {},
    data() {
        return {
            aeoInfo: {
                show: true,
                day: {},
                week: {},
                month: {},
                unit: '天'
            },
            aeoShowType: 'day',
            spinning: true,
        }
    },
    computed: {
        loginContext() {
            return this.$store.getters.loginContext == null ? { currentCorporate: null } : this.$store.getters.loginContext;
        }
    },
    created() {
        if (this.loginContext.currentCorporate) { 
            this.getBoardsInfo(); 
        } else {
            this.aeoInfo.show = false;  // console.log('没有当前公司，不查询')
        }
    },
    methods: {
        getBoardsInfo() {
            let _this = this;
            comapi.getBoardsInfo()
                .then(req => {
                    this.spinning = false;
                    if (req.success) {
                        // req.result.aeoInfo =  null;
                        if (req.result.aeoInfo) {
                            req.result.aeoInfo.show = true;
                            this.aeoInfo = req.result.aeoInfo;
                        } else {
                            this.aeoInfo.show = false;
                        }
                    } else { this.$message.info('获取信息失败！' + req.error); }
                })
                .catch(error => { this.$message.info('数据请求失败！' + error.message); });
        },
    },
}

</script>
<style scoped>
.board {
  border: 1px solid #e3e5e8;
  background: #fff;
  border-radius: 2px;
  font-size: 12px;
  position: relative;
  transition: all 0.3s;
  margin-bottom: 20px;
}
.board:hover {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  border-color: transparent;
}
.tit {
  margin: 0 30px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  border-bottom: 2px solid #acd9ee;
}

.tit .tit-type {
  position: relative;
  height: 100%;
  margin: 0 6px;
  display: inline-block;
  cursor: pointer;
  color:#aaa;
}
.tit .tit-active{
    color:#139bd4;
    font-weight: 600;
}
.panel {
  position: absolute;
  bottom: -6px;
  height: 0;
  width: 0;
  border: 4px solid #acd9ee;
  border-left: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}
.bdy {
  padding: 0 30px;
  font-size: 16px;
}
.cl-once {
  height: 164px;
  border-right: 1px solid #e3e5e8;
  text-align: center;
}
.lis-total {
  padding-top: 43px;
}
.bdy .lis-total > span {
    position: relative;
    top: 7px;
    font-size: 22px;
}
.cl-once .lis-tit {
  line-height: 50px;
  height: 50px;
  font-size: 16px;
  border-bottom: 1px solid #e3e5e8;
}
.lis-gray {
  background-color: #f8f8f8;
}
.cl-once .lis {
  height: 114px;
  padding-top: 30px;
  border-right: 1px solid #e3e5e8;
}

.cl-once .lis p {
  margin-bottom: 6px;
}
.lis-total span,
.cl-once .lis span {
  font-size: 18px;
  font-weight: 800;
  color: #119dd3;
}
.err-lis .lis span {
  color: #ff603f;
}
/* .cl-once .lis:not(:last-child) { */
.cl-once .lis:last-child {
  border-right: none;
}
/* 
.bdy{

}
.bdy .bdy-li{
        font-size: 14px;
    text-align: center;
           padding: 38px 0;
}
.bdy .bdy-li:nth-child(even) {
        background-color: #f5f5f5;
}
.bdy .bdy-li>p{
    line-height: 36px;
}
.bdy .bdy-li>span{
    line-height: 36px;
    color: #13A7EA;
    font-weight: 600;
    font-size: 17px;
} */
</style>