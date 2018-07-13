import endpoint from '@/api/endpoint';

export default {
  getExcelData(resourceId) {
    return endpoint.http().get("/excel/" + resourceId)
      .then(resp => resp.data);
  },
  getExcelSchema(schemaId) {
    return endpoint.http().get(`/excel/schema/${schemaId}`)
      .then(resp => resp.data);
  },
  getExcelPreview(resourceId) {
    return endpoint.http().get(`/excel/preview/${resourceId}`)
      .then(resp => resp.data);
  },
  getExcelBinding(bindingData) {
    return endpoint.http().post(`/excel/temp/${bindingData.resourceId}`, bindingData.binding).then(resp => resp.data).catch(error => {
      if (error.response) {
        throw error.response.data;
      } else {
        throw error;
      }
    });
  }
}
