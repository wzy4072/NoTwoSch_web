import endpoint from '@/api/endpoint'

export default {

    //用户信息 查询
    getUserInfo() {
        return endpoint.current_http().get("/person/myself")
            .then(resp => resp.data)
            .catch(err => {
                console.log("Error Getting container types!");
                console.log(err);
                throw err;
            });
    },
    //用户信息 修改
    saveUserInfo(param) {
        return endpoint.current_http().post("/person/modifyperson", param)
            .then(resp => resp.data)
            .catch(error => {
                console.log(error);
                if (error.response) {
                    throw error.response.data;
                } else {
                    throw "Connection Error";
                }
            });
    },
    //发送邮件
    sendEmail(params){   
        return endpoint.current_http().post("/person/sendemailbinding", params)
       .then(resp => { return resp.data; })
       .catch(error => { if (error.response) { throw error.response.data; } else { throw "Connection Error"; }
       });
   },
    //绑定邮箱
    bindEmail(code){
        if(code !== '' && code !== null){
            return endpoint.current_http().post("/person/emailbinding ", code)
            .then(resp => { 
                return resp.data;
            })
            .catch(error => { 
                if (error.response) { throw error.response.data; } else { throw "Connection Error";}
             });
        }else{ console.log('邮箱验证码获取失败！'); }
    },
    //邮箱登录入口
    gaveEmailEnter(email){       
        let mailSateName = email.match(/@[0-9a-zA-Z]+\./)[0].slice(1, -1);
        let url ;
                switch (mailSateName) {
                    case "163": url = 'https://mail.163.com/'; break;
                    case "126": url = 'https://mail.126.com/'; break;
                    case "qq": url = 'https://mail.qq.com'; break;
                    case "gmail": url = 'https://mail.google.com/mail/'; break;
                    case "sina": url = 'https://mail.sina.com.cn/'; break;
                    case "sohu": url = 'https://mail.sohu.com'; break;
                    case "139": url = 'https://mail.10086.cn/'; break;
                    case "aliyun": url = 'https://mail.aliyun.com/'; break;
                    default: url = false;
                };
                return url;
    }
}