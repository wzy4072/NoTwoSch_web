export default {
    /**
     * 时间格式转换
     * @param 时间 格式为Wed Nov 01 2017 10:34:46 GMT+0800 (中国标准时间) 或者 1509503686789 
     * @return 年 月 日 YYYY-MM-DD 如 2017-11-01
     */
    epochToDateTime(param) {
        if (!param) {
            console.log('时间格式转换方法epochToSecondTime，参数错误，参数：' + param);
            return '';
        }
        let date = typeof param == 'number' ? new Date(param) : param; //判断格式 是否是时间戳
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            d = date.getDate();
        month = month < 10 ? ('0' + month) : month; //例 9  显示为 09
        d = d < 10 ? ('0' + d) : d; //例 9  显示为 09
        return year + '-' + month + '-' + d;
    },

    /**
     * 时间格式转换
     * @param 时间 格式为Wed Nov 01 2017 10:34:46 GMT+0800 (中国标准时间) 或者 1509503686789 
     * @return 年 月 日 YYYY-MM-DD 如 2017-11-01 16:20:06
     */
    epochToSecondTime(param) {
        if (!param) {
            console.log('时间格式转换方法epochToSecondTime，参数错误，参数：' + param);
            return '';
        }
        let date = typeof param == 'number' ? new Date(param) : param; //判断格式 是否是时间戳
        let year = date.getFullYear(),
            month = date.getMonth() + 1,
            d = date.getDate(),
            H = date.getHours(), // 24小时制
            m = date.getMinutes(),
            s = date.getSeconds();

        var fmtTV = (tv) => {
            return (100 + tv).toString().substring(1)
        };

        return year + '-' + fmtTV(month) + '-' + fmtTV(d) + ' ' + fmtTV(H) + ':' + fmtTV(m) + ':' + fmtTV(s);
    },
    /**
     * 查找含有该项的项目
     * @param {*} objList 查找对象 数组 如 [{a:1,b:2,c:33},{a:3,b:3,c:77},{a:1,b:2,c:22}]
     * @param {*} obj  目的对象 如 {a:1,b:2}
     * 返回数组[{a:1,b:2,c:33},{a:1,b:2,c:22}]
     */
    findItems(objList, obj) {
        if (!objList) return [];
        let arr = [];
        objList.map(function (item) {
            let flag = true;
            for (let key in obj) {
                if (item[key] != obj[key]) flag = false;
            }
            if (flag) {
                arr.push(item);
            }
        });
        return arr;
    },
    /**
     * 查找数组中 目标元素的位置 如果没有返回-1
     * @param {*} search 查找对象
     * @param {*} array 
     */
    _inArray(search, array) {
        for (var i in array) {
            if (array[i] == search) {
                return i;
            }
        }
        return -1;
    },
    /**
     *  从数组对象中提取某个字段的值到数组中
     * @param list [{ operationid: 9},{ operationid: 4}，{ operationid: 2}]
     * @param return [9,4,2]
     */
    getArrItemValues(list, name) {
        let arr = [];
        list.map(function (item) {
            arr.push(item[name])
        })
        return arr;
    },
    /**
     *  从对象数组中提取某个字段的值到数组中
     * 
     * @param list 提取对象
     * @param goaNa 需要提取的字段名
     * @param name 参照字段名
     * @param val 参照字段值
     * 例 [{a:1,b:2},{a:1,b:4},{a:2,b:5}] 查找 a = 1的 b的值 返回 [2,4]
     */
    getGoaValues(list, goaNa, name, val) {
        //arguments.length 待改进
        let arr = [];
        list.map(function (item) {
            if (item[name] == val) {
                arr.push(item[goaNa])
            }
        })
        return arr;
    },

    /**
     * 非空赋值 req数组的每个元素的属性有值才赋值（
     * 有表单验证的信息展示用）
     * @param req 
     * @param take 添加内容{value:2,title:3}
     * @returns  take
     */
    geiveValidValue(req, take) {
        for (let key in take) {
            let val = req[key];
            if (val != undefined && val != null && val != '') {
                take[key] = req[key];
            }
        }
    },


    /**
     * 为对象数组中的每一项添加属性
     * @param objArr 待处理数据[{name:1}]
     * @param fields 添加内容{value:2,title:3}
     * @returns  objArr
     */
    insertField(objArr, fields) {
        if (objArr.length == 0) {
            return [];
        }
        for (let i = 0; i < objArr.length; i++) {
            Object.assign(objArr[i], fields);
        }
        // return objArr;
    },
    /**
     * 移除或保留目标对象数组中部分属性
     * @param objArr 待处理数据[{id:1,value:2}]
     * @param fields 删除/保留内容['name','value']
     * @param isSave 保留、删除 default false;
     * @returns  objArr
     */
    eliminateField(objArr, fields, isSave) {
        if (objArr.length == 0) {
            return [];
        }
        for (let i = 0; i < objArr.length; i++) {
            for (let item in objArr[i]) {
                if (isSave) {
                    if (fields.indexOf(item) == -1) {
                        delete objArr[i][item];
                    }
                } else {
                    if (fields.indexOf(item) != -1) {
                        delete objArr[i][item];
                    }
                }
            }
        }
        // return objArr;
    },


    /**
     * 获取地址栏参数，分情况跳转页面
     */
    // getLocation(){
    //     let urlArr = window.location.href.split('/');
    //     let urlLen = urlArr.length;
    //     if(urlArr[urlLen -2] =='userinfo' && urlArr[urlLen -1] !=''){
    //         window.location = '/#/login/'+ urlArr[urlLen -1];
    //         return ;
    //     }
    // }






}