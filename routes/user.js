const router = require('koa-router')()
const { registerAccount, login, logout, checkOldPwd, modifyPwd } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/register', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const data = await registerAccount(username, password)
    ctx.body = new SuccessModel(data)
})

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    const user = await login(username, password)
    if (user.id) {
        // 设置完之后，会自动同步到redis里，redis会为不同的session单独开辟空间，而不会覆盖
        ctx.session.logined = true
        ctx.session.userid = user.id
        ctx.session.username = username
        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('账户或密码错误')        

}) 

router.post('/logout', async (ctx, next) => {
    if (ctx.session.userid) {
        // redis会自动设置当前session，对其他session无影响
        ctx.session.logined = false
    }
    ctx.body = new SuccessModel()
})

router.post('/modifyPassword', async (ctx, next) => {
    const { oldPassword, newPassword } = ctx.request.body
    const userId = ctx.session.userid
    const checkOld = await checkOldPwd(userId, oldPassword)
    if (checkOld) {
        const modifyCheck = await modifyPwd(userId, newPassword)
        if (modifyCheck) {
            ctx.body = new SuccessModel('密码修改成功！')
        } else {
            ctx.body = new ErrorModel('密码修改失败！')
        }
    } else {
        ctx.body = new ErrorModel('旧密码错误！')
    }

})

module.exports = router