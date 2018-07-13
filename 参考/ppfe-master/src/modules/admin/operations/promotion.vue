<template>
    <div style="padding:30px 50px;">
        <v-spin :spinning="spinning" tip="正在读取数据">
            <v-card title="促销管理">
                <div slot="extra" v-show="true"> 
                    <v-button type="primary" @click="addPromotion">新增</v-button>
                </div>
                <v-row>
                    <searchers :searchOptions="searchOptions"
                               v-on:searchOutput="SearchPromotions"
                    ></searchers>
                </v-row>
                <br>
                <v-row>
                    <v-col>
                        <v-data-table ref="promotionTable"
                                      :data='promotionList' 
                                      :columns='columns' 
                                      :page-num="pageNo" 
                                      :page-size="pageSize" 
                                      :current-data.sync='currentData'>
                            <template slot="th" slot-scope="props">
                                <strong v-if="props.column.field=='operate'">操作</strong>
                                <strong v-else v-html="props.title"></strong>
                            </template>
                            <template slot="td" slot-scope="props">
                                <div v-if="props.column.field=='operate'">
                                    <v-button type="ghost" icon="edit" @click="editInfo(props)"><span>编辑</span></v-button>
                                    <v-button type="ghost" icon="edit" @click="promotionOn(props)"><span>发布</span></v-button>
                                    <v-button type="ghost" icon="edit" @click="promotionOff(props)"><span>删除</span></v-button>
                                </div>
                                <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                
            </v-card>
        </v-spin>
        <v-modal title="新增"
                 okText="确定结果"
                 :visible="addModalShow"
                 @ok="addPromotionOk"
                 @cancel="addPromotionCancel">
            <v-row v-if="addPromotionStep === 0">
                请选择新增优惠的目标：
                <v-button @click="chooseType(0)">个人</v-button>
                <v-button @click="chooseType(1)">企业</v-button>
            </v-row>
            <v-row v-if="addPromotionStep === 1">
                <v-form direction="vertical" :model="newPromotionData" :rules="rules" ref="newPromotionFormRef">
                    <v-row>
                        <v-col span=14>
                            <v-form-item label="活动名称" 
                                         prop="promotionname" 
                                         has-feedback 
                                         required>
                                
                                <v-input type="text" 
                                         v-model="newPromotionData.promotionname" 
                                         placeholder="活动名称" 
                                         style="width: 255px;"></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col span=14>
                            <v-form-item label="优惠标题" 
                                         prop="title" 
                                         has-feedback  
                                         required>
                                
                                <v-input type="text" 
                                         v-model="newPromotionData.title" 
                                         placeholder="请输入优惠标题" 
                                         style="width: 255px;"></v-input>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col span=14>
                            <v-form-item label="活动时间段"
                                         :validate-status = "specialValidate.newRangeTimeValidate"
                                         :help = "specialValidate.newRangeTimeHelp"
                                         required
                            >
                                <v-date-picker range 
                                               show-time 
                                               v-model="newPromotionData.rangeTime"
                                               @change = "newRangeTimeChange"
                                ></v-date-picker>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col span=14>
                            <v-form-item label="前端打标签" >
                                <v-switch v-model="newPromotionData.issign"></v-switch>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col span=14>
                            <v-form-item label="目标">
                                <v-radio-group v-model="newPromotionData.target" :data="[{value: '0', text: '个人'},{value: '1', text: '公司'}]" disabled>
                                </v-radio-group>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-form-item label="优惠方式"
                                         :validate-status = "specialValidate.newWayValidate"
                                         :help = "specialValidate.newWayHelp"
                                         required>
                                <v-select search 
                                          style = "width: 120px;" 
                                          :data = "giftingEventOptions" 
                                          v-model = "newPromotionData.giftingEvent"
                                          @change = "newWayChange"
                                ></v-select>
                                <v-select search 
                                          style="width: 120px;" 
                                          :data="giftingMethodOptions" 
                                          v-model="newPromotionData.giftingMethod"
                                          @change = "newWayChange"
                                ></v-select>
                            </v-form-item>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-form-item label="人数"
                                     :validate-status = "specialValidate.newPeopleValidate"
                                     :help = "specialValidate.newPeopleHelp"
                                     required>
                            <v-row>
                                <v-col span="10">
                                    <v-select search
                                              style="width: 120px;"
                                              :data="[{value: 1 ,label: '限制人数'},{value: 0,label: '不限人数'}]"
                                              @change = "newPeopleChange"
                                              v-model="newPromotionData.isLimitPeople"
                                    ></v-select>
                                </v-col>
                                <v-col span="10">
                                    <v-input type="text"
                                             v-model="newPromotionData.peopleno"
                                             @blur = "newPeopleChange"
                                             placeholder="限制人数时请输入人数"
                                    ></v-input>
                                </v-col>
                            </v-row>
                        </v-form-item>
                        <v-form-item label="时间"
                                     :validate-status = "specialValidate.newTimeValidate"
                                     :help = "specialValidate.newTimeHelp"
                                     required>
                            <v-row>
                                <v-col span="10">
                                    <v-select search
                                              style="width: 120px;"
                                              :data="[{value: 1,label: '限制时间'},{value: 0,label: '不限时间'}]"
                                              @change = "newTimeChange"
                                              v-model="newPromotionData.isLimitTime"
                                    ></v-select>
                                </v-col>
                                <v-col span="10">
                                    <v-input type="text"
                                             v-model="newPromotionData.time"
                                             @blur = "newTimeChange"
                                             placeholder="限制时间时请输入月数"
                                    ></v-input>
                                </v-col>
                            </v-row>
                        </v-form-item>
                    </v-row>
                </v-form>
                <v-row>
                    选择促销产品：
                    <br>
                    <products-transfer :addProductsEntry="newPromotionEntry" 
                                       v-on:productids="SelecteNewProduct"
                    ></products-transfer>
                </v-row>
            </v-row>
        </v-modal>

        <v-modal title="编辑"
                 okText="确定结果"
                 :visible="editModalShow"
                 @ok="editPromotionOK"
                 @cancel="editPromotionCancel">
            <v-form direction="vertical" :model="promotionDataInfo" :rules="rules" ref="promotionDataInfo">
                <v-row>
                    <v-col span=14>
                        <v-form-item label="活动名称"
                                     prop="promotionname"
                                     has-feedback
                                     required>

                            <v-input type="text"
                                     v-model="promotionDataInfo.promotionname"
                                     placeholder="活动名称"
                                     style="width: 255px;"></v-input>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col span=14>
                        <v-form-item label="优惠标题"
                                     prop="title"
                                     has-feedback
                                     required>

                            <v-input type="text"
                                     v-model="promotionDataInfo.title"
                                     placeholder="请输入优惠标题"
                                     style="width: 255px;"></v-input>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col span=14>
                        <v-form-item label="活动时间段"
                                     :validate-status = "specialValidate.newRangeTimeValidate"
                                     :help = "specialValidate.newRangeTimeHelp"
                                     required
                        >
                            <v-date-picker range
                                           show-time
                                           v-model="promotionDataInfo.rangeTime"
                                           @change = "newRangeTimeChange('edit')"
                            ></v-date-picker>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col span=14>
                        <v-form-item label="前端打标签" >
                            <v-switch v-model="promotionDataInfo.issign"></v-switch>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col span=14>
                        <v-form-item label="目标">
                            <v-radio-group v-model="promotionDataInfo.target" :data="[{value: '0', text: '个人'},{value: '1', text: '公司'}]" disabled>
                            </v-radio-group>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-form-item label="优惠方式"
                                     :validate-status = "specialValidate.newWayValidate"
                                     :help = "specialValidate.newWayHelp"
                                     required>
                            <v-select search
                                      style = "width: 120px;"
                                      :data = "giftingEventOptions"
                                      v-model = "promotionDataInfo.giftingEvent"
                                      @change = "newWayChange('edit')"
                            ></v-select>
                            <v-select search
                                      style="width: 120px;"
                                      :data="giftingMethodOptions"
                                      v-model="promotionDataInfo.giftingMethod"
                                      @change = "newWayChange('edit')"
                            ></v-select>
                        </v-form-item>
                    </v-col>
                </v-row>
                <v-row>
                    <v-form-item label="人数"
                                 :validate-status = "specialValidate.newPeopleValidate"
                                 :help = "specialValidate.newPeopleHelp"
                                 required>
                        <v-row>
                            <v-col span="10">
                                <v-select search
                                          style="width: 120px;"
                                          :data="[{value: 1 ,label: '限制人数'},{value: 0,label: '不限人数'}]"
                                          @change = "newPeopleChange('edit')"
                                          v-model="promotionDataInfo.isLimitPeople"
                                ></v-select>
                            </v-col>
                            <v-col span="10">
                                <v-input type="text"
                                         v-model="promotionDataInfo.peopleno"
                                         @blur = "newPeopleChange('edit')"
                                         placeholder="限制人数时请输入人数"
                                ></v-input>
                            </v-col>
                        </v-row>
                    </v-form-item>
                    <v-form-item label="时间"
                                 :validate-status = "specialValidate.newTimeValidate"
                                 :help = "specialValidate.newTimeHelp"
                                 required>
                        <v-row>
                            <v-col span="10">
                                <v-select search
                                          style="width: 120px;"
                                          :data="[{value: 1,label: '限制时间'},{value: 0,label: '不限时间'}]"
                                          @blur = "newTimeChange('edit')"
                                          v-model="promotionDataInfo.isLimitTime"
                                ></v-select>
                            </v-col>
                            <v-col span="10">
                                <v-input type="text"
                                         v-model="promotionDataInfo.time"
                                         @change = "newTimeChange('edit')"
                                         placeholder="限制月数时请输入月数"
                                ></v-input>
                            </v-col>
                        </v-row>
                    </v-form-item>
                </v-row>
            </v-form>
            <v-row>
                <v-row>
                    选择促销产品：
                    <br>
                    <products-transfer :addProductsEntry="editPromotionEntry"
                                       v-on:productids="selecteEditProduct"
                    ></products-transfer>
                </v-row>
            </v-row>
        </v-modal>
        
        <v-modal title="确定上线"
                 type="confirm"
                 :visible="onModalShow"
                 @ok="onPromotionOK"
                 @cancel="onPromotionCancel"
        >
            真的要上线吗？
        </v-modal>
        <v-modal title="确定下线"
                 :visible="offModalShow"
                 @ok="offPromotionOK"
                 @cancel="offPromotionCancel"
        >
            真的要下线吗？
        </v-modal>
    </div>
