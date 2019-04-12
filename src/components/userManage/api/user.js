import endpoint from '@/api/endpoint'
export default {
  /**
   * 获取列表
   */
  getUserList(query) {
    var path = '/user/list'
    return endpoint.http().post(path, query).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })

  },

  save(data) {
    var path = '/user/save'
    return endpoint.http().post(path, data).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })
  },
  update(data) {
    var path = '/user/update'
    return endpoint.http().post(path, data).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })
  },
  del(data) {
    var path = '/user/delete'
    return endpoint.http().post(path, data).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data
      } else {
        throw error
      }
    })
  }
}
