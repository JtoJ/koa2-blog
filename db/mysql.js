const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

const con = mysql.createConnection(MYSQL_CONF)

con.connection()

//统一执行 sql 的函数
function exec(sql) {
	const promise = new Promise((resolve, reject) => {
		con.query(sql, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
				return
			}
			resolve(result)
		})
	})
}

module.exports = {
	exec,
	escape: mysql.escape
}