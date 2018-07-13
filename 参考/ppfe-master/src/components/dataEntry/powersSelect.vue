<template>
        <v-modal title="权限配置" closable :width="690" 
        :visible="powerSetShow" 
        @cancel="cancel"
        @ok="saveSet"
    >
        <div  style="background-color:#fff;">
            <v-row>
                <v-row v-for="(certificate, cindex) in powersEntry" :key="cindex">
                    <div class="li-tit"> 
                        <span>凭证编号:{{ certificate.certificateno }}</span>
                        <!-- <span >可分配人数<strong>{{ certificate.useNum }}</strong>人</span> -->
                        <!-- <span >已选择人数<strong>{{ checkStaff }}</strong>人</span> -->
                        <span v-show="!editSingle" >可分配人数<strong>{{ certificate.useNum }}</strong>人</span>
                        <span v-show="!editSingle">已选择人数<strong>{{ checkStaff }}</strong>人</span>
                    </div>
                    <v-collapse :active-index="activeIndexMore">
                        <v-panel 
                            v-for="(apps, aindex) in certificate.apps" 
                            :header="apps.appname" 
                            :index="'x'+aindex"
                            :key="aindex">
                            <div  v-show="certificate.useNum<checkStaff && !editSingle"><h3>选中的职工数量超过了可分配的凭证数量，不能进行该凭证的操作权限分配！</h3></div>
                            <v-card 
                                v-show="certificate.useNum>=checkStaff || editSingle"
                                v-for="(modules, mindex) in apps.modules" 
                                :title="modules.modulename" 
                                :key="mindex" 
                                style="margin-top:20px">
                                <v-row>
                                        <v-checkbox 
                                           :indeterminate="powersEntry[cindex].apps[aindex].modules[mindex].indet"
                                            v-model="powersEntry[cindex].apps[aindex].modules[mindex].allChecked" 
                                            @click="selectAll(cindex,aindex,mindex)"
                                            >
                                            全选</v-checkbox>
                                    </v-row>
                                    <v-row>
                                         
                                        <v-checkbox-group 
                                            :data="powersEntry[cindex].apps[aindex].modules[mindex].operations" 
                                            label='operationname'
                                            keyField='operationid'
                                            v-model="powersEntry[cindex].apps[aindex].modules[mindex].ckedOpes" 
                                            @change="changeState(cindex,aindex,mindex)"
                                            >
                                        </v-checkbox-group>
                                            
                                    </v-row>
                            </v-card>
                            <br>
                        </v-panel>
                    </v-collapse>
                </v-row>
                
            </v-row>
            
            <!-- <v-row v-show="editSingle">
                    <v-button type="primary" icon="save" @click="saveSet"><span>保存配置</span></v-button>
                    <v-button type="primary" icon="save" @click="cancel"><span>取消</span></v-button>
            </v-row> -->
        </div>
</v-modal>

</template>

<script>
    
    import tool from '@/api/tool';

    export default {
        props:['powersEntry','powerSetShow','checkStaff','editSingle'],
        data() {
            return {
                activeIndexMore:[],
            }
        },
        methods: {
           
            //全选动作
            selectAll(c, a, m) {
                let module = this.powersEntry[c].apps[a].modules[m];
                if (module.ckedOpes.length == module.operations.length) {
                    module.ckedOpes = [];
                    module.allChecked = false;
                    module.indet = false;
                } else {
                    module.ckedOpes = tool.getArrItemValues(module.operations,'operationid');
                    module.allChecked = true;
                    module.indet = false;
                }
            },
            //单选动作
            changeState(c, a, m) {
                let module = this.powersEntry[c].apps[a].modules[m];
                module.indet = module.ckedOpes.length > 0 && module.ckedOpes.length < module.operations.length;
                module.allChecked = module.ckedOpes.length == module.operations.length
            },
            /**
             * 提交前的数据整理  
             * @ return [{certificateid: key,operationids: arr},]
             */
            collectPowers() {
                let data = this.powersEntry, powersArr = [];
                for (var m = 0; m < data.length; m++) {
                    let power = { certificateid: data[m].certificateid,operationids:[] };
                    for (var i = 0; i < data[m].apps.length; i++) {
                        for (var j = 0; j < data[m].apps[i].modules.length; j++) {
                            power.operationids = power.operationids.concat( data[m].apps[i].modules[j].ckedOpes ); 
                        }
                    }
                    if (power.operationids.length >0){ powersArr.push(power); }
                }
                return powersArr;
            },
            saveSet() {
                this.$emit('ok', this.collectPowers());
            },
            cancel() { this.$emit('cancel') }
        },
      
    }
</script>

<style scoped>
.li-tit{
    font-size: 14px;
    margin-top:16px;
}
.li-tit span{
    margin-right:20px;

}
.li-tit span strong{
    color: #FF513D;
}
</style>