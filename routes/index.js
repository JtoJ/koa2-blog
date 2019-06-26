const router = require('koa-router')()

// ctx上下文，相当于req和res的集合体
router.get('/', async (ctx, next) => {
  //ctx.render渲染指定的模板页面，此处渲染了views里的index模板
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/testLogin', async (ctx, next) => {
  const { username, password } = ctx.request.query
  console.log(username)
  ctx.session.username = username
  ctx.session.logined = true
  ctx.body = 'is logined'
})

router.get('/testLogout', async (ctx, next) => {
  ctx.session.logined = false
  ctx.body = 'is logout'
})


module.exports = router
