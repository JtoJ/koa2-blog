const router = require('koa-router')()
const { 
	getList,
	getDetail,
	newBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

// 在获取数据之前先登录验证
router.get('/list', loginCheck, async (ctx, next) => {
    const author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData) 
})

router.get('/detail', loginCheck, async (ctx, next) => {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async (ctx, next) => {
    const body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
})

module.exports = router