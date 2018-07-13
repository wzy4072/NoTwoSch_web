import endpoint from '@/api/endpoint'

export default {
  list(query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/entity", {
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
      .get("/customs/cn/entity/" + id)
      .then(response => response.data);
  },
  save(id, data) {
    if (id != null) {
      return endpoint.http()
        .post("/customs/cn/entity/" + id, data)
        .then(response => response.data);
    } else {
      return endpoint.http()
        .post("/customs/cn/entity", data)
        .then(response => response.data);
    }
  }
}
