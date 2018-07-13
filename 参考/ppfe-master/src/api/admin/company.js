import endpoint from '../endpoint'

export default {
    getCompanyList(options) {
        return endpoint.admin_http().post("/admin/corporate/list",options).then(resp => {
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
    getCheckInfo(id) {
        return endpoint.admin_http().get("/admin/corporate/audit/"+id).then(resp => {
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
    getCertificateInfo(id) {
        return endpoint.admin_http().get("/admin/corporate/cert/"+id).then(resp => {
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
    getApprovalStateMap() {
        return endpoint.admin_http().get("/admin/corporate/corporatestatus").then(resp => {
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
    sendCheckApproval(id, state, reason) {
        return endpoint.admin_http().post("/admin/corporate/audit" , {
            id,
            status: state,
            reason
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
    sendCertificateApproval(id, state, reason) {
        return endpoint.admin_http().post("/admin/corporate/cert" , {
            id,
            status: state,
            reason
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
    loadImgData(id) {
        return endpoint.admin_http().get("/admin/corporate/resource/"+id, {
            responseType: 'arraybuffer'
        }).then(resp => {
            return "data:" + resp.headers['content-type'] + ";base64," + new Buffer(resp.data, 'binary').toString('base64')
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
        return endpoint.admin_http().post("/admin/corporate/recharge",{
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
        return endpoint.admin_http().post("/admin/corporate/expenses",{
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

    getCorporateActivities(currentCorporate, from, to){
        return endpoint.admin_http().get("/admin/corporate/"+currentCorporate+"/activity",{
            params: {
                from: from,
                to: to,
            }
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