import endpoint from '@/api/endpoint'
export default {
  /**
   * 获取学生列表
   */
  getStuList() {
    var path = '/stu/list'
    return endpoint.http().post(path).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })

  },
  getStyById(id) {
    var path = '/stu/' + id
    return endpoint.http().post(path).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })

  },
  addStu(data) {
    var path = '/stu/new'
    return endpoint.http().post(path, data).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })
  },
  delStu(data) {
    var path = '/stu/del'
    return endpoint.http().post(path, data).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })
  }
}
