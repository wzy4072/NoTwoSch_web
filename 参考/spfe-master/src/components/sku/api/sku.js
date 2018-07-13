import endpoint from '@/api/endpoint';

export default {
  getImportExportTypes() {
    return [
      {
        label: '进口',
        value: 'import'
      },
      {
        label: '出口',
        value: 'export'
      },
      {
        label: '内销',
        value: 'domestic'
      }
    ]
  },
  create(id = null, code = null, name = null, description = null, virtual = false, types = [], salesUnit = "",
    grossWeight = null, netWeight = null, volume = null, skuBom = [], prePackings = []) {
    return {
      id: id,
      code: code,
      name: name,
      description: description,
      virtual: false,
      types: [],
      salesUnit: null,
      grossWeight: grossWeight,
      netWeight: netWeight,
      volume: volume,
      skuBom: skuBom,
      prePackings: prePackings
    };
  },
  save(sku) {
    return endpoint.http().post('sku', sku).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getOption(query, id) {
    return endpoint.http().get('sku/option', {
      params: {
        query: query,
        id: id
      }
    }).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getPageResult(query, pageNo, pageSize, sortColumns) {
    return endpoint.http().get("sku",
      {
        params: {
          q: query,
          p: pageNo,
          s: pageSize
        }
      })
      .then(resp => resp.data);
  },
  get(id) {
    return endpoint.http().get('sku/' + id).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getBom(id) {
    return endpoint.http().get('sku/bom/' + id).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  },
  getPrepacking(skuId, containerTypeId) {
    return endpoint.http().get('sku/' + skuId + '/prepacking',
      {
        params: {
          containerTypeId: containerTypeId
        }
      })
      .then(resp => resp.data)
      .catch(error => {
        if (error.response) {
          throw error.response.data;
        } else {
          throw error;
        }
      });
  },
  getSkus(skuIds) {
    return endpoint.http().get('sku/measurement',
      {
        params: {
          id: skuIds
        }
      })
      .then(resp => {
        return resp.data;
      })
      .catch(error => {
        if (error.response) {
          throw error.response.data;
        } else {
          throw error;
        }
      });
  }
}
