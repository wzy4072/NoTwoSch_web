import endpoint from '@/api/endpoint';

export default {
    /**
     * 注册会话开始
     * @param source 来源信息
     * @returns {Promise.<TResult>}
     */
    registerInit(source) {
        return endpoint.current_http().get("registration/init?source="+source)
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
    /**
     * 获得图片验证码
     * @param flag
     * @returns {Promise.<T>}
     */
    getVerifiedImage(flag) {
        return endpoint.current_http().get("registration/patchca/" + flag)
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
    /**
     * 是否能通过图片验证
     * @param verifiedWord 用户输入的验证码
     * @param flag
     * @returns {Promise.<T>}
     */
    isPassVerification(mobile, verifiedWord, flag) {
        return endpoint.http().post("registration/verify",
            {
                mobile,
                challenge: verifiedWord,
                f: flag,
            }
        )
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
    /**
     * 手机验证码验证
     * @param code
     * @param flag
     * @returns {Promise.<TResult>}
     */
    verifyCode(mobile ,code, flag) {
        return endpoint.http().post("registration/code",
            {
                code,
                f:flag
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
    /**
     * 注册完成
     * @param from 表单对象
     * @param flag 会话id
     * @returns {Promise.<TResult>}
     */
    register(from, flag) {
        return endpoint.http().post('registration/info', {
            email: from.email,
            password: from.password,
            personName: from.personName,
            corpName:  from.corpName,
            industry:from.industry,
            mobile: from.tel,
            f: flag
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
    /**
     * 检查电话是否注册过
     * @param tel
     * @returns {Promise.<TResult>}
     */
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
    /**
     * 检查邮箱是否注册过
     * @param email
     * @returns {Promise.<T>}
     */
    isEmailRegistered(email) {
        return endpoint.http().post("person/verificationemail",
            {email}
        ).then(resp => resp.data).catch(error => {
            if (error.response) {
                throw error.response;
            } else {
                console.log(error);
                throw "连接错误";
            }
        });
    },
    /**
     * 发送验证码
     * @param tel
     * @param flag
     * @returns {Promise.<T>}
     */
    sendVerificationCode(tel, flag) {
        return endpoint.http().post("registration/sendverificationcode", 
            {
                mobile:tel,
                f: flag
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
    /**
     * 验证能否重置密码
     * @param username
     * @param tel
     * @param validationCode
     * @returns {Promise.<TResult>}
     */
    validateCanResetpassword(username, tel, validationCode) {
        return endpoint.http().post("person/validate",
            {
                username: username,
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
    
    changePasswordFirstly(password) {
        return endpoint.http().post("person/??",
            {
                password: password
            }
        )
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
    
}