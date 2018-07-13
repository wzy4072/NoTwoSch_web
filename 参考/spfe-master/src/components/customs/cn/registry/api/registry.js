import endpoint from '@/api/endpoint'

export default {
  list(query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/registry", {
        params: {
          q: query,
          p: pageNo,
          s: pageSize
        }
      })
      .then(response => response.data);
  },
  load(id) {
    return endpoint.http()
      .get("/customs/cn/registry/" + id)
      .then(response => response.data);
  },
  save(id, data) {
    if (id != null) {
      return endpoint.http()
        .post("/customs/cn/registry/" + id, data)
        .then(response => response.data);
    } else {
      return endpoint.http()
        .post("/customs/cn/registry", data)
        .then(response => response.data);
    }
  }
}
