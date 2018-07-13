<template>
    <div>
        <v-row class="ser-tle">
            日期查询：
             <span><v-date-picker v-model="date.dateSt" ></v-date-picker></span>
           至
            <span><v-date-picker v-model="date.dateEn" ></v-date-picker></span>
             <v-button type="primary" @click="search">查询</v-button>
        </v-row>
        <br>
        <v-row >

                <v-data-table :data='loadData' :columns='columns' ref="walltab">
                    <template slot="emptytext" scope="props">
                        <v-tag color="orange">没找到数据</v-tag>
                    </template>
                    <template slot="td" scope="props">
                        <span v-if="props.column.field=='createdAt'">
                           {{formatDate(props.content)}}
                        </span>
                        <span v-else v-html="props.content"></span>
                    </template>
                </v-data-table>
        </v-row>
    </div>
</template>

<script>
    import tool from '@/api/tool';

export default {
    props:['loadData'],
    data(){
        return {
            date:{ 
                dateEn:1,
                dateSt:2
            },
            columns:[
                {title:"应用",field:'body'},
                {title:"金额",field:'totalFee'},
                {title:"创建时间",field:'createdAt'}
            ], 
            //tabref:'',
        }
    },
    created(){
                    var end = new Date(), start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                    this.date.dateEn = tool.epochToDateTime(end);
                    this.date.dateSt = tool.epochToDateTime(start);
    },
    mounted() {
        //this.tabref = this.$refs.walltab;
        this.$emit('pushRef', this.$refs.walltab);
    },
    methods:{
        search(){
            this.$emit('tabseach', this.date);
        },
        formatDate(date){
                return  tool.epochToSecondTime(date)
            },
    }
}

</script>
<style scoped>
   
    .ser-tle span{
        margin:0 3px;
    }
</style>