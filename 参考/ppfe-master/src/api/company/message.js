
import endpoint from '../endpoint'

export default {
    getPromptMessage(corpId) {
        return endpoint.current_http().get("/message/corporate/Prompt/"+ corpId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getOperationMessage(corpId) {
        return endpoint.current_http().get("/message/corporate/Operation/"+ corpId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getBulletinMessage(corpId) {
        return endpoint.current_http().get("/message/corporate/Affiche/"+ corpId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getBulletinMessageContent(messageId) {
        return endpoint.current_http().get("/message/affichedetail/"+ messageId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getBulletinMessageContent(messageId) {
        return endpoint.current_http().get("/message/affichedetail/"+ messageId)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    setMessageRead(messageIds) {
        return endpoint.current_http().post("/message/read", messageIds)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    setMessageDeleted(messageIds) {
        return endpoint.current_http().post("/message/delete", messageIds)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    //未读消息总数
    unreadTotle(){
        return endpoint.current_http().get("/message/messagecount")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    //获取渠道列表
    getMsgType(){
        return endpoint.current_http().get("/message/channel")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data.message;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    //获取信息 
    getMessages(params){
        return endpoint.current_http().post("/message/channelmessage",params)
        .then(resp => resp.data)
        .catch(error => {
            if (error.response) {
                throw error.response.data.message;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
     //标记已读
     markReaded(params){
        return endpoint.current_http().post("/message/read",params)
        .then(resp => resp.data)
        .catch(error => {
            if (error.response) {
                throw error.response.data.message;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    //删除消息
    delMessages(params){
        return endpoint.current_http().post("/message/delete",params)
        .then(resp => resp.data)
        .catch(error => {
            if (error.response) {
                throw error.response.data.message;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    //处理邀请（消息内同意、拒绝邀请）
    handleInivte(params){
        return endpoint.current_http().post("/person/replycorporateinvite",params)
        .then(resp => resp.data)
        .catch(error => {
            if (error.response) {
                throw error.response.data.message;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    }
}