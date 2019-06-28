const router = require('koa-router')()

router.post('/testLogin', async (ctx, next) => {
    const { username, password } = ctx.request.body
    ctx.session.username = username
    ctx.session.logined = true
    ctx.body = 'is logined'
})

router.get('/testLogout', async (ctx, next) => {
    ctx.session.logined = false
    ctx.body = 'is logout'
  })
  
  
  module.exports = router