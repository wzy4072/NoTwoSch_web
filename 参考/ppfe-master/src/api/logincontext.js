import endpoint from './endpoint'

var cookiename = "ZJSID";

export default {
    login(username, password) {
        return endpoint.current_http().post("/context/login", {
            username,
            password
        }).then(resp => {
            // 在这里无法调用vue实例，也就不能使用$message提示，故继续返回给业务层处理
            return resp.data;
        }).catch(error => {
            console.log(error);
            if (error.response) {
                throw error.response.data;
            } else {
                throw "Connection Error";
            }
        })
    },
    reload() {
        return endpoint.current_http()
            .get("/context/reload")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log("Reloading Session Error");
                    console.log(error);
                }
            });
    },
    switchCorporate(corpId) {
        return endpoint.current_http()
            .post("/context/switch", { id: corpId })
            .then(resp => {
                console.log("Switched Corporate");
                var ctx = resp.data;
                console.log(ctx);
                return ctx;
            })
            .catch(error => {
                if (error.response) {
                    throw error.response.data;
                } else {
                    console.log("Reloading Session Error");
                    console.log(error);
                }
            });
    }
}