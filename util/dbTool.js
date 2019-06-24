const mysql = require('mysql')

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	port: '3306',
	database: 'myblog'
})

// start connect
con.connect()

//以下语句都用con.query方法执行
const sql = 'select * from users';
const updateSql = `update users set realname='张三' where username='zhangsan'`
const insertSql = `insert into users(username,pwd) values('lisi','123') `

con.query(sql, (err, result) => {
	if (err) {
		console.error(err)
		return
	}
	console.log(result)
})

// close connection
con.end();