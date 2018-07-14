import endpoint from '../endpoint'

export default {
    
    login(username, password) {
        return endpoint.http().post("/admin/account/login", {
            username,
            password
        }).then(resp => {
            return resp.data;
        }).catch(error => {
            console.log(error);
            if (error.response) {
                throw error.response.data;
            } else {
                throw "连接错误";
            }
        })
    },
    checkLogin() {
        return endpoint.admin_http().post("/admin/account/loginstate").then(resp => {
            return resp.data;
        }).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        })
    }
}