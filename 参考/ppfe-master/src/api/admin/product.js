import endpoint from '../endpoint'

export default {
    getProductList(options) {
        return endpoint.admin_http().post("/admin/product/list",{
            "query":options.query,
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
    getNewProductInfo(type) {
        return endpoint.admin_http().get("/admin/product/addinfo/"+type+"").then(resp => {
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
    getEditedProductInfo(id) {
        return endpoint.admin_http().get("/admin/product/modifyinfo/"+id+"").then(resp => {
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
    editProduct(options) {
        return endpoint.admin_http().post("/admin/product/edit",{
            "id": options.id,  //为空就是新增
            "productname": options.productname,
            "remark": options.remark,
            "description": options.description,
            "type": options.type,
            "activeid": options.activeid,
            "modules": options.modules,
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
    changeState(options) {
        return endpoint.admin_http().post("/admin/product/changestate",{
            "productid": options.id,
            "state": options.state,
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
    getPrices(id) {
        return endpoint.admin_http().post("/admin/product/price/"+id+"").then(resp => {
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
    setPrices(options) {
        return endpoint.admin_http().post("/admin/product/setprice",{
            "productid": options.id,
            "prices": options.prices,
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
    /**
     * 获取产品类型
     * @NOTE 当前，应用类型和产品类型是完全一样的
     * @returns {Promise.<TResult>}
     */
    getAppType() {
        return endpoint.admin_http().get("/admin/app/apptype")
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    }
}