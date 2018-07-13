import endpoint from '@/api/endpoint'

export default {
  list(query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/packing-container", {
        params: {
          q: query,
          p: pageNo,
          s: pageSize
        }
      })
      .then(response => response.data);
  },
  save(id, code) {
    return endpoint.http()
      .post("/customs/cn/packing-container/" + id, {
        code
      }).then(response => response.data);
  },
  remove(id) {
    return endpoint.http()
      .delete("/customs/cn/packing-container/" + id)
      .then(response => response.data);
  }
}
