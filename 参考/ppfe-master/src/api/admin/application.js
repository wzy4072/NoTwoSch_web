import endpoint from '../endpoint'

export default {
    getAppList(options) {
        return endpoint.admin_http().post("/admin/app/list",{
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
    getAppInfo(id) {
        return endpoint.admin_http().get("/admin/app/info/"+id+"").then(resp => {
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
    editApp(options) {
        return endpoint.admin_http().post("/admin/app/edit",{
            "id": options.id,//为空就是新增
            "appname": options.appname,
            "websiteLink": options.websiteLink,
            "callbackLink": options.callbackLink,
            "exitLink": options.exitLink,
            "dataLink": options.dataLink,
            "activeid": options.activeid,
            "type": options.type,
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
    getAppType() {
        return endpoint.admin_http().get("/admin/app/apptype")
            .then(resp => resp.data).catch(err => {
            console.log("Error Changing Avatar");
            console.log(err);
            throw err;
        });
    }
    //
    // changeIcon(resourceId) {
    //     return endpoint.admin_http().post("/admin/resource", {
    //         resourceId
    //     }).then(resp => resp.data).catch(err => {
    //         console.log("Error Changing Avatar");
    //         console.log(err);
    //         throw err;
    //     });
    // },
}