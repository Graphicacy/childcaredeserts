// first import the polyfill for Promises.
import axios from 'axios';
import DEFAULT_CONFIG from './config';

export default class BaseApi {
  constructor (cache = {}, config = null) {
    this.cache = cache;
    this.config = config || DEFAULT_CONFIG;
    //const apiUrl = this.config().apiUrl + '/';

    // TODO: discuss what endpoints we'll use for
    // deployment and replace this line with the
    // one below.
    this.httpClient = axios.create();
    // this.httpClient = axios.create({baseURL: apiUrl});
  }

  get(endpoint) {
    // implement really really simple caching for now.
    if (this.cache[endpoint]) {
      return this.cache[endpoint];
    }

    const request = this.httpClient.get(endpoint)
      .then((response) => {
        return response.data;
      }).catch((response) => {
        return this.handleFailure(response, endpoint);
      });

    // stuff the promise in the cache...
    this.cache[endpoint] = request;
    return this.cache[endpoint];
  }

  handleFailure(response, endpoint) {
    delete this.cache[endpoint];
    return Promise.reject(response);
  }
}
