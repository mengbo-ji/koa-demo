import * as url from 'url'

const request = {
  get url () {
    return this.req.url
  },
  get path() {
    return url.parse(this.req.path).pathname
  },
  get query() {
    return url.parse(this.req.path).query
  },
  get method() {
    return this.req.method
  }
}

export default request