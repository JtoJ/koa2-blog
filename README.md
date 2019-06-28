# koa2-blog

### 1、技术栈：node.js + koa2 + redis + mysql + pm2

### 2、实现细节：

（1）采用koa2搭建后台，处理请求路由；koa2体积非常小，不捆绑中间件，需要什么中间件再自行引入，扩展性好。

（2）采用koa-generic-session处理cookie和session，并使用koa-redis将session存储到redis中，当session变化时，可以自动同步到redis中；当session失效时，redis里的记录也会自动删除。
````js
app.keys = ['Ygk#8866_']
// session过期时间默认与cookie的maxAge相同，也可以用ttl单独设置
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))
````

（3）采用mysql存储用户账户和博客内容信息。

（4）pm2管理系统进程，可配置多进程，最大化利用服务器的硬件资源，当系统挂掉时也能自动重启。
````json
{
    "apps": {
        "name": "node-koa2",
        "script": "./bin/www",
        "watch": true,
        "ignore_watch": [
            "node_modules",
            "logs",
            "pm2logs"
        ],
        "instances": 2,
        "out_file": "./pm2logs/pm2-out.log",
        "error_file": "./pm2logs/pm2-error.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss",
        "merge_logs": true
    }
}
````

（5）使用morgan记录日志写入文件，有多种格式可选；也可以拆分日志把请求成功和失败分开存放，如果要每天写入新文件，可以引入rotating-file-stream用于循环记录日志。
````js
const env = process.env.NODE_ENV
let fileName = ''
if (env !== 'production') {
  fileName = 'devLog.log'
} else {
  fileName = 'access.log'
}
const logFilePath = path.join(__dirname, 'logs', fileName)
const writeStream = fs.createWriteStream(logFilePath, {
  flags: 'a'
})
app.use(morgan('combined', {
  stream: writeStream
}))
````

（6）使用xss库防止xss攻击；使用mysql.escape防止SQL注入。

### 3、功能实现

登录登出、博客的CRUD、上传文件等功能。
