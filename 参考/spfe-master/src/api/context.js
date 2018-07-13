import endpoint from './endpoint.js'

export default {
  current() {
    return endpoint.http().get("/context").then(resp => resp.data);
  }
}
