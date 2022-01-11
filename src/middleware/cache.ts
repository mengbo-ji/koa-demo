import { Context, Next } from 'koa'

export default () => {
  return (ctx: Context, next: Next) => {
    ctx.set({
      'Cache-Control': 'no-store,no-cache'
    })
    next()
  }
}