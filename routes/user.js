const router = require('koa-router')()
const { login, logout, checkOldPwd, modifyPwd } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

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

router.post('/logout', async (ctx, next) => {
    
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