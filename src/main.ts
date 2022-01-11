import * as Koa from 'koa'
import middlewares from './middleware'

const app = new Koa()

app
  .use(middlewares)
  .listen(1234, () => console.log('server is running as port 1234...'))

