const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const blog = require('./routes/blog')
const user = require('./routes/user')
const uploadFile = require('./routes/uploadFile')

const { REDIS_CONF } = require('./conf/db')

// error handler
onerror(app)

// middlewares
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
app.use(logger())


// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   //先去执行其他中间件
//   await next()
//   //计算响应耗时
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// morgan记录日志，pm2也有记录日志的功能，不过没有morgan那么详细
const env = process.env.NODE_ENV
if (env !== 'production') {
  app.use(morgan('dev'))
} else {
  // 生产环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }))
}

//session配置
//密匙
app.keys = ['Ygk#8866_']
// app.use(session({
//   // 配置cookie
//   cookie: {
//     path: '/',
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   // 配置redis
//   store: redisStore({
//     all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
//   })
// }))

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(uploadFile.routes(), uploadFile.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
