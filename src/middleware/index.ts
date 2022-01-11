import * as compose from 'koa-compose'
import error from './error'
import logger from './logger'
import router from './router'
import cache from './cache'
import publicStatic from './static'

const middlewares = compose([ publicStatic, ...router, cache, logger, error ])

export default middlewares