import { Context, Next } from 'koa'

export default () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.statusCode || err.status || 500
      ctx.body = {
        msg: err.message
      }
      ctx.app.emit('error', err, ctx)
    }
  }
}