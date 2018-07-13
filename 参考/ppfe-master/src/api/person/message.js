
import endpoint from '../endpoint'

export default {
    getPromptMessage() {
        return endpoint.current_http().get("/message/person/prompt")
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
    getOperationMessage() {
        return endpoint.current_http().get("/message/person/operation")
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
    getBulletinMessage() {
        return endpoint.current_http().get("/message/person/bulletin")
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
    }
}