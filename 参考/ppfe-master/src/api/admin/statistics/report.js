import endpoint from '../../endpoint'

export default {

    getPlatformTotal(options) {
        return endpoint.admin_http().post("/admin/report/platform/total", {
            "types": options.types,
            "sTime": options.startTime,
            "eTime": options.endTime,
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
    getPlatformDelta(options) {
        return endpoint.admin_http().post("/admin/report/platform/delta", {
            "types": options.types,
            "sTime": options.startTime,
            "eTime": options.endTime,
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
    getDeclEntity(options) {
        return endpoint.admin_http().post("/admin/report/declaration/entity", {
            "types": options.types,
            "sTime": options.startTime,
            "eTime": options.endTime,
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

    getCorporateActivity(options) {
        return endpoint.admin_http().post("/admin/report/declaration/corporate", {
            "types": options.types,
            "sTime": options.startTime,
            "eTime": options.endTime,
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

    getChannelPercentage(options) {
        return endpoint.admin_http().get("/admin/report/declaration/channel", {
            params: {
                "sTime": options.startTime,
                "eTime": options.endTime,
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
    },

    getAreaPercentage(options) {
        return endpoint.admin_http().get("/admin/report/declaration/area", {
            params: {
                "sTime": options.startTime,
                "eTime": options.endTime,
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
    },

    getPortPercentage(options) {
        return endpoint.admin_http().get("/admin/report/declaration/port", {
            params: {
                "sTime": options.startTime,
                "eTime": options.endTime,
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
    },
    getActiveCorporate(options) {
        return endpoint.admin_http().get("/admin/report/declaration/activecorp", {
            params: {
                "dateValue":options.dateValue,
                "p":options.pageNo,
                "s":options.pageSize,
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
    },
}