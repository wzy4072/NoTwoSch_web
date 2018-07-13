import endpoint from '@/api/endpoint';

export default {
    getGoodsList(query) {
        return endpoint.http().get("listing?q=" + query)
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getBuyerInfo() {
        return endpoint.no_interceptors_http().get("/foundation/head")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    },
    getOrderView(options) {
        return endpoint.current_http().post("/order", options)
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
    applyPaying(options) {
        return endpoint.current_http().get("/pay/apply?orderId="+ options.orderId +"&method=" + options.method)
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
    pollSuccessState(orderID) {
        return endpoint.current_http().get("/pay/status/"+orderID)
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
}