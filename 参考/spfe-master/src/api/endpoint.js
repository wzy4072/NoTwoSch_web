import axios from 'axios';

export default {
  url() {
    if (window['APP_ENDPOINT_URL'] === '__APP_ENDPOINT__') {
      return "http://localhost:8080";
    } else {
      return window['APP_ENDPOINT_URL'];
    }
  },
  http() {
    var instance = axios.create({
      baseURL: this.url(),
      withCredentials: true
    });
    instance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              window.location = this.url() + '/login';
              return Promise.resolve({ });
          }
        }
        return Promise.reject(error);
      });
    return instance;
  },
  no_interceptors_http() {
    var instance = axios.create({
      baseURL: this.url()
    });
    return instance;
  }
}
