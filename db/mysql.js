const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// const con = mysql.createConnection(MYSQL_CONF)

// con.connect()

//统一执行 sql 的函数
function exec(sql) {
	sql = mysql.escape(sql)
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
	return promise
}

module.exports = {
	exec
}