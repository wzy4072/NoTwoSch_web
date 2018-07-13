import endpoint from '@/api/endpoint';

export default {
  getPageResult(search) {
    return endpoint.http().post("/asn/search", search).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  saveAsn(asn, id = null) {
    const url = id ? '/asn/' + id : '/asn';
    return endpoint.http().post(url, asn).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getAsn(asnId) {
    return endpoint.http().get("/asn/" + asnId).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  delAsn(asnId) {
    return endpoint.http().post("/asn/del/" + asnId).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  inboundAsn(ids) {
    return endpoint.http().post("/asn/inbound", ids).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  }
}
