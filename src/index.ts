import * as Koa from 'koa';
import * as http from 'http'
import * as crypto from 'crypto'

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
  ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex')
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  const etag = ctx.response.get('ETag');
  console.log('etag', etag)
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
  // 新鲜度检查需要状态20x或304
  ctx.status = 200;
  ctx.set({
    'Cache-Control': 'no-store,no-cache'
  })
  ctx.response.lastModified = new Date()
  // 缓存是好的
  if (ctx.fresh) {
    ctx.status = 304;
    return;
  }
  console.log('fresh', ctx.fresh)
  // 缓存是陈旧的
  // 获取新数据
  console.log('is', ctx.is(ctx.type))
  ctx.body = 'Hello World';
});

// app.listen(1234);

app.on('error', err => {
  console.error('server error', err)
});

http.createServer(app.callback()).listen(1234, () => console.log('server is running as port 1234...'))
