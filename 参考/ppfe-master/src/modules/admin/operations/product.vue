<template>
    <div style="padding:30px 50px;">
        <v-spin :spinning="spinning" tip="正在读取数据">
            <v-card title="产品操作">
                <div slot="extra" v-show="true">
                    <v-button type="primary" @click="addProduct">注册</v-button>
                </div>
                <v-row>
                    <searchers :searchOptions="searchOptions"
                               v-on:searchOutput="SearchProducts"
                    ></searchers>
                </v-row>
                <br>
                <v-row>
                    <v-col>
                        <v-data-table ref="productTable" 
                                      :data='productList' 
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
                                    <v-button type="ghost" icon="edit" @click="setPrice
(props)"><span>定价</span></v-button>
                                    <v-button type="ghost" icon="edit" @click="productOn(props)"><span>上架</span></v-button>
                                    <v-button type="ghost" icon="edit" @click="productOff(props)"><span>下架</span></v-button>
                                </div>
                                <span v-if="props.column.field=='createdAt'" v-text="timestampToDate(props.content)"></span>
                                <!--<span v-if="props.column.field=='type'" v-text="productTypeMap(props.content)"></span>-->
                                <span v-else v-html="props.content"></span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                
            </v-card>
        </v-spin>
        <v-modal title="新增产品"
                 okText="确定结果"
                 :visible="addModalShow"
                 @ok="addProductOk"
                 @cancel="addProductCancel">
            <div></div>
            <v-row v-if="addProductStep === 0">
                请选择新增产品类型：
                <v-button @click="chooseType(0)">个人</v-button>
                <v-button @click="chooseType(1)">企业</v-button>
            </v-row>
            <v-row v-if="addProductStep === 1">
                <v-row style="height: 250px;">
                    <v-col>
                        <p style="text-align:center;">图片用于产品展示，有固定格式(1040*375格式的图片)，请联系美工</p>
                        <p style="text-align:center;">预览图展示图片部分区域，不是展示效果，仅用于确认</p>
                    </v-col>
                    <v-col span="4" offset="10">
                        <avatar :id="productAvatar.avatar" :name="productAvatar.name ||'IMG'" :size="100"></avatar>
                    </v-col>
                    <v-col span="18" offset="3">
                        <v-upload name="file" :action="avatarURL" :data="productAvatar.data" drag @change="onChange">
                            <p class="ant-upload-drag-icon">
                            </p>
                        </v-upload>

                    </v-col>
                </v-row>
                <v-row>
                    <v-col span="20" offset="3">
                        <modules-checkbox :modulesEntry="newProductData.powers" v-on:powers="changeNewPowers"></modules-checkbox>
                    </v-col>
                    <v-col >
                        <v-form direction="horizontal">
                            <v-form-item label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol"  required>
                                <v-input type="text" v-model="newProductData.productname" placeholder="请输入产品名称"></v-input>
                            </v-form-item>
                            <v-form-item label="描述" :label-col="labelCol" :wrapper-col="wrapperCol" required>
                                <v-input type="text" v-model="newProductData.description" placeholder="请输入描述"></v-input>
                            </v-form-item>
                            <v-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol" >
                                <v-input type="text" v-model="newProductData.remark" placeholder="请输入描述"></v-input>
                            </v-form-item>
                        </v-form>
                    </v-col>
                </v-row>
            </v-row>
        </v-modal>

        <v-modal title="编辑产品"
                 okText="确定结果"
                 :visible="editModalShow"
                 @ok="editProductOK"
                 @cancel="editProductCancel">
            <v-row style="height: 250px;">
                <v-col>
                    <p style="text-align:center;">图片用于产品展示，有固定格式(1040*375格式的图片)，请联系美工</p>
                    <p style="text-align:center;">预览图展示图片部分区域，不是展示效果，仅用于确认</p>
                </v-col>
                <v-col span="4" offset="10">
                    <avatar :id="productAvatar.avatar" :name="productAvatar.name ||'IMG'" :size="100"></avatar>
                </v-col>
                <v-col span="18" offset="3">
                    <v-upload name="file" :action="avatarURL" :data="productAvatar.data" drag @change="onChange">
                        <p class="ant-upload-drag-icon">
                        </p>
                    </v-upload>

                </v-col>
            </v-row>
            <v-form direction="horizontal">
                <v-row>
                    <v-col span="20" offset="3" style="margin-bottom: 10px;">
                        <modules-checkbox :modulesEntry="productDataInfo.powers" v-on:powers="changeEditedPowers"></modules-checkbox>
                    </v-col>
                    <v-col v-for="(value, key) in productDataInfo" :key="editProductItemKey">
                        <v-form-item v-if="key==='productname'" label="产品名称" :label-col="labelCol" :wrapper-col="wrapperCol" required>
                            <v-input type="text" v-model="productDataInfo.productname" placeholder="请输入产品名称"></v-input>
                        </v-form-item>
                        <v-form-item v-else-if="key==='description'" label="描述" :label-col="labelCol" :wrapper-col="wrapperCol" required>
                            <v-input type="text" v-model="productDataInfo.description" placeholder="请输入描述"></v-input>
                        </v-form-item>
                        <v-form-item v-else-if="key==='remark'" label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <v-input type="text" v-model="productDataInfo.remark" placeholder="请输入描述"></v-input>
                        </v-form-item>
                        <v-form-item v-else-if="key==='createdAt'" :label="key" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <span class="ant-form-text">{{ timestampToDate(value) }}</span>
                        </v-form-item>
                        <div v-else-if="key==='powers'" ></div>
                        <v-form-item v-else-if="key==='type'" label="类型" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <span class="ant-form-text">{{ productTypeMap(value) }}</span>
                        </v-form-item>
                        <v-form-item v-else :label="key" :label-col="labelCol" :wrapper-col="wrapperCol">
                            <span class="ant-form-text">{{ value }}</span>
                        </v-form-item>
                    </v-col>
                </v-row>
            </v-form>
        </v-modal>

        <v-modal title="定价"
                 :visible="setPriceShow"
                 @ok="setPriceOK"
                 @cancel="setPriceCancel"
                 :width="setPriceModalWidth"
        >
            <div v-if="setPriceShow">
                <v-row>
                    <v-col span="2">
                        定价表格
                        <!--<span>人数</span>/ <span>时间(月)</span>-->
                    </v-col>
                    <v-col :span="priceColWidth" v-for="(x, xIndex) in priceAxisX" :key="xIndex">
                        {{ x }}月
                            </v-col>
                </v-row>

                <v-row v-for="(y, yIndex) in priceAxisY" :key="yIndex" style="margin-bottom: 10px;">
                    <!--<v-form :model="customForm" :rules="customRules" ref="customRuleForm">-->
                    <v-col span="2">
                        {{ y }}人
                                    </v-col>
                    <v-col :span="priceColWidth" v-for="(item, itemIndex) in priceItemsY[priceAxisY[yIndex]]" :key="itemIndex">
                        <!--<v-row>-->
                        <!--{{item}}-->
                        <!--</v-row>-->
                        <v-row>

                            <v-col span="15">
                                <!--<v-form-item label="时间价格">-->
                                <v-input type="number" placeholder="时间价格" v-model="priceItemsY[priceAxisY[yIndex]][itemIndex]['timeprice']"></v-input>
                                <!--</v-form-item>-->
                            </v-col>

                        </v-row>
                        <v-row>
                            <v-col span="15">
                                <!--<v-form-item label="人数价格">-->
                                <v-input type="number" placeholder="人数价格" v-model="priceItemsY[priceAxisY[yIndex]][itemIndex]['peopleprice']"></v-input>
                                <!--</v-form-item>-->

                            </v-col>
                        </v-row>
                        <!--下面的表达式就是对应项的 timeprice?+timeprice:0 + peopleprice?+peopleprice:0 -->
                        <v-row>
                            总价：{{ (priceItemsY[priceAxisY[yIndex]][itemIndex]['timeprice'] ?(+priceItemsY[priceAxisY[yIndex]][itemIndex]['timeprice']):0 )  + (priceItemsY[priceAxisY[yIndex]][itemIndex]['peopleprice'] ?(+priceItemsY[priceAxisY[yIndex]][itemIndex]['peopleprice']):0) }}
                                    </v-row>
                    </v-col>
                    <!--</v-form>-->
                </v-row>
            </div>
        </v-modal>

        <v-modal title="确定上架"
                 type="confirm"
                 :visible="onModalShow"
                 @ok="onProductOK"
                 @cancel="onProductCancel"
        >
            真的要上架吗？
        </v-modal>
        <v-modal title="确定下架"
                 :visible="offModalShow"
                 @ok="offProductOK"
                 @cancel="offProductCancel"
        >
            真的要下架吗？
        </v-modal>
    </div>
