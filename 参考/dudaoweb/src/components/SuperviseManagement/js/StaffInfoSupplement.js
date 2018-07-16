import * as cityData from '../../../common/js/city_Data'
export default {
    data() {
        return {
            barNameArr: [],
            fullscreenLoading: false,
            dialogVisible: false,
            isdisable: false,
            tableData: [],
            searchstr: '', // 当前输入
            allOptions: {
                certificOptions: [{
                        id: 1,
                        name: '居民身份证'
                    },
                    {
                        id: 2,
                        name: '香港特区护照/身份证明'
                    },
                    {
                        id: 3,
                        name: '澳门特区护照/身份证明'
                    },
                    {
                        id: 4,
                        name: '台湾居民来往大陆通行证'
                    },
                    {
                        id: 5,
                        name: '境外永久居住证'
                    },
                    {
                        id: 6,
                        name: '护照'
                    },
                    {
                        id: 7,
                        name: '其他'
                    }
                ], // 证件类型
                politicalOptions: [], // 政治面貌
                nationOptions: [], // 民族
                educationOptions: [], // 最高学历
                workerTypeOptions: [], // 岗位
                CoursesOptions: [] // 任教科目
            },
            cityList: cityData.cityData,
            ruleForm: {
                isEdit: 0
            },
            rules: {
                // workerName: [
                //     { required: true, message: '请输入姓名', trigger: 'blur' },
                //     { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                // ],
                // workerGender: [
                //     { required: true, message: '请选择性别', trigger: 'change' }
                // ],
                // workerPhone: [
                //     { required: true, message: '请输入手机号码', trigger: 'blur' },
                //     {
                //         validator: function(rule, value, callback) {
                //             var MobileRegex = /^1[0-9]{10}$/
                //             if (!MobileRegex.test(value)) {
                //                 callback(new Error('手机号码格式不正确！'))
                //             } else {
                //                 callback()
                //             }
                //         },
                //         trigger: 'blur'
                //     }
                // ],
                // certificatesType: [
                //     { required: true, message: '请输入证件类型', trigger: 'change' }
                // ],
                // certificatesNum: [
                //         { required: true, message: '请输入身份证号码', trigger: 'blur' },
                //         {
                //             validator: function(rule, value, callback) {
                //                 var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                //                 if (!regIdNo.test(value)) {
                //                     callback(new Error('身份证号码格式不正确！'))
                //                 } else {
                //                     callback()
                //                 }
                //             },
                //             trigger: 'blur'
                //         }
                //     ] ,
                // politicalOutlook: [
                //     { required: true, message: '请输入政治面貌', trigger: 'change' }
                // ],
                // workerType: [{
                //     required: true,
                //     message: '请选择岗位',
                //     trigger: 'change'
                // }]
            }
        }
    },
    mounted() { // 进页面默认执行方法
        this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
        this.$nextTick(function() {
            this.refresh()
        })
    },
    methods: {
        refresh() {
            // 获取上个页面的缓存
            this.ruleForm = JSON.parse(sessionStorage.getItem('EditData'))
            console.log(this.ruleForm.isEdit) // isEdit=0是补录，isEdit=1是查看页面
            this.fullscreenLoading = true
            this.$api.promise({
                    method: 'POST',
                    // url: 'dictConf/selectDictConfLsit',
                    url: 'baseInfo/staffManage/staffInfoSelect',
                    data: this.confId
                })
                .then(res => {
                    this.fullscreenLoading = false
                    if (res.data.code > 0) {
                        this.alllist = res.data.data
                        let obj = Object.assign(res.data.data.workerCourse, res.data.data.worker, res.data.data.workerDomicile, res.data.data.user)
                        this.alllist.forEach((value, key) => {
                            switch (value.dictType) {
                                case 'POSITION': // 岗位
                                    this.allOptions.workerTypeOptions.push(value)
                                    break
                                case 'COURSE': // 科目
                                    this.allOptions.CoursesOptions.push(value) // 科目
                                    break
                                case 'EDUCATION': // 最高学历
                                    this.allOptions.educationOptions.push(value) // 最高学历
                                    break
                                case 'NATION': // 民族
                                    this.allOptions.nationOptions.push(value) // 最高学历
                                    break
                                case 'POLITICAL_OUTLOOK': // 政治面貌
                                    this.allOptions.politicalOptions.push(value) // 最高学历
                                    break
                            }
                        })
                        let arr = ['native', 'households', 'address']
                        for (let index = 0; index < arr.length; index++) {
                            this.$set(this.ruleForm, arr[index] + 'List', [obj[arr[index] + 'Province'], obj[arr[index] + 'City'], obj[arr[index] + 'Area']])
                        }
                    } else {
                        this.$message.error(res.data.desc)
                    }
                })
                .catch(err => {
                    this.fullscreenLoading = false
                    this.$message.error('接口异常：' + err)
                })
        },
        searchFun() {
            if (this.searchstr !== '') {
                this.fullscreenLoading = true
                this.tableData = this.copydata.filter(o => {
                    return Object.keys(o).some(d => {
                        return (typeof o[d] === 'string') ? o[d].indexOf(this.searchstr) > -1 : o[d].toString().indexOf(this
                            .searchstr) > -1
                    })
                })
            } else {
                this.tableData = this.copydata
            }
            this.fullscreenLoading = false
            this.total = this.tableData.length
        },
        editInfo() {
            this.ruleForm.isEdit = 0
            this.isdisable = true
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let Url
                    if (this.ruleForm.isEdit === 0) {
                        Url = 'staffManage/saveWorkerList'
                    } else if (this.ruleForm.isEdit === 1) {
                        let arr = ['native', 'households', 'address']
                        for (let index = 0; index < arr.length; index++) {
                            this.ruleForm[arr[index] + 'Province'] = this.ruleForm[arr[index] + 'List'][0]
                            this.ruleForm[arr[index] + 'City'] = this.ruleForm[arr[index] + 'List'][1]
                            this.ruleForm[arr[index] + 'Area'] = this.ruleForm[arr[index] + 'List'][2]
                        }
                        Url = 'staffManage/updateWorker'
                    }

                    this.$ajax({
                        method: 'POST',
                        url: Url,
                        data: this.ruleForm
                    }).then(re => {
                        this.fullscreenLoading = false
                        this.refresh()
                        this.ruleForm.isEdit = 1
                        this.isdisable = false
                    }).catch(err => {
                        this.fullscreenLoading = false
                        this.$message.error('接口异常：' + err)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        cancelInfo(v) {
            // 如果是编辑状态点击取消按钮执行弹出框
            this.dialogVisible = true
        },
        resetForm(formName) {
            // 确定取消
            this.dialogVisible = false
            this.isdisable = false
            this.ruleForm.isEdit = 1
                // this.$refs[formName].resetFields()
                // 如果是编辑状态点击取消按钮执行
        },
        selValChangeFn(value, index) {
            // this.ruleForm.politicalOutlookName = this.allOptions.politicalOptions.filter(re => re.dictCode === value)[0].dictValue
            switch (index) {
                case 'politicalOutlookName': // 政治面貌
                    this.ruleForm[index] = this.allOptions.politicalOptions.filter(re => re.dictCode === value)[0].dictValue
                    break
                case 'userNationName': // 民族
                    this.ruleForm[index] = this.allOptions.nationOptions.filter(re => re.dictCode === value)[0].dictValue
                    break
                case 'highestEducationName': // 民族
                    this.ruleForm[index] = this.allOptions.educationOptions.filter(re => re.dictCode === value)[0].dictValue
                    break
                case 'workerTypeName': // 民族
                    this.ruleForm[index] = this.allOptions.workerTypeOptions.filter(re => re.dictCode === value)[0].dictValue
                    break
            }
        }
    },
    filters: {
        changeBirthday: function(value) {
            if (!value) return ''
            var retime = ''
            var time // 具体时间
            var reg = '-'
            if (parseInt(value) > 0) {
                var date = new Date(value)
                var year = date.getYear() + 1900
                var month = date.getMonth() + 1
                month = month < 10 ? '0' + month : month
                var day = date.getDate()
                day = day < 10 ? ('0' + day) : day
                var h = date.getHours()
                var m = date.getMinutes()
                var s = date.getSeconds()
                h = h < 10 ? ('0' + h) : h
                m = m < 10 ? ('0' + m) : m
                s = s < 10 ? ('0' + s) : s
                if (reg === '-' || reg === '/') {
                    date = year + reg + month + reg + day
                } else {
                    date = year + '年' + month + '月' + day + '日'
                }
                return date
            } else {
                return retime
            }
        },
        getIdShowname: function(value) {
            console.log()
        }

    }
}