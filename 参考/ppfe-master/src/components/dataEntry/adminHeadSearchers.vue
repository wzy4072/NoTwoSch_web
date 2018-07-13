<template>
    <div>
        <v-row v-show="searchOptions.show">
            <v-col :md="5" v-for="(picker, key, index) in dates" :key="key">
                <v-date-picker range 
                               v-model="dates[key]['value']" 
                               :placeholder="picker['placeHolder']" 
                               format="yyyy/MM/dd">
                </v-date-picker>
            </v-col>
            
            <v-col :md="3" v-for="(input, key, index) in inputs" :key="key">
                <v-input :placeholder="input['placeHolder']" 
                         v-model="inputs[key]['value']">
                </v-input>
            </v-col>
            
            <v-col :md="5" v-for="(select, key, index) in selects" :key="key">
                {{ selects[key]['title'] || "状态" }}：
                <v-select placement="bottom" 
                          style="width: 120px;" 
                          :data="selects[key]['labels']" 
                          v-model="selects[key]['value']">
                </v-select>
            </v-col>
            <v-col :md="5">
                <v-button 
                    type="primary" 
                    icon="search" 
                    @click="search"><span>搜索</span></v-button>
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import api from '@/api/company/acount';
    

    export default {
        /**
         * 
         * 组件注意事项：
         *     虽然搜索按钮在组件内部，但触发的是外面的reload，组件不支持的搜索项写在外面的表格加载函数即可;
         *     当输入在父组件是固定值时，要在data里设为{show:false}，在created设具体值;
         *     而如果在created里有从后台获取的值，就不需要这样。不然会显示不出来，这与watch的机制有关
         *     
         * searchOptions的值
         *     show 是否可以显示了，因为selet的内容一般需要从后台获取，在此之前是没有必要花性能渲染的
         *     caller 是谁在调用
         *     searchers 数组，指示该组件显示的内容
         *     [
         *        {
         *            type: "input",
         *            placeHolder: "",
         *            name: "" 识别的标识
         *        },
         *        {
         *            type: "date", 时间段选择器
         *            name: "" 
         *            placeHolder: "", 标题(可选)
         *        },
         *        {
         *            type: "select",
         *            labels: {}, select显示的内容
         *            name: "" ,
         *            title: "", 标题(可选，默认是状态)
         *        }
         *     ]
         */
        props:['searchOptions'],
        data() {
            return {
                dates: {},
                inputs: {},
                selects: {},
            }
        },
        computed: {
//            urlMap(callerFlag) {
//                return "/admin/"+ callerFlag +"/list"
//            }
        },
        created() {
            
        },
        mounted() {
//            this.loadSearchers()
        },
        Updated() {
//            this.loadSearchers()
        },
        methods: {
            search() {
                var searchOutput = {};
                for(var key in this.dates) {
                    searchOutput[key] = this.dates[key].value 
                }
                for(var key in this.inputs) {
                    searchOutput[key] = this.inputs[key].value
                }
                for(var key in this.selects) {
                    searchOutput[key] = this.selects[key].value
                }
                this.$emit("searchOutput", searchOutput);
            },
            loadSearchers() {
                var searchers = this.searchOptions.searchers;
                if(!searchers) {
                    return
                }
                
                for (var i = 0; i < searchers.length; i++) {
                    var type = searchers[i].type;
                    var name = searchers[i].name;
                    switch(type) {
                        case "input":
                            this.inputs[name] = {
                                value: "",
                                placeHolder: searchers[i].placeHolder
                            };
                            break
                        case "date":
                            this.dates[name] = {
                                value: "",
                                placeHolder: searchers[i].placeHolder || "请选择日期"
                            };
                            break
                        case "select":
                            this.selects[name] = {
                                value: "",
                                labels: searchers[i].labels,
                                title: searchers[i].title || null
                            };
                            break
                        default:
                            break
                    }
//                    console.log(this.inputs);
//                    console.log(this.selects);
                }
            },
            
        },
        watch: {
            searchOptions: {
                handler: function (val, oldVal) {
                    // show为fasle表示有些异步数据请求未收到，此时不用执行加载函数
                    if(!val.show) {
                        return
                    }
                    this.loadSearchers();
                },
                immediate: true,
                deep: true
            }
        }
    }
</script>

<style>

</style>