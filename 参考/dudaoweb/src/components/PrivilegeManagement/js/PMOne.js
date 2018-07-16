import returnBtn from '@/common/components/returnBtn'
export default {
  components: { returnBtn },
  data () {
    return {
      roleType: '2',
      searchStr1: '',
      searchStr2: '',
      searchStr3: '',
      roleList: [],
      currRoleId: '', // 当前选中角色Id
      menu1: [], // PC菜单
      menu2: [], // WX菜单
      currRoleMenu1: [], // 当前角色PC权限数组
      currRoleMenu2: [], // 当前角色WX权限数组
      opaStatus1: 1, // 操作状态 1：编辑 2：保存
      opaStatus2: 1, // 操作状态 1：编辑 2：保存
      defaultProps: {
        children: 'childMenus',
        label: 'resName'
      },
      addRoleData: { // 新增角色数据
        roleName: '', // 角色名称
        multiplexId: '' // 复用角色ID
      },
      opaRoleRules: { // 新建+编辑 角色弹框 校验规则
        roleName: [ // 必填项
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      editRoleData: {
        roleName: '',
        roleId: ''
      },
      addRoleLayer: false, // 新建角色弹框
      editRoleLayer: false // 编辑角色弹框
    }
  },
  mounted () {
    this.getRoleList()  // 根据角色类型获取角色列表
    this.getAllMenu(1) // 查询PC菜单权限
    this.getAllMenu(2) // 查询WX菜单权限
  },
  methods: {
    getRoleList () {
      let that = this
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/findRoleList',
        data: {roleType: this.roleType}
      }).then(res => {
        this.roleList = res.data.list
        // 添加字段 searched + selected
        this.roleList.forEach((item, key) => {
          that.$set(item, 'searched', true)
          if (!key) {
            that.$set(item, 'selected', true) // 默认选中第一个
          } else {
            that.$set(item, 'selected', false)
          }
        })
        this.currRoleId = this.roleList[0] ? this.roleList[0].roleId : null
        this.getRoleMenu(1) // 查询角色PC菜单权限
        this.getRoleMenu(2) // 查询角色WX菜单权限
      })
    },
    getAllMenu (type) { // 1：获取PC端菜单 2：获取WX端菜单
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/allMenuList',
        data: { 'resType': type }
      }).then(res => {
        this['menu' + type] = res.data.list
      })
    },
    getRoleMenu (type) { // 1：获取角色PC端菜单 2：获取角色WX端菜单
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/findResourceIdsByRole',
        data: {
          'resType': type,
          'roleId': this.currRoleId
        }
      }).then(res => {
        this['currRoleMenu' + type] = res.data.list
        // 勾选
        this.$refs['tree' + type].setCheckedKeys(this['currRoleMenu' + type], true)
        // 更新tree为不可编辑
        this.$nextTick(function () {
          let labels = document.querySelectorAll('.tree' + type + ' label.el-checkbox')
          labels.forEach((item) => {
            item.classList.add('is-disabled')
            item.firstChild.classList.add('is-disabled')
            item.firstChild.lastChild.setAttribute('disabled', 'disabled')
          })
        })
      })
    },
    opaFun (type, curr) {
      if (type == 3) { // 3:删除
        if (curr.isUse) {
          this.$alert('该角色已被使用，无法删除', '删除提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('确认删除该角色？删除后将无法恢复！', '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(_ => {
            this.$ajax({
              method: 'post',
              url: 'baseInfo/roleController/delRoleById',
              data: {roleId: curr.roleId}
            }).then(res => {
              this.$message.success('删除成功')
              this.getRoleList() // 重新获取列表
            })
          }).catch(_ => {
            this.$message.info('已取消操作')
          })
        }
      } else if (type == 1) { // 1:新增
        this.$refs.addRoleForm.validate((valid) => {
          if (valid) { // 校验通过 -> 提交
            this.addRoleData.roleType = this.roleType
            this.$ajax({
              method: 'post',
              url: 'baseInfo/roleController/saveOrUpdateRole',
              data: this.addRoleData
            }).then(res => {
              this.$message.success('操作成功')
              this.addRoleLayer = false
              this.getRoleList() // 重新获取列表
            })
          }
        })
      } else { // 2:编辑
        this.$refs.editRoleForm.validate((valid) => {
          if (valid) { // 校验通过 -> 提交
            this.editRoleData.roleType = this.roleType
            this.$ajax({
              method: 'post',
              url: 'baseInfo/roleController/saveOrUpdateRole',
              data: this.editRoleData
            }).then(res => {
              this.$message.success('操作成功')
              this.editRoleLayer = false
              this.getRoleList() // 重新获取列表
            })
          }
        })
      }
    },
    changeRole (curr) { // 切换角色
      if (this.currRoleId == curr.roleId) { return false }
      this.currRoleId = curr.roleId
      this.roleList.forEach((item) => {
        if (item.roleId == curr.roleId) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
      this.getRoleMenu(1) // 查询角色PC菜单权限
      this.getRoleMenu(2) // 查询角色WX菜单权限
    },
    opaTree (type) { // 1:PC端 2:移动端
      if (this['opaStatus' + type] == 1) { // 当前按钮为编辑=>tree为不可编辑
        this['opaStatus' + type] = 2
      } else { // 当前按钮为保存=>tree可编辑
        // 保存设置
        let sendData = {
          'resourceIds': [],
          'roleId': this.currRoleId,
          'resType': type
        }
        // 获取选中
        this.$refs['tree' + type].getCheckedNodes().forEach((val) => {
          sendData.resourceIds.push(val.resId)
        })
        // 获取半选中
        this.$refs['tree' + type].getHalfCheckedNodes().forEach((val) => {
          sendData.resourceIds.push(val.resId)
        })
        this.$ajax({
          method: 'post',
          url: 'baseInfo/roleController/saveRoleResource',
          data: sendData
        }).then(res => {
          this.$message.success('保存成功')
          this['opaStatus' + type] = 1
        })
      }
    },
    filterNode1 (value, data) {
      if (!value) return true
      return data.resName.indexOf(value) !== -1
    },
    filterNode2 (value, data) {
      if (!value) return true
      return data.resName.indexOf(value) !== -1
    }
  },
  watch: {
    searchStr2 (val) {
      this.$refs.tree1.filter(val)
    },
    searchStr3 (val) {
      this.$refs.tree2.filter(val)
    },
    searchStr1 (newVal, oldVal) {
      if (!newVal) {
        this.roleList.forEach(element => {
          element.searched = true
        })
      } else {
        this.roleList.forEach(element => {
          if (element.roleName.indexOf(newVal) > -1) {
            element.searched = true
          } else {
            element.searched = false
          }
        })
      }
    },
    roleType (newVal, oldVal) {
      this.getRoleList()
    },
    opaStatus1 (newVal, oldVal) {
      let labels = document.querySelectorAll('.tree1 label.el-checkbox')
      if (newVal == 1) {
        // 更新tree为不可编辑
        labels.forEach((item) => {
          item.classList.add('is-disabled')
          item.firstChild.classList.add('is-disabled')
          item.firstChild.lastChild.setAttribute('disabled', 'disabled')
        })
      } else {
        // 更新tree为可编辑
        labels.forEach((item) => {
          item.classList.remove('is-disabled')
          item.firstChild.classList.remove('is-disabled')
          item.firstChild.lastChild.removeAttribute('disabled')
        })
      }
    },
    opaStatus2 (newVal, oldVal) {
      let labels = document.querySelectorAll('.tree2 label.el-checkbox')
      if (newVal == 1) {
        // 更新tree为不可编辑
        labels.forEach((item) => {
          item.classList.add('is-disabled')
          item.firstChild.classList.add('is-disabled')
          item.firstChild.lastChild.setAttribute('disabled', 'disabled')
        })
      } else {
        // 更新tree为可编辑
        labels.forEach((item) => {
          item.classList.remove('is-disabled')
          item.firstChild.classList.remove('is-disabled')
          item.firstChild.lastChild.removeAttribute('disabled')
        })
      }
    }
  }
}
