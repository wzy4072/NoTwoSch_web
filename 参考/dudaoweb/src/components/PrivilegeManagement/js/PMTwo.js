import returnBtn from '@/common/components/returnBtn'
const fun = (result, list, index) => {
  if (!list || !list.length) { return false }
  list.forEach((item, key) => {
    if (item.id) { // 父级
      item.children = []
      item.userName = !index ? item.dictValue : (item.gradeName + item.className)
      item.userId = 'mp' + index + key
      list.forEach((sub_item) => {
        if (sub_item.pid == item.id && !sub_item.id) {
          index && (sub_item.userName = sub_item.userName + (sub_item.parentRelationship ? sub_item.parentRelationship : '家长'))
          item.children.push(sub_item)
        }
      })
      result[index].children.push(item)
    }
  })
}
const transTree = (data, type) => {
  let result = [
    {
      'userId': -1,
      'userName': '教职工',
      'children': []
    },
    {
      'userId': -2,
      'userName': '家长',
      'children': []
    }
  ]
  fun(result, data.WorkerList, 0) // 教职工
  fun(result, data.ParentList, 1) // 家长
  return result
}
export default {
  components: { returnBtn },
  data () {
    return {
      myMark: 0, // 自定义标示 =2 时 表示 PC+移动菜单 均已获取完成
      roleList: [], // 角色列表
      personList: [], // 角色对应人员列表
      personList_c: [], // 角色对应人员列表
      currRole: {}, // 当前选中角色
      limitDetailsLayer: false, // 权限明细
      limitDetailsData: {}, // 当前权限明细数据
      personSetLayer: false, // 人员设置弹框
      currTab: '1', // 1：PC端 2：移动端
      defaultProps1: { // 人员设置树 配置
        children: 'children',
        label: 'userName'
      },
      defaultProps2: { // 权限设置树 配置
        children: 'childMenus',
        label: 'resName'
      },
      roleMenu: [], // 当前显示权限
      roleMenu1: [], // PC端权限
      roleMenu2: [], // 移动端权限
      allPersonList: [], // 所有候选人员名单
      searchStr1: '', // 搜索-已选人员名单
      searchStr2: ''  // 搜索-候选人员名单
    }
  },
  mounted () {
    this.getRoleList() // 获取角色列表
    this.getAllPerson() // 获取所有候选人员列表
  },
  methods: {
    getRoleList () {
      let that = this
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/findRoleList',
        data: {roleType: 2} // 2：幼儿园
      }).then(res => {
        this.roleList = res.data.list
        this.currRole = {}
        this.personList.length = 0
        this.personList_c.length = 0
        // 添加字段 selected
        this.roleList.forEach((element, key) => {
          if (!key) {
            that.$set(element, 'selected', true) // 默认选中第一个
            that.currRole = element
          } else {
            that.$set(element, 'selected', false)
          }
        })
        if (this.currRole.roleName) {
          this.getRolePerson() // 获取角色对应人员名单
        }
      })
    },
    getRolePerson () {
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/roleSeting',
        data: {roleType: 2, roleName: this.currRole.roleName} // 2：幼儿园
      }).then(res => {
        let that = this
        this.personList = res.data.list
        this.personList_c = Object.assign([], this.personList)
        // 添加字段 searched
        this.personList_c.forEach((element) => {
          that.$set(element, 'searched', true)
        })
      })
    },
    getAllPerson () {
      this.$ajax({
        method: 'get',
        url: 'baseInfo/roleController/krtenInfo'
      }).then(res => {
        this.allPersonList.splice(0, this.allPersonList.length) // 清空数组
        // 处理数据 => 树形结构（此处有3级结构）
        this.allPersonList = transTree(JSON.parse(JSON.stringify(res.data.data)))
      })
    },
    changeRole (curr) {
      if (curr.roleId == this.currRole.roleId) return false
      this.roleList.forEach((item) => {
        if (item.roleId == curr.roleId) {
          item.selected = true
          this.currRole = curr
        } else {
          item.selected = false
        }
      })
      this.getRolePerson() // 获取角色对应人员名单
    },
    handleCheck (currNode, obj) {
      let that = this
      this.personList_c.splice(0, this.personList_c.length) // 清空数组
      // 获取所有选中 替换 已选人员
      this.personList_c = obj.checkedNodes.filter((item) => {
        return item.userId && ((item.userId + '').indexOf('mp') == -1)
      }).map((sub_item) => {
        return {
          'roleId': sub_item.roleId,
          'userId': sub_item.userId,
          'userName': sub_item.userName,
          'dictValue': sub_item.dictValue,
          'searched': true,
          'gradeName': sub_item.gradeName,
          'className': sub_item.className
        }
      })
    },
    limitsDetails (roleId) { // 权限明细
      this.myMark = 0 // 初始化
      this.getLimitsMenu(1, roleId)
      this.getLimitsMenu(2, roleId)
    },
    getLimitsMenu (type, roleId) { // 获取明细菜单
      this.$ajax({
        method: 'post',
        url: 'baseInfo/roleController/roleResource',
        data: {
          'roleId': roleId,
          'roleType': 2, // 幼儿园
          'resType': type
        }
      }).then(res => {
        this['roleMenu' + type] = res.data.list
        this.myMark++
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.userName.indexOf(value) !== -1
    },
    personSetFun (curr) { // 人员设置
      let that = this
      this.personList_c = Object.assign([], this.personList)
      this.personSetLayer = true
      setTimeout(function () {
        // 勾选已选人员
        that.$refs.tree2.setCheckedKeys(that.personList_c.map((item) => {
          return item.userId
        }), true)
      }, 200)
    },
    removePerson (curr, index) { // 移除所选人员
      // 删除已选人员
      this.personList_c.splice(index, 1)
      // 取消对应勾选
      this.$refs.tree2.setChecked(curr.userId, false, true)
    },
    setOpaFun (type) {
      if (type == 1) { // 1:取消
        this.personList_c = Object.assign([], this.personList)
        this.$refs.tree2.setCheckedKeys(this.personList_c.map((item) => {
          return item.roleId + '-' + item.userId
        }), true)
        this.$message.info('已取消')
        this.personSetLayer = false
      } else if (type == 2) { // 2:清空
        this.personList_c.splice(0, this.personList_c.length) // 清空数组
        this.$refs.tree2.setCheckedKeys([], true)
        this.$message.success('已清空，保存后生效')
      } else { // 3:保存
        let temp = []
        temp = this.personList_c.map((item) => {
          return {
            'roleId': this.currRole.roleId,
            'userId': item.userId
          }
        })
        if (!temp.length) {
          temp = [{'roleId': this.currRole.roleId}]
        }
        this.$ajax({
          method: 'post',
          url: 'baseInfo/roleController/roleUserAdd',
          data: temp
        }).then(res => {
          this.$message.success('保存成功')
          this.personSetLayer = false
          this.getRolePerson() // 重新获取角色对应人员名单
          this.getAllPerson() // 重新获取人员树
        })
      }
    }
  },
  watch: {
    currTab (val) {
      this.roleMenu = this['roleMenu' + val]
    },
    searchStr1 (newVal, oldVal) {
      if (!newVal) {
        this.personList.forEach(element => {
          element.searched = true
        })
      } else {
        this.personList.forEach(element => {
          if (element.userName.indexOf(newVal) > -1) {
            element.searched = true
          } else {
            element.searched = false
          }
        })
      }
    },
    searchStr2 (val) {
      this.$refs.tree2.filter(val)
    },
    myMark (val) {
      if (val == 2) {
        this.limitDetailsLayer = true
        this.roleMenu = this['roleMenu' + this.currTab]
      }
    }
  }
}
