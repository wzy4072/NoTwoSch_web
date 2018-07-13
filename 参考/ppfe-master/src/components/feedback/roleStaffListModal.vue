<template>
    <v-modal title="查看员工" closable :width="690" :visible="showflag" @cancel="cancel" @ok="ok">
        <div class="my-tab">
            <table border="0" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th>编号</th>
                        <th>姓名</th>
                        <th>手机</th>
                        <th>邮箱</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in staffList" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{item.realName}}</td>
                        <td>{{item.phone}}</td>
                        <td>{{item.email}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </v-modal>
</template>

<script>

import perapi from '@/api/person/common';
import staffapi from '@/api/company/staff';

export default {

    props: {
        'roleListId': Number,
        'showflag': Boolean,
    },
    data() {
        return {
            id: this.roleListId,
            staffList: [],
            columns: [
                { title: "编号", field: 'index' },
                { title: "姓名", field: 'realName' },
                { title: "手机", field: 'phone' },
                { title: "邮箱", field: 'email' },
            ],
        }
    },
    watch: {      
        roleListId(val) {
            this.id = val;
            if (val) { this.loadData(); }
        }
    },
    methods: {
        loadData() {
            staffapi.getRoleStaffs(this.id)
                .then(req => {
                    if (req.success) {
                        this.staffList = req.result;
                    } else {
                        this.$message.info('数据请求失败！' + req.message);
                    }
                })
                .catch(err => { this.$message.info('数据请求失败！' + err.message); });
        },
        cancel() {
            this.id = null;
            this.$emit('cancel');
        },
        ok() {
            this.id = null;
            this.$emit('cancel');
        }
    }


}
</script>
<style scoped>
/* 表格样式 */
.my-tab {
  margin: 12px;
}
.my-tab table {
  width: 100%;
  border: 1px solid #e5e6e8;
  border-collapse: collapse;
  font-size: 14px;
}
.my-tab table thead {
  background-color: #fbf7f6;
}
.my-tab table thead tr th {
  text-align: center;
  padding: 8px;
}
.my-tab table tbody {
  max-height: 252px;
  overflow-y: auto;
}
.my-tab table tbody tr {
  height: 36px;

  border-top: 1px solid #f5f6f8;
}
.my-tab table tbody tr td {
  background-color: #fff;
  text-align: center;
}
</style>