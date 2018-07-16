export default {
  data () {
    return {
      list: [],
      baseUrl: '',
      clickIndex: 0,
      comment: {
        commentContent: ''
      }
    }
  },
  created () {
    this.baseUrl = this.$api.baseUrl
    this.intPage()
  },
  mounted () {},
  methods: {
    intPage () {
      let krtenCode = JSON.parse(sessionStorage.getItem('data')).krtenCode
      let itemId = JSON.parse(sessionStorage.getItem('data')).projectId
      this.$ajax({
        method: 'post',
        url: 'procedural/Processsspm/findLogpList',
        data: {'krtenCode': krtenCode, 'projectId': itemId}
      }).then((res) => {
        if (res.data.data.length > 0) {
          this.list = res.data.data[0].list
        }
      })
    },
    formatDate (val) {
      return this.$api.getDateAll.apply(null, arguments)
    },
    itemClick (index) {
      if (this.clickIndex !== index) {
        this.clickIndex = index
      }
    },
    addComment () {
      if (this.comment.commentContent.length > 200) {
        this.$message.error('长度不能大于200个字符')
        return false
      }
      if (this.comment.commentContent !== '') {
        this.comment.commentType = 2
        this.comment.bussessId = this.list[this.clickIndex]['logId']
        this.$ajax({
          method: 'post',
          data: this.comment,
          url: 'procedural/Processsspm/addComment'
        }).then((res) => {
          this.$message.success('留言成功！')
          this.intPage()
          this.comment.commentContent = ''
        })
      } else {
        this.$message.error('留言不能为空！')
      }
    },
    returnPre () {
      this.$router.go(-1)
    }
  }
}
