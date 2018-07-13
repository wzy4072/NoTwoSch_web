
import endpoint from '../endpoint'

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
    getOrderView(options) {
        return endpoint.current_http().post("/order/view", options)
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
    getOrder(options) {
        return endpoint.current_http().post("/order/pay", options)
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
    getAlreadyOrder() {
        return endpoint.current_http().get("order/curr")
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
    getCapacity(corporateID) {
        return endpoint.current_http().get("corporate/capacity/" + corporateID)
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