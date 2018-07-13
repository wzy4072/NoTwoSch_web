import endpoint from '../endpoint'

export default {
    getPeopleList(options) {
        return endpoint.admin_http().post("/admin/person/list",{
            "query":options.query,
            "pageNo":options.pageNo,
            "pageSize":options.pageSize,
            "sort": options.sort
        }).then(resp => {
            return resp.data;
        }).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        })
    },
    getRecharge(options) {
        return endpoint.admin_http().post("/admin/person/recharge",{
            "walletId":options.walletId,
            "pageNo":options.pageNo,
            "pageSize":options.pageSize,
            "sTime": options.sTime,
            "eTime": options.eTime
        }).then(resp => {
            return resp.data;
        }).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        })
    },
    getExpenses(options) {
        return endpoint.admin_http().post("/admin/person/expenses",{
            "walletId":options.walletId,
            "pageNo":options.pageNo,
            "pageSize":options.pageSize,
            "sTime": options.sTime,
            "eTime": options.eTime
        }).then(resp => {
            return resp.data;
        }).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        })
    },
    //直接添加账号，避过发送验证码等
    addAccount(info){
        return endpoint.admin_http().post("/admin/person",{
            "personName":info.personName,
            "tel":info.tel,
            "email":info.email,
            "password":info.password,
            "corpId":info.corpId,
        }).then(resp => {
            return resp.data;
        }).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        })

    }
}