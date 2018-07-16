export default {
    data() {
        return {
            isEdit: false, // 是否编辑状态
            barNameArr: [],
            total: 0,
            size: 50,
            currentPage: 1,
            fullscreenLoading: false,
            activeName: 'first',
            tableData: [],
            value1: '', // 当前单选
            value2: '', // 当前多选
            date: '', // 当前时间
            tab: 'first', // 当前tab
            searchstr: '', // 当前输入
            scrColumn: [ // 表头
                { text: '姓名', field: 'workerName', selected: true, align: 'center' },
                { text: '性别', field: 'workerGenderName', selected: true, align: 'center' },
                { text: '任职岗位', field: 'workerTypeName', selected: true },
                { text: '任教科目', field: 'workerCourses', selected: true },
                { text: '手机号码', field: 'workerPhone', selected: true },
                { text: '政治面貌', field: 'politicalOutlookName', selected: true },
                { text: '出生日期', field: 'userBirthday', selected: true },
                { text: '入职日期', field: 'entryTime', selected: true }
            ],
            printOb: { // 打印所需
                pageNum: 1,
                title: '项目列表'
            }
        }
    },
    mounted() { // 进页面默认执行方法
        this.barNameArr = this.$route.name ? this.$route.name.split('>') : []
    },
    methods: {
        handleSizeChange(val) {
            this.size = val
            this.handleCurrentChange()
        },
        handleCurrentChange(val) {
            this.currentPage = val || this.currentPage
            this.tableData = this.copydata.slice(
                (this.currentPage - 1) * this.size,
                this.currentPage * this.size
            )
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
        download() {
            // 点击下载模板
            // window.location.href = 'www.baidu.com'
            // 跳转到补录页面
            // this.$router.push({// 页面跳转
            //   path: '../static/images/captcha.jpg'
            // })
        }, // 文件导入  文件上传成功
        uploadSuccessFun: function(response, file) {
            if (response.code > 0) {
                this.isEdit = true
                this.previewdata = this.analysisFun(response.data.content)
                this.$message.success('上传成功！')
            } else {
                this.$message.error(response.desc)
            }
        },
        // 文件导入  文件上传失败
        uploadErrorFun: function(err, file, fileList) {
            this.$message.error(err)
            console.log('失败')
        }
    }
}