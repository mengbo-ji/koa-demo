import * as http from 'http'
import context from './context';
import request from './request'
import response from './response'
import { Stream } from 'stream';
import { Context, Next } from 'koa'

class Koa {
  middleware: any[]
  request: Record<string, any>
  response: Record<string, any>
  context: Record<string, any>

  constructor() {
    this.middleware = []
    // 防止多个实例共享一个ctx
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.context = Object.create(context)
  }

  use(fn: (ctx: Context, next: Next) => void) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function!')
    }
    this.middleware.push(fn)
  }

  listen(port: number, cb: () => void) {
    const server = http.createServer(this.callback())
    server.listen(port, cb)
  }

  callback(): any {
    const fnMiddleware = this.compose(this.middleware)
    const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
      const context = this.createContext(req, res)
      fnMiddleware(context)
        .then(() => {
          let body = context.body;

          if (body === undefined) {
            res.end('Not Found')
          }
          if (body instanceof Stream) {
            res.write(body)
          }
          if (typeof body === 'object') {
            return res.end(JSON.stringify(body));
          }
          res.end(body);
        })
        .catch(() => {
          res.end('error')
        })
    }
    return handleRequest
  }

  compose(middleware: any[]) {
    return function (context: any) {
      return dispatch(0);
      function dispatch(i: number) {
        const fn = middleware[i];
        if (i === middleware.length) {
          return Promise.resolve();
        }
        try {
          const ret = fn(context, dispatch.bind(null, i + 1));
          return Promise.resolve(ret);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    };
  }

  createContext(req: http.IncomingMessage, res: http.ServerResponse) {
    const request = Object.create(this.request)
    const response = Object.create(this.response)
    const context = Object.create(this.context)
    context.app = request.app = response.app = this
    context.req = request.req = req
    context.res = request.res = req
    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    context.originalUrl = request.originalUrl = req.url
    context.state = {} // 初始化 state 数据对象，用于给模板视图提供数据
    return context
  }
}

export default Koa