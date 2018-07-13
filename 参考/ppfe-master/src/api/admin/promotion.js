import endpoint from '../endpoint'

export default {
    getPromotionList(options) {
        return endpoint.admin_http().post("/admin/promotion/gift/list",{
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

    /**
     * 促销状态对应表
     * 
     * @returns {Promise.<TResult>}
     */
    getState() {
        return endpoint.admin_http().get("/admin/promotion/statemap")
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    },

    /**
     * 优惠方式对应表
     *
     * @returns {Promise.<TResult>}
     */
    getType() {
        return endpoint.admin_http().get("/admin/promotion/gift/waymap")
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    },

    /**
     * gift策略下的事件条件
     * @param type 个人还是公司
     * @returns {Promise.<TResult>}
     */
    getGiftingEvent(type) {
        return endpoint.admin_http().get("/admin/promotion/gift/event/" + type)
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    },
    /**
     * gift策略下的促销方式
     * @returns {Promise.<TResult>}
     */
    getGiftingMethod() {
        return endpoint.admin_http().get("/admin/promotion/gift/method")
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    },
    
    getPromotionInfo(id) {
        return endpoint.admin_http().get("/admin/promotion/gift/info/" + id)
            .then(resp => {
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
    
    editPromotion(options) {
        return endpoint.admin_http().post("/admin/promotion/gift/edit",{
            "id": options.id,  //为空就是新增
            "promotionname": options.promotionname,
            "title": options.title,
            "periodstart": options.periodstart,
            "periodend": options.periodend,
            "method": +options.method,
            "peopleno": +options.peopleno,
            "time": +options.time,
            "productids":options.productids,
            "event": +options.event,
            "issign": options.issign,
            "type": options.target
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
     * 获取尚未促销的产品列表
     * @param type 个人还是公司
     * @returns {Promise.<TResult>}
     */
    getNoPromotionList(type) {
        return endpoint.admin_http().get("/admin/promotion/gift/nopromotionlist/" + type)
            .then(resp => resp.data).catch(err => {
                console.log("Error Changing Avatar");
                console.log(err);
                throw err;
            });
    },
    
    changeOnline(options) {
        return endpoint.admin_http().post("/admin/promotion/online",{
            "id": options.id,
            "online": options.online, // 0下线，1上线
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