import endpoint from '@/api/endpoint'

export default {
  query(query) {
    return endpoint.http().get("/customs/cn/product",
      {
        params: {
          query
        }
      })
      .then(resp => resp.data)
      .catch(err => {
        console.log("Error Getting china customs product!");
        console.log(err);
        throw err;
      });
  },
  load(hscode) {
    return endpoint.http().get("/customs/cn/product/" + hscode)
      .then(resp => resp.data)
      .catch(err => {
        console.log("Error Getting china customs product for hscode:" + hscode);
        console.log(err);
        throw err;
      });
  }
}
