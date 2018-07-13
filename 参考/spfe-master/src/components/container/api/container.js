import endpoint from '@/api/endpoint';
export default {
  getAll() {
    return endpoint.http().get("container-type/option")
      .then(resp => resp.data)
      .catch(err => {
        console.log("Error Getting container types!");
        console.log(err);
        throw err;
      });
  },
  list(query, pageNo, pageSize, sortColumns) {
    return endpoint.http()
      .get("/container-type", {
        params: {
          q: query,
          p: pageNo,
          s: pageSize
        }
      })
      .then(response => response.data);
  },
  load(id) {
    if (id == null) {
      return Promise.reject(Error("ContainerType ID not specified"));
    }
    return endpoint.http()
      .get("/container-type/" + id)
      .then(response => response.data);
  },
  save(containerType) {
    if (containerType.id != null && containerType.id !== "") {
      return endpoint.http().post("/container-type/" + containerType.id, containerType)
        .catch(resp => {
          if (resp.response) {
            throw resp.response.data;
          } else {
            console.log(JSON.stringify(resp));
            throw resp;
          }
        });
    } else {
      return endpoint.http().post("/container-type", containerType)
        .catch(resp => {
          if (resp.response) {
            throw resp.response.data;
          } else {
            console.log(JSON.stringify(resp));
            throw resp;
          }
        });
    }
  }
}
