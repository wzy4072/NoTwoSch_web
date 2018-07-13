import customData from '@/api/customData'
import endpoint from '@/api/endpoint'

export default {
    //创建 公司
    newCompany() {
        return {
            id: null,
            logo: null,
            name: "深圳市智能家居创意设计有限公司",
            hsCode: "1234567890",
            creditCode: "123456789012345678",
            customArea: "0100",
            contactsName: "李二花",
            contactsSex: "1",
            contactsDuties: "创意部经理助理",
            contactsMobile: "18565810588",
            contactsTel: "010-23456789",
            corporateMark: null,
            website: null,
            isPending: null,
            creditLevel: null,
            address: null,
            contactsEmail: null,
            creditLevel: null,
        }
    },
    // //保存公司信息
    // saveCompany(param) {
    //     let url = param.id =="" || param.id ==null ? '/corporate' : '/corporate/' + param.id;
    //     return endpoint.current_http().post(url, param)
    //         .then(resp => { return resp.data; })
    //         .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }
    //         });
    // },

    //公司信息保存修改
    saveComInfoChange(param, id) {
        return endpoint.current_http().post('/corporate/' + id, param)
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

    //获取公司列表
    getComList() {
        return endpoint.current_http().get('/person/corporatelist')
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


    //获取公司信息
    getComInfo(id) {
        return endpoint.current_http().get("corporate/" + id).then(resp => {
            return resp.data;
        })
    },

    //公司logo上传
    changeComAvatar(resourceId) {
        return endpoint.http().post("/corporate/avatar", {
            resourceId
        }).then(resp => resp.data).catch(err => {
            console.log("Error Changing Avatar");
            console.log(err);
            throw err;
        });
    },
    //加入公司
    joinCompany(param) {
        return endpoint.current_http().post("/corporate/join", param)
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
    //创建 公司 海关区
    getCustomLabel(query) {
         let customs = customData.getCustom();
        if (query == '' || query == null) {
            return null;
        } else {
            if (customs[query]) return customs[query];
            return null;
        };
    },
    //取消创建
    cancelCreate(id) {
        return endpoint.current_http().get("/corporate/delcreate/" + id)
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
    //取消加入
    cancelJoin() {
        return endpoint.current_http().get("/corporate/delapply")
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

    //公司认证
    certifi(param) {
        return endpoint.current_http().post("/corporate/" + param.id + "/certification", param)
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
    //获取公司审核或加入的公司状态
    applystatus() {
        return endpoint.current_http().get("/person/corporateapplystatus")
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
    //公司审核信息
    getCertifiInfo(id) {
        return endpoint.current_http().get('corporate/' + id + '/load/certification')
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
    //公司主页 看板 信息
    getBoardsInfo(params) {
        return endpoint.current_http().post('corporate/getinfo')
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
    //角色列表
    getJobsList(){
        return endpoint.current_http().get('/role/configuringlist')
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
    


}