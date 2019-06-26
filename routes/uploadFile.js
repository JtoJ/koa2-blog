const router = require('koa-router')()
const uploadTool = require('../util/uploadTool')
const { SuccessModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.post('/upload', loginCheck, async ctx => {
    await uploadTool(ctx)
    ctx.body = new SuccessModel('上传成功！')
})

module.exports = router