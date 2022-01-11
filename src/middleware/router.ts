import * as Router from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'

const router = new Router()

router
  .get('/',
    async (ctx, next) => {
      const template = await fs.promises.readFile(path.resolve(process.cwd(), 'src/pages/home.html'))
      ctx.type = 'html'
      ctx.body = template.toString()
      next()
    }
  )
  .get('/list', ctx => {
    ctx.body = 'List Page'
  })

export default [router.routes(), router.allowedMethods()]
