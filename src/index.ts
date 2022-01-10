import * as Koa from 'koa';
import * as http from 'http'

const app = new Koa()

console.log('env', app.env)
console.log('keys', app.keys)

// logger
app.use(async (ctx, next) => {
  console.log('cookies', ctx.cookies.get('a'))
  ctx.cookies.set('koa', 'koa is amazing')
  ctx.cookies.set('koa', 'koa is amazing2')
  // ctx.throw(400, '没权限')
  // ctx.throw(500, '服务器未知错误')
  // ctx.throw(401, 'access_denied', { user: ctx.url });
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('url - ', ctx.url)
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});

// app.listen(1234);

app.on('error', err => {
  console.error('server error', err)
});

http.createServer(app.callback()).listen(1234, () => console.log('server is running as port 1234...'))
