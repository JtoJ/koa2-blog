const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')
const CSRF = require('koa-csrf')
const ratelimit = require('koa-ratelimit')

const rootRoute = require('./routes/index')
const blog = require('./routes/blog')
const user = require('./routes/user')
const uploadFile = require('./routes/uploadFile')

const { REDIS_CONF } = require('./conf/db')

onerror(app)

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

// 用于上传文件
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 10 * 1024 * 1024,
    multipart: true
  }
}))

// 配置静态文件服务
app.use(koaStatic(__dirname + "/static"))

app.use(json())

// morgan记录日志，pm2也有记录日志的功能，不过没有morgan那么详细
const env = process.env.NODE_ENV
let fileName = ''
if (env !== 'production') {
  fileName = 'devLog.log'
} else {
  // 生产环境
  fileName = 'access.log'
}
const logFilePath = path.join(__dirname, 'logs', fileName)
const writeStream = fs.createWriteStream(logFilePath, {
  flags: 'a'
})
app.use(morgan('combined', {
  stream: writeStream
}))

const redisInstance = redisStore({
  all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
})

//session配置
//密匙
app.keys = ['Ygk#8866_']
// session过期时间默认与cookie的maxAge相同，也可以用ttl单独设置
app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis，session过期后，会从redis里自动删除
  store: redisInstance
}))

 // request rate limit
app.use(ratelimit({
  db: redisInstance,
  duration: 60000,
  errorMessage: '请求过于频繁，请稍后再试！',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100,
  disableHeader: false,
}));

app.use(new CSRF({
  invalidTokenMessage: 'Invalid CSRF token',
  invalidTokenStatusCode: 403,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));

// routes
app.use(rootRoute.routes(), rootRoute.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(uploadFile.routes(), uploadFile.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
