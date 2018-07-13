<template>
    <v-modal :title="value.cardtitle" 
    :visible="show"
     @ok="ensureSub" 
     @cancel="cancelSub" 
     :okText="value.isadmin ? '转让' : '确定'">
        <v-row :gutter="24">
            <v-col span="12">
                <v-select search style="width: 100%" :data="value.leftList" label="realName" clue="id" :optionOnChange="true" @change="selectCheck"></v-select>
            </v-col>
            <v-col span="12" v-show="!value.isadmin" class="titcount">
                <span>已选:{{value.rightList.length}}</span>
                <span @click="clearSelected" class="tit-btns">清空</span>
            </v-col>
            <v-col span="12" v-show="value.isadmin" class="titcount">
                <span>管理员选择</span>
                <span @click="clearSelected" class="tit-btns">删除</span>
            </v-col>
        </v-row>
        <v-row :gutter="24" style="margin-top:10px;">
            <v-col span="12">
                <ul ref="allStaffs" class="staff-list staff-all">
                    <li v-for="(item,index) in value.leftList" :key="index" @dblclick="checkedOne(index)">
                        {{ item.realName }}
                    </li>
                </ul>
            </v-col>
            <v-col span="12">
                <ul ref="selectedStaffList" class="staff-list staff-selected">
                    <li v-for="(item,index) in value.rightList" :key="index">
                        {{ item.realName }}
                        <span @click="removeOne(index)">
                            <v-icon type="minus-circle-o"></v-icon>
                        </span>
                    </li>
                </ul>
            </v-col>
        </v-row>
    </v-modal>
</template>

<script>
import staffapi from '@/api/company/staff';
import tool from '@/api/tool';

function _getIndex(array, name, val) {
    for (var i in array) {
        if (array[i][name] == val) {
            return i;
        }
    }
}
export default {
    props:{
        show:Boolean,
        value:Object
    },
    data() {
        return {
        }
    },   
    methods: {
        //查找输入改变
        selectCheck(item) {
            let index = _getIndex(this.value.leftList, 'id', item.id);
            this.checkedOne(index);
        },
         //选中一个
        checkedOne(index) {
            let item = this.value.leftList.splice(index, 1);
            this.value.rightList.push(item[0])
            this.$emit('input',this.value);
        },
        //删除一个
        removeOne(index) {
            let item = this.value.rightList.splice(index, 1);
            this.value.leftList.push(item[0])
            this.$emit('input',this.value);            
        },
        //清空已选择
        clearSelected() {
            let newList = this.value.leftList.concat(this.value.rightList);
            this.value.leftList = newList;
            this.value.rightList = [];
            this.$emit('input',this.value);
        },
        //确认提交
        ensureSub() {
            this.$emit('ok',this.value.rightList);
        },
        //取消
        cancelSub() {
            this.$emit('cancel');
            this.id = null;
        }
    },
}
</script>

<style scoped>
.titcount {
  line-height: 26px;
}
.titcount span {
  font-size: 14px;
}
.tit-btns {
  color: #49a4eb;
  cursor: pointer;
  float: right;
}
.staff-list {
  border: 1px solid #ccc;
  height: 292px;
  overflow-y: auto;
}
.staff-list li {
  padding: 4px 8px;
  font-size: 14px;
}
.staff-all li:hover {
  cursor: pointer;
}
.staff-list li:hover {
  background-color: #efefef;
}
.staff-selected li span {
  color: #85d3e9;
  cursor: pointer;
}
.staff-selected li span > i {
  float: right;
}
</style>
