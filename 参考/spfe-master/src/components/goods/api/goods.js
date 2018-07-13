import endpoint from '@/api/endpoint';
export default {
  save(goods) {
    var path = (goods.id && goods.id != null) ? `goods/${goods.id}` : 'goods';
    return endpoint.http().post(path, goods).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  load(id) {
    return endpoint.http().get('goods/' + id).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getPageResult(search) {
    return endpoint.http().post("goods/search", search).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  search(query, goodsIdArray = undefined, pageNo = 1, pageSize = 50, sortColumns = null) {
    return this.getPageResult({
      query: query,
      ids: goodsIdArray,
      pageNo: pageNo,
      pageSize: pageSize,
      sortColumns: sortColumns
    });
  }
}