</template>
<script>
    import api from '@/api/admin/product.js';
    import timestampApi from '@/api/tool.js';
    import endpoint from '@/api/endpoint.js';
    
    import modulesCheckbox from '@/components/dataEntry/modulesCheckbox.vue';
    import avatar from '@/components/dataEntry/adminAppIcon.vue';
    import searchers from '@/components/dataEntry/adminHeadSearchers.vue';


    export default{
        components: {
            modulesCheckbox: modulesCheckbox,
            avatar: avatar,
            searchers: searchers,
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
                // 产品宣传图片相关
                productAvatar: {
                    avatar: null,
                    name: "",
                    data: {
                        sid: ""
                    }
                },
                noHovering: true,
                spinning: false,

                // 传入搜索器的配置项
                searchOptions: {
                    show: false
                },
                // 搜索器的输出项
                searchOutput: {
                    nameSelected: "",
                },
                
                currentData: [],
                pageNo: 1,
                pageSize: 10,
                columns:[
                    {title:"产品编码",field:'code'},
                    {title:"产品名称",field:'name'},
                    {title:"类型",field:'type'},
                    {title:"状态",field:'state'},
                    {title:"创建日期",field:'createdAt'},
                    {title:"操作",field:'operate'},
                ],
                
                // 定价表坐标轴项，格式如[3, 6, 12, 18]，从小到大排列
                priceAxisX : [],
                priceAxisY : [],
                // 相同的x/y值的集合，格式如下，也就是将集合先按相同的x做分类，里面再以y分开
//            { "3": 
//                { "5": { "timeprice": null, "time": 3, "peopleprice": null, "people": 5 }, 
//                { "10": { "timeprice": null, "time": 3, "peopleprice": null, "people": 10 }，
//                ...  
//              "6":
//                {"5": {....}}
//                {"10": {....}}
                priceItemsX : {},
                priceItemsY : {},
                
                
                // 应用类型选择框options
                typeOptions: [],
                // 应用类型对应表
                typeMap: {},

                editModalShow: false,
                productDataInfo: {},
                // 模块权限id数组，从组件接受
                editedProductPowers: [],
                
                // 新增产品需要先选择type，再进行下一步行动
                addProductStep: 0,
                addModalShow: false,
                newProductData: {},
                // 模块权限id数组，从组件接受
                newProductPowers: [],

                onModalShow: false,
                onProductId: "",
                
                offModalShow: false,
                offProductId: "",

                setPriceShow: false,
                setPriceId: "",
                prices: ""
            }
        },
        created(){
            /**
             * 获取产品类型
             * @NOTE 当前，应用类型和产品类型是完全一样的
             */
            api.getAppType()
                .then(resp => {
                    if(resp.success === true) {
                        var obj = resp.result;
                        var arr = []
                        for (var key in obj) {
                            var temp = {
                                value: key,
                                label: obj[key]
                            }
                            arr.push(temp)
                        }

                        this.typeMap = obj;
                        this.typeOptions = arr;
                    }else {
                        this.$message.success(resp.error);
                    }
                })
                .catch(e => {this.$message.error(e)});
            this.searchOptions = {
                show: true,
                caller: "person",
                searchers: [
                    {
                        type: "input",
                        placeHolder: "产品名称",
                        name: "nameSelected"
                    }
                ]
            }
        },
        computed: {
            // 编辑产品时v-for为每一项绑定的key
            editProductItemKey() {
                var key = 1;
                return key++
            },
            setPriceModalWidth() {
                return 1200 
            },
            // 在app编辑弹出框中的信息中英文映射表
            appInfoTitelMap(title) {
                var map = {
//                    id: "数据库id",
//                    appid: "产品id",
//                    appsecret: ""
                }
            },
            priceColWidth() {
                return Math.floor(22 / this.priceAxisX.length)
            },
            // 应用图标action
            avatarURL() {
                return endpoint.url + "/admin/resource"
            },
        },
        watch: {

        },
        methods:{
            timestampToDate(timestamp) {
                return timestampApi.epochToDateTime(timestamp);
            },
            productTypeMap(type) {
                return this.typeMap[type];
            },
            productList(prams) {
                var name = this.searchOutput.nameSelected || null;

                var query = [];
                if(name) {
                    query.push({
                        "column": "productname",
                        "filterRange": name,
                        "operat": "like"
                    })
                };

                var result = api.getProductList({
                    "query": query,
                    "pageNo": prams.pageNo,
                    "pageSize": prams.pageSize,
                })
                    .then(resp => {
                        if(resp.success === true) {
                            console.log("Product List: " + JSON.stringify(resp.result));
                            return resp.result;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                return result;

//                return new Promise((resolve, reject) => {resolve()}).then(req => {
//                    return {"result":[{id:1, productname: "123",price: 1000, status: 0}],"totalCount":1,"pageNo":1,"pageSize":10};
//                })
            },
            
            SearchProducts(searchOutput) {
                this.searchOutput = searchOutput;
                this.$refs.productTable.reload();
            },

            editInfo(props) {
                var id = props.item.id;
                api.getEditedProductInfo(id)
                    .then(resp => {
                        if(resp.success === true) {
                            this.productDataInfo = resp.result;
                            this.productAvatar.avatar = this.productDataInfo.activeid;
                            // 设置editedProductPowers的值为获得的权限初值，因为如果没有在modules-checkbox
                            // 选则，$emit就不会触发
                            this.editedProductPowers = (function() {
                                var arr = [];
                                for (var i = 0; i < resp.result.powers.length; i++) {
                                    for (var j = 0; j < resp.result.powers[i].modules.length; j++) {
                                        var id = "" + resp.result.powers[i].modules[j].moduleid;
                                        var status = resp.result.powers[i].modules[j].status;
                                        if(!!status) {
                                            arr.push(id);
                                        }
                                    }
                                }
                                return arr;
                            })(); 
                            this.editModalShow = true;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})

                // temp code
//                this.productDataInfo = {id:1, productname: "123",price: 1000, status: 0};
//                this.editModalShow = true;
            },
            changeEditedPowers(powers) {
                this.editedProductPowers = powers;
            },
            editProductOK() {
                var options = {
                    id: this.productDataInfo.id,
                    productname: this.productDataInfo.productname,
                    description: this.productDataInfo.description,
                    remark: this.productDataInfo.remark,
                    type: this.productDataInfo.type,
                    activeid: this.productDataInfo.activeid,
                    modules: this.editedProductPowers
                };
                if(!options.productname) {
                    this.$message.error("请输入产品名");
                    return;
                };
                if(!options.description) {
                    this.$message.error("请输入产品描述");
                    return;
                }
                if(!options.activeid) {
                    this.$message.error("请上传产品宣传图片");
                    return;
                };
                api.editProduct(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.editModalShow = false;
                            this.productDataInfo = {};
                            this.editedProductPowers = {};
                            this.$refs.productTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e)
                    })

                
            },
            editProductCancel() {
                this.editModalShow = false;
                this.productDataInfo = {};
                this.editedProductPowers = {};
            },

            chooseType(type) {
                api.getNewProductInfo(type)
                    .then(resp => {
                        if(resp.success === true) {
                            this.newProductData = resp.result;
                            this.newProductData.type = type;
                            this.addProductStep = 1;
                        }else {
                            this.$message.error(JSON.stringify(resp.error));
                        }
                    })
                    .catch(e => {this.$message.error(JSON.stringify(e))})
            },
            changeNewPowers(powers) {
                this.newProductPowers = powers;
            },
            addProduct() {
                this.productAvatar = {
                    avatar: null,
                        name: "",
                        data: {
                        sid: ""
                    }
                },
                this.addModalShow = true;
            },
            addProductOk() {
                var options = {
                    id: null,
                    type: this.newProductData.type,
                    productname: this.newProductData.productname,
                    description: this.newProductData.description,
                    remark: this.newProductData.remark,
                    modules: this.newProductPowers,
                    activeid: this.newProductData.activeid
                }
                if(!options.productname) {
                    this.$message.error("请输入产品名");
                    return;
                };
                if(!options.description) {
                    this.$message.error("请输入产品描述");
                    return;
                }
                if(!options.activeid) {
                    this.$message.error("请上传产品宣传图片");
                    return;
                }
                api.editProduct(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.addModalShow = false;
                            this.newProductData = {};
                            this.addProductStep = 0;
                            this.$refs.productTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {
                        this.$message.error(e);
                    })
            },
            addProductCancel() {
                this.addModalShow = false;
                this.newProductData = {};
                this.addProductStep = 0;
            },
            
            productOn(props) {
                this.onProductId = props.item.id;
                this.onModalShow = true;
            },
            onProductOK() {
                var options = {
                    id: this.onProductId,
                    state: 1
                }
                api.changeState(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.productTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                        this.onModalShow = false;
                    })
                    .catch(e => {this.$message.error(e)})
            },
            onProductCancel() {
                this.onProductId = "";
                this.onModalShow = false;
            },
            
            productOff(props) {
                this.offProductId = props.item.id;
                this.offModalShow = true;
            },
            offProductOK() {
                var options = {
                    id: this.offProductId,
                    state: 0
                }
                api.changeState(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.$refs.productTable.reload();
                        }else {
                            this.$message.error(resp.error);
                        }
                        this.offModalShow = false;
                    })
                    .catch(e => {this.$message.error(e)})
            },
            offProductCancel() {
                this.offProductId = "";
                this.offModalShow = false;
            },
            
            setPrice(props) {
                var id = props.item.id;
                api.getPrices(id)
                    .then(resp => {
                        if(resp.success === true) {
                            this.prices = resp.result;
                            
                            // 局部作用域定义，因为操作频繁，避免每次都沿着作用域链上去找
                            var xArr = []; // priceAxisX
                            var yArr = []; // priceAxisY
                            var xCol = {}; // priceItemsX
                            var yCol = {}; // priceItemsY
                            /**
                             * 数组去重并从小到大排序
                             * @param arr
                             */
                            function removeRepetitionAndSort(arr) {
                                var tempArr = [];
                                var obj = {};
                                for(var i = 0; i < arr.length; i++){
                                    if(!obj[arr[i]]){
                                        tempArr.push(arr[i]);
                                        obj[arr[i]] = 1;
                                    }
                                }
                                tempArr.sort((a, b) => {
                                    return a-b
                                });
                                return tempArr;
                            }

                            for (var i = 0; i < this.prices.length; i++) {
                                xArr.push(this.prices[i].time);
                                yArr.push(this.prices[i].people);
                            }
                            this.priceAxisX = removeRepetitionAndSort(xArr);
                            this.priceAxisY = removeRepetitionAndSort(yArr);
                            
                            // 为xCol填充属性
                            for (var i = 0; i < xArr.length; i++) {
                                xCol[xArr[i]] = {}
                            }
                            for (var key in xCol) {
                                for (var i = 0; i < this.prices.length; i++) {
                                    if(""+this.prices[i].time === key) {
                                        xCol[key][this.prices[i].people] = this.prices[i]
                                    }
                                }
                            }
                            // 为xCol填充属性
                            for (var i = 0; i < yArr.length; i++) {
                                yCol[yArr[i]] = {};
                            }
                            for (var key in yCol) {
                                for (var i = 0; i < this.prices.length; i++) {
                                    if(""+this.prices[i].people === key) {
                                        yCol[key][this.prices[i].time] = this.prices[i]
                                    }
                                }
                            }
                            this.priceItemsX = xCol;
                            this.priceItemsY = yCol;
                            this.setPriceShow = true;
                        }else {
                            this.$message.error(resp.error);
                        }
                    })
                    .catch(e => {this.$message.error(e)})
                
                // temp code
                this.setPriceId = props.item.id;
//                this.prices = [{"timeprice":null,"time":3,"peopleprice":null,"people":5},{"timeprice":null,"time":3,"peopleprice":null,"people":10},{"timeprice":null,"time":3,"peopleprice":null,"people":15},{"timeprice":null,"time":3,"peopleprice":null,"people":20},{"timeprice":null,"time":6,"peopleprice":null,"people":5},{"timeprice":null,"time":6,"peopleprice":null,"people":10},{"timeprice":null,"time":6,"peopleprice":null,"people":15},{"timeprice":null,"time":6,"peopleprice":null,"people":20},{"timeprice":null,"time":12,"peopleprice":null,"people":5},{"timeprice":null,"time":12,"peopleprice":null,"people":10},{"timeprice":null,"time":12,"peopleprice":null,"people":15},{"timeprice":null,"time":12,"peopleprice":null,"people":20},{"timeprice":null,"time":18,"peopleprice":null,"people":5},{"timeprice":null,"time":18,"peopleprice":null,"people":10},{"timeprice":null,"time":18,"peopleprice":null,"people":15},{"timeprice":null,"time":18,"peopleprice":null,"people":20}]

//                this.prices = []
//                this.setPriceShow = true;
            },
            setPriceOK() {
                var pricesArr = [],
                    options;
                
                for (var key1 in this.priceItemsY) {
                    for (var key2 in this.priceItemsY[key1]) {
                        if(this.priceItemsY[key1][key2].timeprice === null || this.priceItemsY[key1][key2].peopleprice === null) {
                            this.$message.error("所有的价格必须填写", 3);
                            return
                        }
                        pricesArr.push(this.priceItemsY[key1][key2])
                    }
                }
                
                
                options = {
                    id: this.setPriceId,
                    prices: pricesArr
                }
                api.setPrices(options)
                    .then(resp => {
                        if(resp.success === true) {
                            this.$message.success(resp.message);
                            this.setPriceId = "";
                            this.priceItemsY = {};
                            this.setPriceShow = false;
                        }else {
                            this.$message.error(resp.error);
                        }
                        this.offModalShow = false;
                    })
                    .catch(e => {this.$message.error(e)})
            },
            setPriceCancel() {
                this.setPriceId = "";
                this.priceItemsY = {};
                this.setPriceShow = false;
            },

            onChange(info) {
                console.log(info);
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList)
                }
                if (info.file.status === 'done') {
                    console.log(info.file.name + ' 上传成功.')
                    console.log("Resource ID: " + info.file.response.id);
                    if(this.addModalShow === true) {
                        this.newProductData.activeid = info.file.response.id;
                        this.productAvatar.avatar = this.newProductData.activeid;
                    }
                    if(this.editModalShow === true) {
                        this.productDataInfo.activeid = info.file.response.id;
                        this.productAvatar.avatar = this.productDataInfo.activeid;
                    }

                } else if (info.file.status === 'error') {
                    console.log(info.file.name + ' 上传失败.')
                }
            }
        }
    }
</script>
<style>
    /* vue-beauty的v-card的noHover属性用不了，手动覆盖 */
    /*.ant-card:hover{*/
        /*box-shadow: 0 0px 0px rgba(0, 0, 0, 0);*/
        /*border-color: #e9e9e9;*/
        /*z-index: 0*/
    /*}*/
    /*.table-layout{*/
        /*display: table;*/
    /*}*/
    /*.table-layout div{*/
        /*display: table-cell;*/
    /*}*/
    /*.table-layout{*/
        /*height: 350px;*/
        /*margin: 10px;*/
        /*border: 1px solid grey;*/
    /*}*/
</style>