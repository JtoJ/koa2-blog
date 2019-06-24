const fs = require('fs')
const path = require('path')

// __dirname表示当前目录，files是文件夹名称，a.json是文件名
const fullFileName = path.resolve(__dirname, 'files', 'a.json')
fs.readFile(fullFileName, (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	console.log(data.toString())
})

// 封装
function getFileContent(fileName) {
	return new Promise((resolve, reject) => {
		const fullFileName = path.resolve(__dirname, 'files', fileName)
		fs.readFile(fullFileName, (err, data) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			resolve(JSON.parse(data.toString()))
		})
	})
}

// 使用
getFileContent('a.text').then(aData => {
	console.log(aData)
	let nextFile = aData.next
	return getFileContent(nextFile)
}).then(bData => {
	console.log(bData)
	let nextFile = bData.next
	return getFileContent(nextFile)
}).then(cData => {
	console.log(cData)
})