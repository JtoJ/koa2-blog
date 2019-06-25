const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = async (author, keyword) => {
	// where 1=1 是为了拼接后面的语句
	let sql = `select * from blogs where 1=1`
	if (author) {
		sql += `and author='${author}'`
	}
	if (keyword) {
		sql += `and title like '${keyword}'`
	}
	sql += `order by createdtime desc;`
	// await会获取promise里resolve的data，然后return
	return await exec(sql)
}

const getDetail = async id => {
	const sql = `select * from blogs where id='${id}'`
	const rows = await exec(sql)
	return rows[0]
}

const newBlog = async (blogData = {}) => {
	// 预防xss攻击（脚本注入），把<script>等可以形成代码块的内容进行转义
	const title = xss(blogData.title)
	const content = blogData.content
	const author = blogData.author
	const createdTime = Date.now()

	const sql = `
		insert into blogs(title, content, createdtime, author)
		values('${title}', '${content}', '${createdTime}', '${author}')
	`
	const insertData = await exec(sql)
	return {
		id: insertData.insertId
	}
	
}

const updateBlog = async (id, blogData = {}) => {
	const title = blogData.title
	const content = blogData.content

	const sql = `
		update blogs set title='${title}', content='${content}' where id=${id}
	`
	const updateMsg = await exec(sql)
	return updateMsg.affectedRows > 0
	
}

const deleteBlog = async (id, author) => {

	const sql = `
		delete from blogs where id=${id} and author='${author}'
	`
	const delMsg = await exec(sql)
	return delMsg.affectedRows > 0
}
 
module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	deleteBlog
}