const router = require('koa-router')()
const uploadTool = require('../util/uploadTool')
const { SuccessModel } = require('../model/resModel')

router.post('/upload', async ctx => {
    await uploadTool(ctx)
    ctx.body = new SuccessModel('上传成功！')
})

module.exports = router