import endpoint from '@/api/endpoint';

export default {
    current() {
        return endpoint.current_http().get("person/myself")
            .then(resp => resp.data)
            .catch(err => {
                console.log("Error Getting Myself");
                console.log(err);
                throw err;
            });
        // return new Promise((resolve, reject) => setTimeout(_ => reject("Session Timeout"), 1000));
    },
    invitationValidation(invitationCode, validationCode) {
        return endpoint.http().get('person/invitation/' + invitationCode + '/' + validationCode)
            .then(resp => resp.data);
    },
    register(person, invitationCode, validationCode) {
        // registration
        return endpoint.http().post('person/registration', {
            username: person.username,
            password: person.password,
            mobile: person.tel,
            code: person.verificationCode,
            invitationCode,
            validationCode
        })
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
    registrationValidation(username, password, validationCode) {
        return endpoint.http().post('person/registration/' + validationCode, {
            username,
            password,
        })
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
    changeAvatar(resourceId) {
        return endpoint.current_http().post("person/myself/avatar", {
            resourceId
        })
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
    changeComAvatar(resourceId) {
        return endpoint.current_http().post("corporate/avatar", {
            resourceId
        }).then(resp => resp.data).catch(err => {
            console.log("Error Changing Avatar");
            console.log(err);
            throw err;
        });
    },
    isTelRegistered(tel) {
        return endpoint.http().post("person/verificationmobile", 
            tel
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    isUsernameRegistered(name) {
        return endpoint.http().post("person/verificationname", 
            name
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    sendVerificationCode(tel) {
        return endpoint.http().post("context/sendverificationcode", 
            tel
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    validateCanResetpassword(tel, validationCode) {
        return endpoint.http().post("person/validate",
            {
                mobile: tel,
                code: validationCode
            }
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    sendResetpassword(username, tel, validationCode, password) {
        return endpoint.http().post("person/passwordreset",
            {
                username: username,
                mobile: tel,
                code: validationCode,
                password: password
            }
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    // 密码修改（邮箱链接）    
    changePasswordByEmail(param) {
        return endpoint.http().post("password/email/reset",param)
        .then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    //首次登录 密码修改
    initChangePassword(param) {
        return endpoint.current_http().post("password/init/change",param)
        .then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
}