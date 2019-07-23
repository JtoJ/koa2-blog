const loginCheck = async (ctx, next) => {
    if (ctx.session.logined) {
        await next()
        return
    }
    ctx.throw(40001,'用户未登录！')
}

module.exports = loginCheck