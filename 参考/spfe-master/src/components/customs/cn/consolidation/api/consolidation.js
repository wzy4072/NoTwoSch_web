import endpoint from '@/api/endpoint'

export default {
  list(query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/consolidation", {
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
      .get("/customs/cn/consolidation/" + id)
      .then(response => response.data);
  },
  save(id, rule) {
    if (id != null) {
      return endpoint.http()
        .post("/customs/cn/consolidation/" + id, rule)
        .then(response => response.data);
    } else {
      return endpoint.http()
        .post("/customs/cn/consolidation", rule)
        .then(response => response.data);
    }
  },
  relevant(skuIds) {
    if (skuIds != null && skuIds.length > 0) {
      return endpoint.http()
        .post("/customs/cn/consolidation/sku", skuIds)
        .then(response => response.data);
    } else {
      return Promise.resolve([]);
    }
  }
}
