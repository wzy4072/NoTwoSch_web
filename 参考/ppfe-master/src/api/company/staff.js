
import endpoint from '@/api/endpoint';
export default {

    //获取公司操作列表
    getOperations(params){
        return endpoint.current_http().post('corporate/voucher', params)
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    },  
    //获取个人操作列表
    getSingles(params){
        return endpoint.current_http().get('corporate/currvoucher/'+params)
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    }, 
    //保存凭证配置
    saveStaffOperrations(params){
        return endpoint.current_http().post('corporate/bindvoucher',params)
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    },
    //解绑凭证
    unbindSingleVocher(params){
        return endpoint.current_http().post('corporate/unbindvoucher',params)
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    },

    
    //查询用户列表
    getStaffList(params ) {
       return endpoint.current_http().post('staff/list',params)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },

   // 岗位人数统计 和岗位介绍
   getRoleCountInfo(params ) {
        return endpoint.current_http().get('role/list')
         .then(resp => resp.data)
         .catch(err => { throw err;});
     },
     //仅获取 该角色下的员工列表 
    getRoleStaffs(params){
        return endpoint.current_http().get('role/info/'+ params)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            if (error.response) {
                throw error.response.data;
            } else {
                throw "Connection Error";
            }
        });
    },
    //查询当前岗位下和其他岗位的用户列表
    getRoleStaffList(params ) {
        return endpoint.current_http().get('role/configuredetail/'+params)
         .then(resp => resp.data)
         .catch(err => { throw err;});
     },
     //设置岗位下的员工
    setRoleStaff(params) {
        return endpoint.current_http().post('role/configure',params)
         .then(resp => resp.data)
         .catch(err => { throw err;});
     },
    /**
     * 转让岗位下的员工
     * @param params 
     * @returns {Promise<T>}
     */
    changeCompanyOwner(params) {
        return endpoint.current_http().post('role/changecorporateowner',params)
            .then(resp => resp.data)
            .catch(err => { throw err;});
    },
    //查询单个用户信息
    // getStaffInfo(id){
    //     return endpoint.current_http().get("corporate/staff/info/" + id )
    //     .then(resp => resp.data)
    //     .catch(err => { throw err;});
    // },
    //编辑 新增 的保存
    // saveStaff(params){
    //     return endpoint.current_http().post( "corporate/staff/edit",params)
    //         .then(resp => resp.data)
    //         .catch(err => { throw err;});
    // },
    //添加职工
    addStaff(params){
        return endpoint.current_http().post( "staff/add",params)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },
    reSendInvite(params){
        return endpoint.current_http().post( "staff/-----",params)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },
    //导入员工部分不成功的重新发送
    importStaffResend(params){
        return endpoint.current_http().post( "staff/importappend",params)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },
    //设置岗位
    setStation(params){
        return endpoint.current_http().post('staff/configure',params)
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    },
    //删除员工
    delStaff(params){
        return endpoint.current_http().post('staff/delete/'+params,{})
        .then(resp => { return resp.data; })
        .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }});
    },
}