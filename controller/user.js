const { exec } = require('../db/mysql')

const registerAccount = async (username, password) => {
	const sql = `
		insert into users(username,pwd) values('${username}','${password}')
	`
	const msg = await exec(sql)
	return {
		id: msg.insertId
	}
}

const login = async (username, password) => {
	const sql = `
		select username, pwd from users where username='${username}' and pwd='${password}'
	`
	const rows = await exec(sql)
	return rows[0] || {}
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
		update users set pwd='${newPwd}' where userid=${id}
	`
	const msg = await exec(sql)
	return msg.affectedRows > 0
}



module.exports = {
	registerAccount,
	login,
	checkOldPwd,
	modifyPwd
}