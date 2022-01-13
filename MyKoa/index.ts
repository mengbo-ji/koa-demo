import Koa from './lib/koa'
import {Context, Next} from 'koa'

const app = new Koa()

app.use((ctx: Context, next: Next) => {
  ctx.body = 'foo'
  next()
})

app.use((ctx: Context, next: Next) => {
  ctx.body = 'bar'
  next()
})

app.listen(1234, () => console.log('server is running as port 1234...'))
