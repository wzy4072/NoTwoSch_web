<template>
    <div style="padding:30px 50px;">
        <v-spin :spinning="spinning" tip="正在读取数据">
            <v-card title="公司操作">
                <v-row>
                    <searchers :searchOptions="searchOptions" v-on:searchOutput="SearchCompanys"></searchers>
                </v-row>
                <br>
                <v-row>
                    <v-select multiple :data="industryOptions" 
                              placeholder="请选择行业属性"
                              :value="industrySearch"
                              style="width: 300px;"
                    ></v-select>
                    <v-date-picker range 
                                   v-model="LoginRangeDate" 
                                   placeholder="请输入统计的时间范围" 
                                   format="yyyy-MM-dd"
                                   style="width: 300px;"
                    ></v-date-picker>
                </v-row>
                <br>
                <v-row>
                    <v-col>
                        <v-data-table ref="companyTable" :data='companyList' :columns='columns' :page-num="pageNo" :page-size="pageSize" :current-data.sync='currentData'>
                            <template slot="th" slot-scope="props">
                                <strong v-if="props.column.field=='operate'">操作</strong>
                                <strong v-else v-html="props.title"></strong>
                            </template>
                            <template slot="td" slot-scope="props">
                                <div v-if="props.column.field=='operate'">
                                    <v-button type="ghost" icon="edit" @click="check(props)">
                                        <span>审核</span>
                                    </v-button>
                                    <v-button type="ghost" icon="edit" @click="certificate(props)">
                                        <span>认证</span>
                                    </v-button>
                                    <v-button type="ghost" @click="lookRecharge(props)">
                                        <span>充值记录</span>
                                    </v-button>
                                    <v-button type="ghost" @click="lookExpenses(props)">
                                        <span>消费记录</span>
                                    </v-button>
                                </div>
                                <div v-else-if="props.column.field=='operationCounts'">
                                    <span v-if="props.content !=null " v-for="opt in props.content" :key="opt.operation">
                                        <a href="javascript:void(0)" @click="showDetails(opt.corporateId)">{{opt.operation == 'Login' ? '登录次数': opt.operation}}: {{opt.countValue}}</a>
                                    </span>
                                    <span v-else>
                                       
                                    </span>
                                </div>
                                <span v-else-if="props.column.field=='createdAt'" v-text="timestampToDateTime(props.content)"></span>
                                <span v-else-if="props.column.field=='isPending'" v-text="ispendingTotext(props.content)"></span>
                                <span v-else-if="props.column.field=='customArea'" v-text="customAreaTotext(props.content)"></span>
                                <span v-else-if="props.column.field=='industry'" v-text="industryTotext(props.content)"></span>

                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

            </v-card>
        </v-spin>

        <v-modal title="审核" okText="确定结果" :visible="checkModalShow" @ok="confirmCheckState" @cancel="hideCheckModal">
            <ul class="companyInfos">
                <li v-for="(value, key) in checkCompanyInfos" :key="value">
                    <v-row>
                        <v-col :md="6">{{ companyInfoTitelMap(key) }} ：</v-col>
                        <v-col :md="6">{{ companyInfoValueMap(key, 'check') }}</v-col>
                    </v-row>
                </li>
            </ul>
            <br>
            <v-row>
                <v-col>
                    <v-button @click="temporaryAgree(checkCompanyInfos)">
                        <span>同意申请</span>
                    </v-button>
                    <v-button @click="temporaryRefuse(checkCompanyInfos)">
                        <span>拒绝申请</span>
                    </v-button>
                </v-col>
            </v-row>
            <br>
            <v-row>
                <v-col>
                    拒绝原因：
                    <v-input placeholder="拒绝原因(选填，不超过100字)" v-model="checkCache.reason"></v-input>
                </v-col>
            </v-row>
            <br>
            <v-row>
                <v-col>
                    您已暂存id为
                    <span class="bg-primary">{{checkCache.id}}</span> 公司的审核状态为 ：
                    <span class="bg-error">{{checkCache.text}}</span>
                </v-col>
            </v-row>
        </v-modal>
        <v-modal title="认证" okText="确定结果" :visible="certificateModalShow" @ok="confirmCertificateState" @cancel="hideCertificateModal">
            <ul class="companyInfos">
                <li v-for="(value, key) in certificateCompanyInfos" :key="value">
                    <v-row>
                        <v-col :md="6">{{ companyInfoTitelMap(key) }} ：</v-col>
                        <v-col v-if="key=='businessLicense'" :md="6">
                            <div>
                                <!--<extavatar username="null" :src="businessLicenseImgSrc"></extavatar>-->
                                <img :src="businessLicenseImgSrc" alt="" style="width: 150px;height: 100px;">
                            </div>
                        </v-col>
                        <v-col v-else :md="12">{{ companyInfoValueMap(key, 'certificate') }}</v-col>
                    </v-row>
                </li>
            </ul>
            <br>
            <v-row>
                <v-col>
                    <v-button @click="temporaryCertAgree(certificateCompanyInfos)">
                        <span>同意申请</span>
                    </v-button>
                    <v-button @click="temporaryCertRefuse(certificateCompanyInfos)">
                        <span>拒绝申请</span>
                    </v-button>
                </v-col>
            </v-row>
            <br>
            <v-row>
                <v-col>
                    拒绝原因：
                    <v-input placeholder="拒绝原因(选填，不超过100字)" v-model="certificateCache.reason"></v-input>
                </v-col>
            </v-row>
            <br>
            <v-row>
                <v-col>
                    您已暂存id为
                    <span class="bg-primary">{{certificateCache.id}}</span> 公司的认证状态为 ：
                    <span class="bg-error">{{certificateCache.text}}</span>
                </v-col>
            </v-row>
        </v-modal>

        <consume-list :optionsEntry="optionsEntry" v-on="optionsEntry"></consume-list>

        <v-modal title="统计明细" :visible="loginDetailModalShow" @ok="loginDetailModalShow=false" @cancel="loginDetailModalShow=false">
            <v-data-table ref="detailTable" :data='loadActivityData' :columns='activityColumns'>
                <template slot="td" slot-scope="props">
                    <span v-if="props.column.field=='happenedAt'">{{timestampToDateTime(props.content)}}</span>
                    <span v-else v-html="props.content"></span>
                </template>
            </v-data-table>
        </v-modal>
    </div>
