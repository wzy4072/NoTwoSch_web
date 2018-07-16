export default{
  data () {
    return {
      maindata: [],
      groupData: {
        groupId: null,
        groupName: '',
        people: []
      },
      filterText: '', // 筛选树
      checkTreeData: [], // 已勾选的tree
      treeData: [],
      defaultProps: { // tree data配置
        children: 'list',
        label: 'name'
      },
      dialogTitle: '',
      dialogVisible: false,
      dialogVisible1: false,
      manualInput: '', // 手动输入成员名字
      isEdit: 1
    }
  },
  mounted () {
    this.getMainDataFun()
    this.getTreeDataFun()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    getMainDataFun () { // 获取人员分组列表信息
      this.$ajax({
        method: 'post',
        url: 'feedback/questionGroup/selectGroupList',
        data: {}
      }).then(re => {
        this.maindata = re.data.list
        this.maindata.forEach(re => {
          this.$set(re, 'check', false)
        })
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },
    getTreeDataFun () { // 获取树的数据
      this.$ajax({
        method: 'POST',
        url: 'feedback/question/availableRanges',
        data: {'questionnaireId': null}
      }).then(re => {
        this.treeData = re.data.list.filter(re => { return re.currentId !== 'G' })
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },
    newGroupFun () { // 新增分组
      this.isEdit = 0
      this.dialogTitle = '新增分组'
      this.groupData.groupId = ''
      this.groupData.groupName = ''
      this.groupData.people = []
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([], false)
      })
    },
    batchDelGroupFun () { // 批量删除分组函数
      let dataArr = []
      this.maindata.forEach((re, k) => {
        if (re.check) {
          dataArr.push(re.groupId)
        }
      })
      if (dataArr.length === 0) {
        this.$message.error('请勾选需要删除的分组')
        return false
      }
      this.$ajax({
        method: 'post',
        url: 'feedback/questionGroup/deleteGroupBy',
        data: dataArr
      }).then(res => {
        dataArr.forEach(re => {
          for (let index = this.maindata.length - 1; index >= 0; index--) {
            if (re === this.maindata[index].groupId) {
              this.maindata.splice(index, 1)
            }
          }
        })
        this.$message.success('删除成功！')
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },
    deleteGroupFun (id, index) { // 删除人员分组函数
      this.$ajax({
        method: 'POST',
        url: 'feedback/questionGroup/deleteGroupBy',
        data: [id]
      }).then(re => {
        this.maindata.splice(index, 1)
        this.$message.success('删除成功！')
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
    },

    delGroupMenberFun (value, index) { // 删除分组成员函数
      this.groupData.people.splice(index, 1)
      this.$refs.tree.setChecked(value.currentId, false)
    },

    editGroupFun (value) { // 人员分组编辑
      let idArr = []
      this.isEdit = 1
      this.dialogTitle = '编辑分组'
      this.groupData.groupId = value.groupId
      this.groupData.groupName = value.groupName
      this.groupData.people = value.sonList
      value.sonList.forEach(re => {
        idArr.push(re.currentId)
      })
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(idArr, true)
      })
    },
    filterNode (value, data) { // tree筛选函数
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    treeNodeCheckFun (data, obj) { // 树节点复选框点击函数
      this.groupData.people = []
      obj.checkedNodes.forEach(re => {
        if (re.isParent === 0) {
          this.groupData.people.push(re)
        }
      })
    },
    dialogComfireFun () { // 分组弹窗确认
      if (!this.groupData.groupName) {
        this.$message.error('请填写分组名')
        return false
      }
      if (this.maindata.filter(re => { return re.groupName === this.groupData.groupName }).length > 0 && this.isEdit === 0) {
        this.$message.error('分组名已存在，请修改后在提交')
        return false
      }
      this.groupData.people.forEach(re => {
        re.peopleName = re.name
        re.peopleId = re.currentId
      })
      this.$ajax({
        method: 'post',
        url: 'feedback/questionGroup/saveGroupBy',
        data: this.groupData
      }).then(re => {
        this.$message.success('保存成功！')
        this.getMainDataFun()
        this.getTreeDataFun()
      }).catch(err => {
        this.$message.error('接口异常' + err)
      })
      this.dialogVisible = false
    },

    addDialogComfireFun () { // 手动添加组员弹窗确认
      if (!this.manualInput) {
        this.$message.error('请输入人名')
        return false
      }
      let [childDataList, manualInputArr, checkNodes, selectedArr] = [[], [], [], this.$refs.tree.getCheckedNodes()]
      for (let index = selectedArr.length - 1; index >= 0; index--) { // ztree 已勾选数据去除父级
        const element = selectedArr[index]
        if (element.isParent === 1) {
          selectedArr.splice(index, 1)
        }
      }
      if (selectedArr.length > 0) { // ztree是否有已勾选数据
        manualInputArr = manualInputArr.concat(selectedArr.map(re => re.name))
      }
      this.getChildData(this.treeData, childDataList) // 找tree 的人员信息
      manualInputArr = manualInputArr.concat(this.manualInput.split('\n').filter(re => { return re !== '' }))
      manualInputArr.forEach(res => { // 在treedata 中找到手动添加的人名信息
        childDataList.forEach(re => {
          if (res === re.name) {
            checkNodes.push(re)
          }
        })
      })
      for (let i = 0; i < checkNodes.length; i++) { // 数组去重
        for (let j = i + 1; j < checkNodes.length; j++) {
          if (checkNodes[i].currentId === checkNodes[j].currentId) {
            checkNodes.splice(j, 1)
            j--
          }
        }
      }
      if (checkNodes.length === manualInputArr.length) { // 判断是否有不在选择范围内的数据
        this.$refs.tree.setCheckedKeys(checkNodes.map(re => re.currentId), true)
        this.groupData.people = this.groupData.people.concat(checkNodes)
        for (var i = 0; i < this.groupData.people.length - 1; i++) {
          for (var j = i + 1; j < this.groupData.people.length; j++) {
            if (this.groupData.people[i].name === this.groupData.people[j].name && this.groupData.people[i].currentId === this.groupData.people[j].currentId) {
              this.groupData.people.splice(j, 1)
            }
          }
        }
      } else {
        this.$message.error('用户不存在或存在多个相同姓名的用户，请检查后重新添加')
      }
      this.dialogVisible1 = false
    },
    getChildData (data, arr) { // 递归找到tree 组织架构下的所有人员列表
      data.forEach(re => {
        if (!re.isParent) {
          arr.push(re)
        } else {
          this.getChildData(re.list, arr)
        }
      })
    }
  }
}
