import axios from 'axios';
import config from 'appconfig';
// import config from '@/config/development';

const cookiename = "ZJSID";
const headername = "ZJSID";
axios.defaults.withCredentials = true;
export default {
    
    url: config.endpointUrl,

    http() {
        var instance = axios.create({
            baseURL: config.endpointUrl
        });
        instance.defaults.withCredentials = true;
        instance.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                if (error.response)
                {
                    let urlArr = window.location.href.split('/');
                    let urlLen = urlArr.length;
                    if(urlArr[urlLen -2] =='userinfo' && urlArr[urlLen -1] !='' && error.response.status ==401 ){
                        window.location = '/#/login/'+ urlArr[urlLen -1];
                        return ;
                    }
                    switch (error.response.status) {
                        case 401:
                            if (window.location.pathname == "/") {
                                return Promise.reject(error);
                            } else {
                                window.location = '/';
                                return new Promise(() => {});                                
                            }
                    }
                }
                return Promise.reject(error);
            });
        return instance;
    },
    current_http() {
        return this.http();
        
    },
    admin_http() {
       return this.http();
    },
    no_interceptors_http() {
        var instance = axios.create({
            baseURL: config.endpointUrl
        });
        instance.defaults.withCredentials = true;
        return instance;
    }
}

