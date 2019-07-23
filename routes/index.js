const router = require('koa-router')()
const xss = require('xss')

// 统一处理xss
function handleXSS(data) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      data[key] = xss(data[key])
    }
  }
}

// /*匹配所有路由
router.get('/*', async (ctx, next) => {
    // console.log('root get')
    handleXSS(ctx.request.query)
    next()
})

router.post('/*', async (ctx, next) => {
  handleXSS(ctx.request.body)
  next()
})


module.exports = router
