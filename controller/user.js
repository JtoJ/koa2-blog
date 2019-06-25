const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../util/cryp')

const login = async (username, password) => {
	// 例如传入的username是'zhangsan '-- ',这样的话'and pwd='这部分就会被注释掉，相当于没有密码就登陆了
	// 防止sql注入，escape就是对特殊字符进行转义

	username = escape(username)
	password = escape(password)
	// 用了escape之后，username= 这里就不用加单引号了
	const sql = `
		select username, pwd from users where username=${username} and pwd=${password}
	`
	const rows = await exec(sql)
	return rows[0] || {}
	// return exec(sql).then(rows => {
	// 	return rows[0] || {}
	// })
}

const checkOldPwd = async (id, oldPwd) => {
	// 检查旧密码是否正确
	const sql = `
		select pwd from users where userid=${id}
	`
	const rows = await exec(sql)
	return rows[0].pwd === oldPwd
}

const modifyPwd = async (id, newPwd) => {
	const sql = `
		update users set pwd=${newPwd} where userid=${id}
	`
	const msg = await exec(sql)
	return msg.affectedRows > 0
}



module.exports = {
	login,
	checkOldPwd,
	modifyPwd
}