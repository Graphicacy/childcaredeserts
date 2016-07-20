// first import the polyfill for Promises.
import axios from 'axios';
import _ from 'lodash';
import DEFAULT_CONFIG from './config';

export default class BaseApi {
  constructor (cache = null, config = null) {
    this.cache = cache;
    this.config = config || DEFAULT_CONFIG;
    let apiUrl = this.config().apiUrl + '/';
    
    // TODO: discuss what endpoints we'll use for
    // deployment and replace this line with the 
    // one below.
    this.httpClient = axios.create();
    // this.httpClient = axios.create({baseURL: apiUrl});
  }

  get (endpoint, config) {
    return this.httpClient.get(endpoint)
      .then((response) => {
        return response.data;
      }).catch((response) => {
        return this.handleFailure(response);
      });
  }

  put (endpoint, data) {
    return this.httpClient.put(endpoint, data)
      .catch((response) => {
        return this.handleFailure(response);
      });
  }

  delete (endpoint) {
    return this.httpClient['delete'](endpoint)
      .catch((response) => {
        return this.handleFailure(response);
      });
  }

  patch (endpoint, data) {
    return this.httpClient.patch(endpoint, data)
      .catch((response) => {
        return this.handleFailure(response);
      });
  }

  post (endpoint, data) {
    return this.httpClient.post(endpoint, data)
      .catch((response) => {
        return this.handleFailure(response);
      });
  }

  handleFailure(response) {
    return Promise.reject(response);
  }
}
