import endpoint from '../endpoint'

export default {

    //查询
    getVouchers(params){
       var str = 
       '/voucher/admin/list?pname='+params.query.productName
       +'&cname='+params.query.companyName
       +'&p='+params.pageNo
       +'&s='+params.pageSize;
        return endpoint.admin_http().get(str)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
    },
    //产品名列表
    getProductList(){
        return endpoint.admin_http().get('/voucher/admin/vouchername')
        .then(resp => {
            return resp.data;
        })
        .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
    },
    //删除
    delVoucher(params){
        return endpoint.admin_http().post("/voucher/admin/del",params)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
    },

    //停用
    lockVoucher(params){
        return endpoint.admin_http().post("/voucher/admin/disable",params)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
    },

    //启用
    unlockVoucher(params){
        return endpoint.admin_http().post("/voucher/admin/enable",params)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
    },
    // 创建凭证
    createVerify(params){
      return endpoint.admin_http().post("voucher/admin/create",params)
      .then(resp => {
          return resp.data;
      })
      .catch(error => {if (error.response) {throw error.response;} else {console.log(error);throw "连接错误";}})
  }

}

