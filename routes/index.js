const router = require('koa-router')()

// ctx上下文，相当于req和res的集合体
router.get('/', async (ctx, next) => {
  //ctx.render渲染指定的模板页面，此处渲染了views里的index模板
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
