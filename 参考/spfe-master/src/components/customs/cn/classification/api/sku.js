import endpoint from '@/api/endpoint'

export default {
  list(hscode, query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/sku/" + hscode, {
        params: {
          q: query,
          p: pageNo,
          s: pageSize
        }
      })
      .then(response => response.data);
  },
  classificationList(query, classified, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/customs/cn/sku/classification", {
        params: {
          q: query,
          c: classified,
          p: pageNo,
          s: pageSize
        }
      })
      .then(response => response.data);
  },
  load(skuid) {
    return endpoint.http()
      .get("/customs/cn/sku/classification/" + skuid)
      .then(response => response.data);
  },
  loadAll(skuids) {
    return endpoint.http()
      .post("/customs/cn/sku/classifications", skuids)
      .then(response => response.data);
  },
  save(skuid, data) {
    return endpoint.http()
      .post("/customs/cn/sku/classification/" + skuid, data)
      .then(response => response.data);
  },
  getProductsName(q) {
    return endpoint.http().post("/customs/cn/classification/search", q)
      .then(resp => resp.data)
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  getElementsList(query) {
    return endpoint.http().post("/customs/cn/classification/query", query)
      .then(resp => resp.data)
      .catch(err => {
        console.log(err);
        throw err;
      });
  },
  loadCodeInfo(hscode) {
    return endpoint.http().get("/customs/cn/product/" + hscode)
      .then(resp => resp.data)
      .catch(err => {
        console.log("Error Getting china customs product for hscode:" + hscode);
        console.log(err);
        throw err;
      });
  }
}
