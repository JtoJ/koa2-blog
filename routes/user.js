const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    ctx.body = {

    }
})

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const user = await login(username, password)
    if (user.id) {
        // 设置完之后，会自动同步到redis里，因为在app.js里设置了
        ctx.session.username = user.username
        ctx.session.userid = user.id
        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('账户或密码错误')        

}) 

module.exports = router