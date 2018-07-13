import endpoint from '@/api/endpoint'

export default {
  codeList(type) {
    return endpoint.http()
      .get("/customs/cn/code-table", {
        params: {
          type: type
        }
      })
      .then(response => response.data);
  }
}
