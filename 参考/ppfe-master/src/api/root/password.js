import endpoint from '@/api/endpoint';

export default {
    // 密码校验规则
    passwordVerifiedRules: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur' },
        {
            type: "string",
            // pattern: "^[a-zA-Z0-9]{6,16}$",            
            pattern: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$",
            message: '长度在6-16位且字母数字组成',
            trigger: 'blur,change'
        }
    ],
    // 重复输入密码校验规则
    rePasswordVerifiedRules: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur' },
        {
            type: "string",
            // pattern: "^[a-zA-Z0-9]{6,16}$",
            pattern: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$",
            message: '长度在6-16位且字母数字组成',
            trigger: 'blur,change'
        }
    ],
    /**
     * 重置密码会话初始化
     * @returns {Promise.<TResult>}
     */
    resetInit() {
        return endpoint.http().get("password/forget/init")
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
        return endpoint.http().get("password/forget/patchca/" + flag)
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
     * @param name 
     * @param verifiedWord 图片验证码
     * @param flag
     * @returns {Promise.<TResult>}
     */
    isPassVerification(name, verifiedWord, flag) {
        return endpoint.http().post("password/forget/verify",
            {
                channelValue: name,
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
    verifyCode(code, flag) {
        return endpoint.http().post("password/forget/code",
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
     * 重置密码
     * @param password
     * @param code
     * @param flag
     * @returns {Promise.<TResult>}
     */
    sureResetPassword(password, flag) {
        return endpoint.http().post('password/forget/reset', {
            newPassword: password,
            f: flag,
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
     * 登录名是否被注册
     * @param {String} name 手机号码或邮箱
     * @returns {Promise.<TResult>}
     */
    isNameRegistered(name) {
        return endpoint.http().post("password/forget/verfloginname",
            {
                channelValue: name
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
     * 发送验证码
     * @param tel
     * @returns {Promise.<T>}
     */
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
    /**
     * 修改密码发送
     * @param oldPassword
     * @param newPassword
     * @returns {Promise.<T>}
     */
    sendChangePassword(oldPassword, newPassword) {
        return endpoint.current_http().post("password/change",
            {
                oldPassword,
                newPassword,
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
     * 退出登录
     */
    loginOut() {
        return endpoint.current_http().get("/foundation/loginout")
            .then(resp => resp.data)
            .catch(error => {
                if (error.response) {
                    throw error.response;
                } else {
                    console.log(error);
                    throw "连接错误";
                }
            });
    }
    
}