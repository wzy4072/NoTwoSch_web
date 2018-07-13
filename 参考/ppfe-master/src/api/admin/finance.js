import endpoint from '../endpoint'

export default {
    getFinanceList(options) {
        return endpoint.admin_http().post("/admin/finance/list",{
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
    
    getFinanceBill(options) {
        return endpoint.admin_http().post("/admin/finance/bill",{
            "target": +options.target,
            "flowNo":options.flowNum,
            "oppoSiteAccount":options.oppositeAccount,
            "sTime":options.stime,
            "eTime":options.etime,
            "pageNo":options.pageNo,
            "pageSize":options.pageSize,
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
}