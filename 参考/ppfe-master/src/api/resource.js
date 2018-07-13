import endpoint from '@/api/endpoint'

export default {

    imgData(id) {
        if (id == null) {
            return Promise.reject("Resource ID not specified");
        }
        const ap = endpoint.url + "/resource/" + id;
        console.log("Access Resource: " + ap);
        return this.getBase64(ap);
    },
    getBase64(url) {
        return endpoint.current_http()
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response =>
                "data:" + response.headers['content-type'] + ";base64," + new Buffer(response.data, 'binary').toString('base64'))
    },
    // admin 应用图片改变
    appIconData(id) {
        if (id == null) {
            return Promise.reject("Resource ID not specified");
        }
        const ap = endpoint.url + "/admin/resource/" + id;
        console.log("Access Resource: " + ap);
        return this.appIconBase64(ap);
    },
    appIconBase64(url) {
        return endpoint.admin_http()
            .get(url, {
                responseType: 'arraybuffer'
            })
            .then(response =>
            "data:" + response.headers['content-type'] + ";base64," + new Buffer(response.data, 'binary').toString('base64'))
    }
}