</template>
<script>
    import api from '@/api/admin/promotion.js';
    import timestampApi from '@/api/tool.js';
    
    import searchers from '@/components/dataEntry/adminHeadSearchers.vue';
    import productsTransfer from '@/components/dataEntry/productsTransfer.vue';
    


    export default{
        components: {
            searchers: searchers,
            productsTransfer: productsTransfer,
        },
        data(){
            
            return {
                // 产品详情col宽度控制
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 14
                },
                
                spinning: false,

                // 传入搜索器的配置项
                searchOptions: {
                    show: false,
                    caller: "promotion",
                    searchers: [
                        {
                            type: "select",
                            labels: [],
                            name: "stateSelected"
                        },
                        {
                            type: "date",
                            name: "rangeDateSelect",
                            placeHolder: "活动时间段"
                        },
                        {
                            type: "select",
                            labels: [],
                            name: "typeSelected",
                            title: "方式"
                        },
                    ]
                },
                // 搜索器的输出项
                searchOutput: {
                    stateSelected: "",
                    rangeDateSelect: "",
                    typeSelected: "",
                },
                
                currentData: [],
                pageNo: 1,
                pageSize: 10,
                columns:[
                    {title:"活动名称",field:'promotionname'},
                    {title:"优惠标题",field:'title'},
                    {title:"活动时间段",field:'period'},
                    {title:"优惠方式",field:'way'},
                    {title:"状态",field:'state'},
                    {title:"创建日期",field:'createdAt', sort: true},
                    {title:"操作",field:'operate'},
                ],
                
                rules: {
                    promotionname: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
//                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    title: [
                        { required: true, message: '请输入活动标题', trigger: 'blur' },
                    ],
//                    rangeTime: [
//                        { validator: validateTest }
//                    ]
                },
                // 手动验证选项，因为from的rules不支持诸如时间范围的判断
                specialValidate: {
                    // 时间范围
                    newRangeTimeValidate: "",
                    newRangeTimeHelp: "",
                    // 方式和事件
                    newWayValidate: "",
                    newWayHelp: "",
                    // 人数
                    newPeopleValidate: "",
                    newPeopleHelp: "",
                    // 月份数
                    newTimeValidate: "",
                    newTimeHelp: "",
                },
                // 促销状态对应表
                stateMap: {},
                // 促销状态的select框显示值
                stateOptions: [],
                // 优惠方式对应表
                typeMap: {},
                // 优惠方式的select框显示值
                typeOptions: [],

                // gift下个人的促销事件
                personGiftingEvent: [],
                // gift下公司的促销事件
                companyGiftingEvent: [],
                
                // 绑定到select框的事件表，数据根据type有所不同
                giftingEventOptions: [],
                // 绑定到select框的方式表
                giftingMethodOptions: [],
                
                noPromotionProductList: [],

                editModalShow: false,
                promotionDataInfo: {},
                editPromotionEntry: {},
                
                addPromotionStep: 0,
                addModalShow: false,
                newPromotionData: {
                    target: null,
                    issign: false,
                    promotionname: "",
                    rangeTime: ["", ""],
                    isLimitPeople: 1,
                    isLimitTime: 1,
                    peopleno: null,
                    time: null,
                    giftingEvent: null,
                    giftingMethod: null,
                },
                newPromotionEntry: {},

                onModalShow: false,
                onPromotionId: "",
                
                offModalShow: false,
                offPromotionId: "",
                
            }
        },
        created(){
            this.loadInitData();
        },
        computed: {
            
        },
        watch: {

        },
        methods:{
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            promotionTypeMap(type) {
                return this.typeMap[type];
            },
            /**
             * 让map转换为支持select框格式的数组
             * @eg {0:"赠送产品"} => [{ label: "赠送产品", value: 0 }]
             * @param obj
             * @returns {Array}
             */
            mapToLabelArr(obj) {
                var arr = []
                for (var key in obj) {
                    var temp = {
                        value: key,
                        label: obj[key]
                    }
                    arr.push(temp)
                }
                return arr;
            },

            loadInitData() {
                // 因为search依赖两个异步的结果，所以等于2的时候才应该显示
                var searchShowFlag = 0;
                /**
                 * 得到促销状态对应表
                 */
                api.getState()
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            var arr = this.mapToLabelArr(obj);
                            
                            this.stateMap = obj;
                            this.stateOptions = arr;
                            this.searchOptions.searchers[0].labels = arr;
                            searchShowFlag++;
                            if(searchShowFlag === 2) {
                                this.searchOptions.show = true;
                            }
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)});
                /**
                 * 得到优惠方式对应表
                 */
                api.getType()
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            var arr = this.mapToLabelArr(obj);

                            this.typeMap = obj;
                            this.typeOptions = arr;
                            this.searchOptions.searchers[2].labels = arr;
                            searchShowFlag++;
                            if(searchShowFlag === 2) {
                                this.searchOptions.show = true;
                            }
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)});


                api.getGiftingMethod()
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            var arr = this.mapToLabelArr(obj);
                            
                            this.giftingMethodOptions = arr;
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)});

                /*
                 * gift下个人的促销事件
                 * */
                api.getGiftingEvent(0)
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            var arr = this.mapToLabelArr(obj);
                            
                            this.personGiftingEvent = arr;
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)});

                /*
                 * gift下公司的促销事件
                 * */
                api.getGiftingEvent(1)
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            var arr = this.mapToLabelArr(obj);
                            
                            this.companyGiftingEvent = arr;
                        }else {
                            this.$message.success(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)});
            },
            promotionList(prams) {
                var state = this.searchOutput.stateSelected || null;
                var type = this.searchOutput.typeSelected || null;
                var screat =this.searchOutput.rangeDateSelect ? this.searchOutput.rangeDateSelect[0].replace(/\//g,"-") : null;
                var ecreat =this.searchOutput.rangeDateSelect ? this.searchOutput.rangeDateSelect[1].replace(/\//g,"-") : null;
                var query = [];
                if(state) {
                    query.push({
                        "column": "state",
                        "filterRange": state,
                        "operat": "="
                    })
                };
                if(type) {
                    query.push({
                        "column": "way",
                        "filterRange": type,
                        "operat": "="
                    })
                };
                if(screat) {
                    query.push({
                        "column": "start",
                        "filterRange": screat,
                        "operat": ">="
                    })
                };
                if(ecreat) {
                    query.push({
                        "column": "end",
                        "filterRange": ecreat,
                        "operat": "<="
                    })
                };

                var result = api.getPromotionList({
                    "query": query,
                    "pageNo": prams.pageNo,
                    "pageSize": prams.pageSize,
                })
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            console.log(obj);
                            for (var i = 0; i < obj.result.length; i++) {
                                obj.result[i].period = "" + this.timestampToDate(obj.result[i].begindate) + " ~ " +this.timestampToDate(obj.result[i].enddate)
                            }
                            return obj;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                return result;


//                return new Promise((resolve, reject) => {resolve()}).then(req => {
//                    return {"result":[{
//                        id:1, 
//                        promotionname: "123",
//                        title: "title",
//                        period: "2017-9 ~ 2017-11",
//                        state: 3,
//                        way: 2,
//                        createdAt: 128309123
//                    }],"totalCount":1,"pageNo":1,"pageSize":10};
//                })
            },
            SearchPromotions(searchOutput) {
                this.searchOutput = searchOutput;
                this.$refs.promotionTable.reload();
            },

            editInfo(props) {
                var id = props.item.id;
                api.getPromotionInfo(id)
                    .then(resp => {
                        if(resp.success === true) {
                            var obj = resp.result;
                            // 将传过来的数据格式转换成需要的数据格式
                            this.promotionDataInfo.id =            id;
                            this.promotionDataInfo.promotionname = ""+obj.promotionname;
                            this.promotionDataInfo.title =         ""+obj.title;
                            this.promotionDataInfo.giftingEvent =  ""+obj.event;
                            this.promotionDataInfo.giftingMethod = ""+obj.method;
                            this.promotionDataInfo.issign =        obj.issign;
                            this.promotionDataInfo.target =        ""+obj.type;
                            this.promotionDataInfo.peopleno =      obj.peopleno;
                            this.promotionDataInfo.time =          obj.time;
                            
                            // 去除毫秒数
                            this.promotionDataInfo.rangeTime = [
                                timestampApi.epochToSecondTime(obj.periodstart).slice(0, -2),
                                timestampApi.epochToSecondTime(obj.periodend).slice(0, -2),
                            ]
                            this.promotionDataInfo.isLimitPeople = obj.peopleno ? 1 : 0;
                            this.promotionDataInfo.isLimitTime = obj.time ? 1 : 0;
                            
                            this.giftingEventOptions = obj.type===1 ? this.companyGiftingEvent : this.personGiftingEvent;

                            
                            this.promotionDataInfo.productids = this.editPromotionEntry.target = (function() {
                                var arr = [];
                                for (var i = 0; i < obj.products.length; i++) {
                                    arr.push(obj.products[i].id);
                                }
                                return arr;
                            })();
                            
                            return {
                                type: obj.type,
                                products: obj.products
                            }
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .then(result => {
                        api.getNoPromotionList(result.type)
                            .then(resp => {
                                if(resp.success === true) {
                                    var vm = this;
                                    
                                    vm.noPromotionProductList = resp.result;
                                    // 转换适当的格式从促销产品列表到输入项
                                    vm.editPromotionEntry.data = (function() {
                                        var arr = [];
                                        for (var i = 0; i < vm.noPromotionProductList.length; i++) {
                                            arr.push(
                                                {
                                                    key: vm.noPromotionProductList[i].id,
                                                    title: vm.noPromotionProductList[i].productname
                                                }
                                            )
                                        }
                                        // 选中项也要加进data
                                        for (var j = 0; j < result.products.length; j++) {
                                            arr.push(
                                                {
                                                    key: result.products[j].id,
                                                    title: result.products[j].productname
                                                }
                                            )
                                        }
                                        return arr;
                                    })();

                                    this.editModalShow = true;

                                }else {
                                    this.$message.error(resp.error);
                                }
                            })
                            .catch(e => {this.$message.error(e)})
                    })
                    .catch(e => {this.$message.error(e)})
            },
            selecteEditProduct(productids) {
                this.promotionDataInfo.productids = productids;
            },
            editPromotionOK() {
                this.$refs['promotionDataInfo'].validate(ok => {
                    // form的rules不支持时间范围选择，手动加验证
                    if(this.promotionDataInfo.rangeTime[0] === "") {
                        this.specialValidate.newRangeTimeValidate = "error";
                        this.specialValidate.newRangeTimeHelp = "请选择时间段";
                        this.$message.error("请您修正输入");
                        return;
                    }
                    // 一个form-item有两个关联项事件和方式，手动加验证
                    if(!this.promotionDataInfo.giftingEvent || !this.promotionDataInfo.giftingMethod) {
                        this.specialValidate.newWayValidate = "error";
                        this.specialValidate.newWayHelp = "请全部选择";
                        this.$message.error("请您修正输入");
                        return;
                    }

                    // 一个form-item有两个关联项限制月份和月份数，手动加验证
                    if(this.promotionDataInfo.isLimitTime === 0) {
                        this.promotionDataInfo.time = null;
                    }else if(!this.promotionDataInfo.time) {
                        this.specialValidate.newTimeValidate = "error";
                        this.specialValidate.newTimeHelp = "请选择月份数量";
                        this.$message.error("请您修正输入");
                        return;
                    }
                    // 同上，限制人数和人数
                    if(this.promotionDataInfo.isLimitPeople === 0) {
                        this.promotionDataInfo.peopleno = null;
                    }else if(!this.promotionDataInfo.peopleno) {
                        this.specialValidate.newPeopleValidate = "error";
                        this.specialValidate.newPeopleHelp = "请选择人的数量";
                        this.$message.error("请您修正输入");
                        return;
                    }

                    if(!this.promotionDataInfo.productids || this.promotionDataInfo.productids.length === 0) {
                        this.$message.error("必须选择至少一个产品");
                        return;
                    }
                    if (ok) {
                        var options = {
                            "id":            this.promotionDataInfo.id,
                            "promotionname": this.promotionDataInfo.promotionname,
                            "title":         this.promotionDataInfo.title,
                            "periodstart":   Date.parse(new Date(this.promotionDataInfo.rangeTime[0])),
                            "periodend":     Date.parse(new Date(this.promotionDataInfo.rangeTime[1])),
                            "method":        this.promotionDataInfo.giftingMethod,
                            "peopleno":      this.promotionDataInfo.peopleno,
                            "time":          this.promotionDataInfo.time,
                            "productids":    this.promotionDataInfo.productids,
                            "event":         this.promotionDataInfo.giftingEvent,
                            "issign":        this.promotionDataInfo.issign,
                            "target":        this.promotionDataInfo.target
                        }
                        api.editPromotion(options)
                            .then(resp => {
                                if(resp.success === true) {
                                    this.$message.success(resp.message);
                                    this.editModalShow = false;
                                    this.promotionDataInfo = {};
                                    this.$refs.promotionTable.reload();
                                }else {
                                    this.$message.error(resp.error);
                                }
                            })
                            .catch(e => {
                                this.$message.error(e);
                            })
                    } else {
                        this.$message.error("请您修正输入");
                    }
                })
            },
            editPromotionCancel() {
                this.editModalShow = false;
                this.promotionDataInfo = {};
            },

            chooseType(type) {
                var vm = this;
                var flags = 0;
                var testCount = 0;
                var timer = setInterval(function() {
                    var canPass = flags === 1;
                    if(canPass) {
//                        this.spinning = false;
                        vm.newPromotionData.target = type;
                        vm.addPromotionStep = 1;
                        clearInterval(timer);
                    }
                    if(testCount >= 60) {
                        clearInterval(timer);
                    }
                    testCount++;
                }, 50);
                
//                this.spinning = true
                api.getNoPromotionList(type)
                    .then(resp => {
                        if(resp.success === true) {
                            var vm = this;
                            this.noPromotionProductList = resp.result;
                            // 转换适当的格式从促销产品列表到输入项
                            this.newPromotionEntry.data = (function() {
                                var arr = [];
                                for (var i = 0; i < vm.noPromotionProductList.length; i++) {
                                    arr.push(
                                        {
                                            key: vm.noPromotionProductList[i].id,
                                            title: vm.noPromotionProductList[i].productname
                                        }
                                    )
                                }
                                return arr;
                            })();
                            // 新增促销的时候，选中的产品没有
                            this.newPromotionEntry.target = []
                            flags += 1;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                
                this.giftingEventOptions = type===1 ? this.companyGiftingEvent : this.personGiftingEvent;
            },
            addPromotion() {
                this.addPromotionStep = 0;
                this.addModalShow = true;
            },
            SelecteNewProduct(productids) {
                this.newPromotionData.productids = productids;
            },
            addPromotionOk() {
                this.$refs['newPromotionFormRef'].validate(ok => {
                    // form的rules不支持时间范围选择，手动加验证
                    if(this.newPromotionData.rangeTime[0] === "") {
                        this.specialValidate.newRangeTimeValidate = "error";
                        this.specialValidate.newRangeTimeHelp = "请选择时间段";
                        this.$message.error("请您修正输入");
                        return;
                    }
                    // 一个form-item有两个关联项事件和方式，手动加验证
                    if(!this.newPromotionData.giftingEvent || !this.newPromotionData.giftingMethod) {
                        this.specialValidate.newWayValidate = "error";
                        this.specialValidate.newWayHelp = "请全部选择";
                        this.$message.error("请您修正输入");
                        return;
                    }

                    // 一个form-item有两个关联项限制月份和月份数，手动加验证
                    if(this.newPromotionData.isLimitTime === 0) {
                        this.newPromotionData.time = null;
                    }else if(!this.newPromotionData.time) {
                        this.specialValidate.newTimeValidate = "error";
                        this.specialValidate.newTimeHelp = "请选择月份数量";
                        this.$message.error("请您修正输入");
                        return;
                    }
                    // 同上，限制人数和人数
                    if(this.newPromotionData.isLimitPeople === 0) {
                        this.newPromotionData.peopleno = null;
                    }else if(!this.newPromotionData.peopleno) {
                        this.specialValidate.newPeopleValidate = "error";
                        this.specialValidate.newPeopleHelp = "请选择人的数量";
                        this.$message.error("请您修正输入");
                        return;
                    }
                    if(!this.newPromotionData.productids ||this.newPromotionData.productids.length === 0) {
                        this.$message.error("必须选择至少一个产品");
                        return;
                    }
                    if (ok) {
                        var options = {
                            "id": 0,
                            "promotionname": this.newPromotionData.promotionname,
                            "title":         this.newPromotionData.title,
                            "periodstart":   Date.parse(new Date(this.newPromotionData.rangeTime[0])),
                            "periodend":     Date.parse(new Date(this.newPromotionData.rangeTime[1])),
                            "method":        this.newPromotionData.giftingMethod,
                            "peopleno":      this.newPromotionData.peopleno,
                            "time":          this.newPromotionData.time,
                            "productids":    this.newPromotionData.productids,
                            "event":         this.newPromotionData.giftingEvent,
                            "issign":        this.newPromotionData.issign,
                            "target":        this.newPromotionData.target
                        }

                        api.editPromotion(options)
                            .then(resp => {
                                if(resp.success === true) {
                                    this.$message.success(resp.message);
                                    this.addModalShow = false;
                                    this.newPromotionData = {
                                        target: null,
                                        issign: false,
                                        promotionname: "",
                                        rangeTime: ["", ""],
                                        isLimitPeople: 1,
                                        isLimitTime: 1,
                                        peopleno: null,
                                        time: null,
                                        giftingEvent: null,
                                        giftingMethod: null,
                                    }
                                    this.addPromotionStep = 0;
                                    this.$refs.promotionTable.reload();
                                }else {
                                    this.$message.error(resp.error);
                                }
                            })
                            .catch(e => {
                                this.$message.error(e);
                            })
                    } else {
                        this.$message.error("请您修正输入");
                    }
                })
                
                
                
            },
            addPromotionCancel() {
                this.addPromotionStep = 0;
                this.addModalShow = false;
                this.newPromotionData = {
                        target: null,
                        issign: false,
                        promotionname: "",
                        rangeTime: ["", ""],
                        isLimitPeople: 1,
                        isLimitTime: 1,
                        peopleno: null,
                        time: null,
                        giftingEvent: null,
                        giftingMethod: null,
                }
            },
            
            promotionOn(props) {
                this.onPromotionId = props.item.id;
                this.onModalShow = true;
            },
            onPromotionOK() {
                var options = {
                    id: this.onPromotionId,
                    online: 1
                }
                api.changeOnline(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.promotionTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                        this.onModalShow = false;
                    })
                    .catch(e => {this.$message.error(e)})
            },
            onPromotionCancel() {
                this.onPromotionId = "";
                this.onModalShow = false;
            },
            
            promotionOff(props) {
                this.offPromotionId = props.item.id;
                this.offModalShow = true;
            },
            offPromotionOK() {
                var options = {
                    id: this.offPromotionId,
                    online: -1
                }
                api.changeOnline(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.promotionTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                        this.offModalShow = false;
                    })
                    .catch(e => {this.$message.error(e)})
            },
            offPromotionCancel() {
                this.offPromotionId = "";
                this.offModalShow = false;
            },

            /**
             * 促销时间范围选择验证消失
             */
            newRangeTimeChange(flag){
                var data = flag==='edit' ? this.promotionDataInfo : this.newPromotionData;
                
                if(data.rangeTime[0] !== "") {
                    this.specialValidate.newRangeTimeValidate = "";
                    this.specialValidate.newRangeTimeHelp = "";
                }
            },
            /**
             * 新建促销方式选择验证消失
             */
            newWayChange(flag) {
                var data = flag==='edit' ? this.promotionDataInfo : this.newPromotionData;
                console.log(data);
                if(data.giftingEvent && data.giftingMethod) {
                    this.specialValidate.newWayValidate = "";
                    this.specialValidate.newWayHelp = "";
                }
            },
            /**
             * 新建促销人数选择验证消失
             */
            newPeopleChange(flag) {
                var data = flag==='edit' ? this.promotionDataInfo : this.newPromotionData;
                console.log(data);
                if(data.isLimitPeople === 0) {
                    data.peopleno = "";
                    this.specialValidate.newPeopleValidate = "";
                    this.specialValidate.newPeopleHelp = "";
                }else if(data.peopleno) {
                    this.specialValidate.newPeopleValidate = "";
                    this.specialValidate.newPeopleHelp = "";
                }
            },
            /**
             * 新建促销月数选择验证消失
             */
            newTimeChange(flag) {
                var data = flag==='edit' ? this.promotionDataInfo : this.newPromotionData;
                console.log(data);
                if(data.isLimitTime === 0) {
                    data.time = "";
                    this.specialValidate.newTimeValidate = "";
                    this.specialValidate.newTimeHelp = "";
                }else if(data.time) {
                    this.specialValidate.newTimeValidate = "";
                    this.specialValidate.newTimeHelp = "";
                }
            },
        }
    }
</script>
<style>
    
</style>