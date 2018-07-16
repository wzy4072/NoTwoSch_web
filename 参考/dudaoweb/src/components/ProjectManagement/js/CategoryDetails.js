import ue from '@/common/components/ueditor.vue'
export default {
  components: { ue },
  data () {
    return {
      stepStatus: 0,
      token: { 'authorization': sessionStorage.getItem('user_token') },
      steps: [],
      status: ['未开始', '进行中', '已完成'],
      clickIndex: 0,
      edit: false,
      dialogVisible: false,
      data: [],
      fileList: [],
      fileSendlist: [],
      maindata: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      maindata1: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      maindata2: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      maindata3: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      maindata4: {
        intdata: '',
        outdata: '',
        outdataTxt: ''
      },
      prop: {
        label: 'menuName',
        children: 'childMenus'
      },
      comment: {
        commentContent: ''
      },
      importFileUrl: '',
      itemId: '',
      select: '',
      itemName: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      config1: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      config2: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      config3: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      },
      config4: {
        initialFrameWidth: null,
        initialFrameHeight: 320
      }
    }
  },
  created () {
    this.pageInt()
  },
  methods: {
    pageInt () {
      this.itemId = sessionStorage.getItem('itemId')
      this.$ajax({
        method: 'post',
        data: { itemId: this.itemId },
        url: 'procedural/processItem/findProcessItemDetails'
      }).then((res) => {
        this.stepStatus = res.data.data.stepStatus
        this.itemName = res.data.data.itemName
        this.steps = res.data.data.steps
        if (Array.isArray(this.steps[1].attachments) && this.steps[1].attachments.length > 0) {
          this.fileList = this.steps[1].attachments.map(o => ({name: o.attName, url: o.attUrl}))
        }
      })

      let treeType = this.$route.query.treeType
      let url = ''
      treeType === 1 ? url = 'procedural/processItem/findMenuOne' : treeType === 2 ? url = 'procedural/processItem/findMenuTwo' : url = 'procedural/processItem/findMenuThree'
      this.$ajax({
        method: 'post',
        url: url
      }).then((res) => {
        this.data = this.formatTree(res.data.list, 0)
      })

      this.baseUrl = this.$api.baseUrl
      this.importFileUrl = this.$api.baseUrl + '/baseInfo/dictConf/uploadFile'
    },
    clStep (val) {
      if (this.clickIndex !== val) {
        this.clickIndex = val
      }
      this.edit = false
    },
    formatDate (val) {
      return this.$api.getDateAll.apply(null, arguments)
    },
    UploadUrl: function () { // :action执行函数，上传的地址
      return this.importFileUrl
    },
    uploadSuccessFun: function (files, fileList) {
      // 成功之后返回fileList
      let index = files.list[0].lastIndexOf('.')
      let attType = files.list[0].substring(index, files.list[0].length)
      let obj = {
        'name': fileList.name,
        'attName': fileList.name,
        'attUrl': files.list[1],
        'attType': attType,
        'attSize': fileList.size / 1024 / 1024
      }
      this.fileSendlist.push(obj)
    },
    beforeAvatarUpload () {},
    uploadErrorFun () {},
    addComment () {
      if (this.comment.commentContent !== '') {
        this.comment.commentType = 1 // 1.过程步骤评论
        this.comment.bussessId = this.steps[this.clickIndex]['stepId']
        this.$ajax({
          method: 'post',
          data: this.comment,
          url: 'procedural/Processsspm/addComment'
        }).then((res) => {
          this.$message.success('评论成功！')
          this.pageInt()
        })
      } else {
        this.$message.error('留言不能为空！')
      }
    },
    formatTree (list, lev) {
      let array = []
      list.forEach(o => {
        o.level = lev
        array.push(o)
        if (Array.isArray(o.childMenus) && o.childMenus.length > 0) {
          let arrd = this.formatTree(o.childMenus, lev + 1)
          array = array.concat(arrd)
        }
      })
      return array
    },
    save (type) {
      this.$confirm('确定提交？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let datalist = []
        // let array = this.steps[this.clickIndex].processStepcontents.map((o, k) => {
        //   o.stepId = this.steps[this.clickIndex].stepId
        //   o.attachments = []
        //   o.attachments = this.fileSendlist

        //   this.clickIndex === 1 && (o.content = this.maindata.outdata)
        //   this.clickIndex === 2 && (o.content = this.maindata.outdata)
        //   if (this.clickIndex === 3) {
        //     switch (k) {
        //       case 0:
        //         o.content = this.maindata.outdata
        //         break
        //       case 1:
        //         o.content = this.maindata1.outdata
        //         break
        //       case 2:
        //         o.content = this.maindata2.outdata
        //         break
        //       case 3:
        //         o.content = this.maindata3.outdata
        //         break
        //     }
        //   }
        //   this.clickIndex === 4 && (o.content = this.maindata.outdata)
        //   // this.clickIndex === 5 && (o.content = this.maindata.outdata)
        //   // this.clickIndex === 6 && (o.content = this.maindata.outdata)
        //   console.log(o)
        //   return o
        // })

        let array = []
        this.steps[this.clickIndex].processStepcontents.forEach((v, k) => {
          let obj = {}
          obj.stepId = this.steps[this.clickIndex].stepId
          obj.attachments = []
          obj.attachments = this.fileSendlist
          obj.content = ''
          obj.contentId = v.contentId
          this.clickIndex === 0 && (obj.content = v.content)
          this.clickIndex === 1 && (obj.content = this.maindata.outdata)
          this.clickIndex === 2 && (obj.content = this.maindata.outdata)
          this.clickIndex === 4 && (obj.content = this.maindata.outdata)
          if (this.clickIndex === 3 || this.clickIndex === 5 || this.clickIndex === 6) {
            switch (k) {
              case 0:
                obj.content = this.maindata.outdata
                break
              case 1:
                obj.content = this.maindata1.outdata
                break
              case 2:
                obj.content = this.maindata2.outdata
                break
              case 3:
                obj.content = this.maindata3.outdata
                break
              case 4:
                obj.content = this.maindata4.outdata
                break
            }
          }
          array.push(obj)
        })
        console.log(array)
        let submit = {
          itemId: this.itemId,
          itemCode: this.itemCode,
          itemName: this.itemName,
          stepId: this.steps[this.clickIndex].stepId,
          stepStatus: type,
          stepcontents: array
        }
        this.$ajax({
          method: 'post',
          data: submit,
          url: 'procedural/processItem/addStepcontent'
        }).then((res) => {
          if (type === 1) {
            this.$message.success('保存成功！')
          } else if (type === 2) {
            this.$message.success('提交成功！')
          }
          this.edit = false
          this.pageInt()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    editF () {
      if (this.steps[this.clickIndex].processStepcontents.length === 0) {
        if (this.clickIndex === 0 || this.clickIndex === 3 || this.clickIndex === 5 || this.clickIndex === 6) {
          let arr = [{content: ''}, {content: ''}, {content: ''}, {content: ''}, {content: ''}]
          this.steps[this.clickIndex].processStepcontents = arr
        } else if (this.clickIndex === 1 || this.clickIndex === 2 || this.clickIndex === 4) {
          let arr = [{content: ''}]
          this.steps[this.clickIndex].processStepcontents = arr
        }
      }
      if (this.steps[this.clickIndex].stepStatus === 0) { this.steps[this.clickIndex].stepStatus = 3 } // 未保存的进行中
      this.maindata.intdata = this.steps[this.clickIndex].processStepcontents[0]['content']
      // 已经添加的附件显示
      if (this.steps[this.clickIndex].processStepcontents[0].attachments) {
        this.fileSendlist = []
        this.steps[this.clickIndex].processStepcontents[0].attachments.forEach((val, key) => {
          this.$set(val, 'name', val.attName)
          let obj = {
            'attName': val.attName,
            'attUrl': val.attUrl,
            'attType': val.attType,
            'attSize': val.attSize
          }
          this.fileSendlist.push(obj)
        })
      }
      this.fileList = this.steps[this.clickIndex].processStepcontents[0].attachments
      this.edit = true
    },
    cancelEdit () {
      // this.steps[this.clickIndex].stepStatus === 3 ? this.steps[this.clickIndex].stepStatus = 0 : this.steps[this.clickIndex].stepStatus = 1
      // let arr = [{content: ''}, {content: ''}, {content: ''}, {content: ''}, {content: ''}]
      // this.steps[this.clickIndex].processStepcontents = arr
      this.pageInt()
      this.edit = false
    },
    rowclick (row) {
      this.select = row
    },
    Determine () {
      this.itemName = this.select.menuName
      this.itemCode = this.select.menuCode
      this.dialogVisible = false
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, { confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'}).then(() => {
          this.fileSendlist.forEach((o, k) => {
            if (file.name === o.name) {
              this.fileSendlist.splice(1)
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getContents: function () {
    //  console.log(this.maindata.outdata)
    },
    returnPre: function () {
      this.$router.go(-1)
    },
    UploadUrl: function () { // :action执行函数，上传的地址
      return this.importFileUrl
    },
    design () {
      if (this.clickIndex + 1 >= this.stepStatus) {
        this.dialogVisible = true
      }
    }
  }
}