</template>
<script>
import api from '@/api/admin/company.js';
import comapi from '@/api/company/common';

import timestampApi from '@/api/tool.js';
// 省、市、行业的名字和数值对应列表
import dataMap from '@/api/cityList.js';
// 在admin中不能直接使用组件里avatar的api，故另起灶炉
import Avatar from 'vue-avatar/dist/vue-avatar.min.js';
import consumeList from '@/components/feedback/consumeList.vue';
import searchers from '@/components/dataEntry/adminHeadSearchers.vue';

export default {
    components: {
        extavatar: Avatar.Avatar,
        consumeList: consumeList,
        searchers: searchers,
    },
    data() {
        return {
            spinning: false,
            // 传入搜索器的配置项
            searchOptions: {
                show: false,
                caller: "person",
                searchers: [
                    {
                        type: "date",
                        name: "rangeDateSelect"
                    },
                    {
                        type: "input",
                        placeHolder: "企业名称",
                        name: "companyNameSelect"
                    },
                    {
                        type: "select",
                        // select的展示值，从后台获得
                        labels: [],
                        name: "approvalStateSelect"
                    },
                ]
            },
            // 搜索器的输出项
            searchOutput: {
                approvalStateSelect: '',
                companyNameSelect: "",
                rangeDateSelect: ['', ''],
            },
            // 行业多选框搜索结果
            industrySearch: [],
            LoginRangeDate: ["", ""],

            checkModalShow: false,
            checkCompanyID: "",
            checkCompanyInfos: {},
            checkCache: {
                id: "",
                state: null,
                text: "",
                reason: ""
            },

            certificateModalShow: false,
            certificateCompanyID: "",
            certificateCompanyInfos: {},
            certificateCache: {
                id: "",
                state: null,
                text: "",
                reason: ""
            },
            // 营业执照图片src
            businessLicenseImgSrc: "",

            approvalStateMap: {},
            currentData: [],
            pageNo: 1,
            pageSize: 10,
            columns: [
                //                    {title:"公司id",field:'id'},
                { title: "企业名称", field: 'corporateName' },
                { title: "企业联系人", field: 'contactsName' },
                { title: "联系人手机", field: 'contactsMobile' },
                { title: "企业座机", field: 'contactsTel' },
                { title: "18位信用代码", field: 'creditCode' },
                { title: "常用申报关区", field: 'customArea' },
                { title: "海关代码", field: 'hsCode' },
                { title: "所属行业", field: 'industry' },
                { title: "状态", field: 'isPending' },
                { title: "企业地址", field: 'address' },
                { title: "申请时间", field: 'createdAt' },
                { title: "统计", field: 'operationCounts' },
                { title: "操作", field: 'operate' },
            ],
            activityColumns:[
                { title: "登录时间", field: 'happenedAt' },
                { title: "登录IP", field: 'ip' },
                { title: "登录人", field: 'operatedBy' },
                { title: "备注", field: 'comment' },
            ],
            currentCorporate:null,
            // 传入金额记录（充值或消费记录）弹出框的配置项
            optionsEntry: {
                // 钱包id
                walletId: "",
                // 使用者，是个人版还是公司版 person/company
                user: "",
                // 查询的是充值还是消费记录 recharge/expenses
                flag: "",
                // 显示与否
                isShow: false,

            },
            industryOptions: [
                { value: '0', label: '报关行' },
                { value: '1', label: '货代' },
                { value: '2', label: '供应链' },
                { value: '3', label: '电商' },
                { value: '4', label: '工厂' },
                { value: '5', label: '物流' },
                { value: '6', label: '贸易公司' },
                { value: '7', label: '仓库' },
            ],
            loginDetailModalShow: false,
        }
    },
    created() {
        /**
         * 创建页面的时候获得审核状态的对应map和插入select的数据数组
         *
         */
        api.getApprovalStateMap()
            .then(resp => {
                if (resp.success === true) {
                    var map = {}
                    var temp = [];
                    for (var key in resp.result) {
                        map[key] = resp.result[key];
                        temp.push({
                            value: key,
                            label: resp.result[key]
                        });
                    }

                    this.approvalStateMap = map;
                    this.searchOptions.searchers[2].labels = temp;
                    this.searchOptions.show = true;
                } else {
                    this.$message.error(resp.error);
                }
            })
            .catch(e => {
                this.$message.error(e);
            })
    },
    computed: {
        provinceList() {
            var provinceArr = dataMap.getProData();
            var list = {};
            for (var i = 0; i < provinceArr.length; i++) {
                if (!provinceArr[i].value) {
                    continue;
                }
                list[provinceArr[i].value + ""] = provinceArr[i].label;
            }
            return list;
        },
        cityList() {
            var cityArr = dataMap.getCityData();
            var list = {};
            for (var i = 0; i < cityArr.length; i++) {
                if (!cityArr[i].value) {
                    continue;
                }
                list[cityArr[i].value + ""] = cityArr[i].label;
            }
            return list;
        },
        // 行业类型列表
        industryTypeList() {
            var industryTypeArr = dataMap.getIndustryType();
            var list = {};
            for (var i = 0; i < industryTypeArr.length; i++) {
                list[industryTypeArr[i].value + ""] = industryTypeArr[i].label;
            }
            console.log(list);
            return list;
        },
        // 行业列表
        industryList() {
            var industryArr = dataMap.getIndustryData();
            var list = {};
            for (var i = 0; i < industryArr.length; i++) {
                list[industryArr[i].value + ""] = industryArr[i].label;
            }
            return list;
        },
    },
    watch: {

    },
    methods: {
        /**
         * 返回公司列表
         * @NOTE query不写在data里的原因是后台限制没有搜索项就不能传query下的对应的个对象
         * @param prams
         * @returns {Promise<T>|Promise.<T>|Promise<TResult|T>}
         *
         */
        companyList(prams) {
            var ispending = this.searchOutput.approvalStateSelect || null;

            var corporateName = this.searchOutput.companyNameSelect || null;

            var screat = this.searchOutput.rangeDateSelect ? this.searchOutput.rangeDateSelect[0].replace(/\//g, "-") : null;
            var ecreat = this.searchOutput.rangeDateSelect ? this.searchOutput.rangeDateSelect[1].replace(/\//g, "-") : null;
            /*
            * {industries:["0","1"],loginCriteria:{enable:true,from:"2016-12-12",to:"2016-12-15",}}
            * */
            var industries = this.industrySearch;
            var LoginRangeDate = this.LoginRangeDate;
            var loginCriteria = {
                enable:false,
                from:"",
                to:""
            }
            var query = [];
            
            if (ispending) {
                query.push({
                    "column": "is_pending",
                    "filterRange": ispending,
                    "operat": "="
                })
            };
            if (corporateName) {
                query.push({
                    "column": "name",
                    "filterRange": corporateName,
                    "operat": "like"
                })
            };
            if (screat) {
                query.push({
                    "column": "created_at",
                    "filterRange": screat,
                    "operat": ">="
                })
            };
            if (ecreat) {
                query.push({
                    "column": "created_at",
                    "filterRange": ecreat,
                    "operat": "<="
                })
            };
            if(LoginRangeDate[0] != "") {
                loginCriteria.enable = true;
                loginCriteria.from = LoginRangeDate[0];
                loginCriteria.to = LoginRangeDate[1];
            }else {
                loginCriteria.enable = false;
            }
            
            var result = api.getCompanyList({
                "query": query,
                "pageNo": prams.pageNo,
                "pageSize": prams.pageSize,
                "sort": {},
                "industries": this.industrySearch,
                "loginCriteria": loginCriteria
            })
                .then(resp => {
                    if (resp.success === true) {
                        return resp.result
                    } else {
                        this.$message.error(resp.error);
                    }
                })
                .catch(e => { this.$message.error(e) })
            return result;
        },
        ispendingTotext(state) {
            var map = this.approvalStateMap;
            return map[state] ? map[state] : state;
        },
        timestampToDate(timestamp) {
            return timestampApi.epochToDateTime(timestamp);
        },
        timestampToDateTime(timestamp) {
            return timestampApi.epochToSecondTime(timestamp);
        },
        customAreaTotext(areaNo) {
            let resault = comapi.getCustomLabel(areaNo);
            return resault == null ? ' ' : resault;
        },
        industryTotext(val){
            for (var i =0;i<this.industryOptions.length;i++){
                if(this.industryOptions[i].value == val){
                    return this.industryOptions[i].label;
                }
            }
        },
        refreshTable() {
            this.$refs.companyTable.refresh();
        },
        companyInfoTitelMap(key) {
            var map = {
                corporateName: "企业名称",
                creditCode: "18位信用代码",
                isPending: "状态",
                operate: "操作",
                createdAt: "创建时间",
                hsCode: "海关代码",
                industryType: "行业类型",
                industry: "行业",
                nature: "企业性质",
                province: "省",
                city: "市",
                businessLicense: "营业执照"

            }
            return map[key] ? map[key] : key;

        },
        /**
         * 将不同类型的值转换成应该显示的内容
         * @NOTE
         * @param key 字段名
         * @param flag 判断是审核在调用还是认证在调用
         * @returns {*}
         */
        companyInfoValueMap(key, flag) {
            var infos;
            if (flag === "check") {
                infos = this.checkCompanyInfos;
            } else if (flag === "certificate") {
                infos = this.certificateCompanyInfos;
            } else {
                return
            }

            switch (key) {
                case "isPending":
                    return this.ispendingTotext(infos.isPending);
                case "createdAt":
                    return this.timestampToDate(infos.createdAt);
                case "city":
                    return this.cityList[infos.city];
                case "province":
                    return this.provinceList[infos.province];
                case "industry":
                    return this.industryList[infos.industry];
                case "industryType":
                    return this.industryTypeList[infos.industryType];
                default:
                    return infos[key];
            }

        },

        SearchCompanys(searchOutput) {
            this.searchOutput = searchOutput;
            this.$refs.companyTable.reload();
        },

        check(prop) {
            this.spinning = true;
            api.getCheckInfo(prop.item.id)
                .then(resp => {
                    if (resp.success === true) {
                        this.spinning = false;
                        this.checkCompanyInfos = resp.result;
                        this.checkModalShow = true;
                    } else {
                        this.$message.error(resp.error);
                    }

                })
                .catch(e => {
                    this.$message.error(e)
                })
        },
        hideCheckModal() {
            this.checkModalShow = false;
            this.checkCache = {
                id: "",
                state: null,
                text: "",
                reason: ""
            }
        },
        temporaryAgree(companyInfo) {
            this.checkCache.id = companyInfo.id;
            this.checkCache.state = true;
            this.checkCache.text = "通过";
        },
        temporaryRefuse(companyInfo) {
            this.checkCache.id = companyInfo.id;
            this.checkCache.state = false;
            this.checkCache.text = "拒绝";
        },
        confirmCheckState() {
            api.sendCheckApproval(this.checkCache.id, this.checkCache.state, this.checkCache.reason)
                .then(resp => {
                    if (resp.success === true) {
                        console.log(1);
                        this.$message.success(resp.message, 5);
                        this.hideCheckModal()
                        this.$refs.companyTable.reload();
                    } else {
                        this.$message.error(resp.error, 5);
                    }

                })
                .catch(e => { this.$message.error(e) })
        },

        certificate(prop) {
            //                this.spinning = true;
            api.getCertificateInfo(prop.item.id)
                .then(resp => {
                    if (resp.success === true) {
                        this.certificateCompanyInfos = resp.result;
                        this.certificateModalShow = true;
                        // 获取图片
                        if (!resp.result.businessLicense) {
                            return
                        }
                        api.loadImgData(resp.result.businessLicense)
                            .then(data => {
                                this.spinning = false;
                                this.businessLicenseImgSrc = data;
                            })
                            .catch(e => {
                                console.log(e);
                                this.$message.error(e)
                            })
                    } else {
                        this.$message.error(resp.error);
                    }

                })
                .catch(e => {
                    this.$message.error(e)
                })
        },
        hideCertificateModal() {
            this.certificateModalShow = false;
            this.certificateCache = {
                id: "",
                state: null,
                text: "",
                reason: ""
            }
        },
        temporaryCertAgree(companyInfo) {
            this.certificateCache.id = companyInfo.id;
            this.certificateCache.state = true;
            this.certificateCache.text = "通过";
        },
        temporaryCertRefuse(companyInfo) {
            this.certificateCache.id = companyInfo.id;
            this.certificateCache.state = false;
            this.certificateCache.text = "拒绝";
        },
        confirmCertificateState() {
            api.sendCertificateApproval(this.certificateCache.id, this.certificateCache.state, this.certificateCache.reason)
                .then(resp => {
                    if (resp.success === true) {
                        console.log(1);
                        this.$message.success(resp.message, 5);
                        this.hideCertificateModal();
                        this.$refs.companyTable.reload();
                    } else {
                        this.$message.error(resp.error, 5);
                    }

                })
                .catch(e => { this.$message.error(e) })
        },

        lookRecharge(prop) {
            this.optionsEntry.walletId = prop.item.walletId;
            this.optionsEntry.user = "company";
            this.optionsEntry.flag = "recharge";
            this.optionsEntry.isShow = true;
        },
        lookExpenses(prop) {
            this.optionsEntry.walletId = prop.item.walletId;
            this.optionsEntry.user = "company";
            this.optionsEntry.flag = "expenses";
            this.optionsEntry.isShow = true;
        },
        showDetails(corporateId){
            this.loginDetailModalShow = true;
            this.currentCorporate = corporateId;
            //this.$refs.detailTable.reload();
        },
        loadActivityData(){
            var from = this.LoginRangeDate[0];
            var to = this.LoginRangeDate[1];
            return api.getCorporateActivities(this.currentCorporate, from, to); 
        }
    }
}
</script>
<style>
.companyInfos li {
  font-size: 16px;
}
</style>