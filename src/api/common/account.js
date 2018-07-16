import endpoint from '../endpoint'
export default {
  login (username, password) {
    return endpoint.http().post("/account/login", {
      username,
      password
    }).then(resp => {
      return resp.data
    }).catch(error => {
      throw error
    })

  },
  checkLogin () {
    return endpoint.http().get("/account/loginstate").then(resp => {
      return resp.data
    }).catch(error => {
      throw error
    })
  }
}
