import endpoint from '@/api/endpoint.js';
export default {
    //提交订单//金额
    createOrder(param){
        return endpoint.current_http().post("pay/generateorder",param)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },
     // 充值 获取流水号
     createChargeOrder(param){
        return endpoint.current_http().post("/pay/charge",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //获取 付款链接
    getPayCode(param){
        return endpoint.current_http().post("pay/wxqr",param)
        .then(resp => resp.data)
        .catch(err => { throw err;});
    },  

    //获取微信扫码 成功状态
    getPayResault(param){
        return endpoint.current_http().post("pay/status",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
     // 获取充值结果 
     getRecharOrderInfo(param){
        return endpoint.current_http().get("pay/charge/"+param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },

    //余额查询
    getBalancce(param){
        return endpoint.current_http().post("pay/balance",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //充值记录查询
    getRecharge(param){
        return endpoint.current_http().post("pay/recharge",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //消费记录查询
    getConsume(param){
        return endpoint.current_http().post("pay/expenses",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
   
     //订单 付款结果 详情
     getOrderInfo(param){
        return endpoint.current_http().post("pay/result",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    getAppList(id){
        return endpoint.current_http(id).get("/corporate/"+ id +"/application")
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },

    //产品 列表
    getProductList(param){
        return endpoint.current_http().post("product/list",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },

    //产品 价格
    getPrice(param){
        return endpoint.current_http().post("product/price",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },

    //加入购物车
    joinShoppingCart(param){
        return endpoint.current_http().post("products/price",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },



    //产品 未付款订单列表
    getGoodsNopaymentOrderList(param){
        return endpoint.current_http().post("/order/notpay",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    // 产品 已付款订单列表
    getGoodsallPaymentOrderList(param){
        return endpoint.current_http().post("/order/all",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //产品 订单详情
    getGoodsOrderDetail(param){
        return endpoint.current_http().get("order/" + param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },

     //产品 创建交易id 获取结算号
     closeAccount(param){
        return endpoint.current_http().post("/trade",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //获取 交易详情 结算号信息
    getCloseAccountInfo(param){
        return endpoint.current_http().get("/trade/"+param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //创建订单
    createProductOrder(param){
        return endpoint.current_http().post("/order",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
   
    //获取凭证列表
    getGoodsList(param){
        return endpoint.current_http().post("/voucher/goods***",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //获取凭证列表
    getVoucherList(param){
        return endpoint.current_http().get("/voucher/list",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //获取当前凭证
    getCurrentVoucher(param){
        return endpoint.current_http().post("/voucher/getCurrentVoucher***",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //获取当前凭证
    getVoucherStaffList(param){
        return endpoint.current_http().get('/voucher/'+param+'/assignment/option',)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //分配凭证
    voucherAllot(param){
        return endpoint.current_http().post("/voucher/assign",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    
    //获取凭证详情
    getVoucherInfo(param){
        return endpoint.current_http().get("/voucher/"+param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
    //删除订单
    delOrder(param){
        return endpoint.current_http().post("/order/del",param)
        .then(resp =>{ return resp.data;})
        .catch(err => { throw err;});
    },
}