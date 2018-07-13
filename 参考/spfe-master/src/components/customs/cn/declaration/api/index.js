import endpoint from '@/api/endpoint'

export default {
  convertManifestToDeclItem(manifestLines) {
    return endpoint.http()
      .post("/customs/cn/declaration/convert-manifest", manifestLines)
      .then(response => response.data);
  }
}
