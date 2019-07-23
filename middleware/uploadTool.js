const fs = require('fs')
const path = require('path')

const uploadTool = async ctx => {
    const file = ctx.request.files.file
    const reader = fs.createReadStream(file.path)
    let correctPath = path.join(__dirname, '../')
    let filePath = `${correctPath}/static/upload/${file.name}`
    const writer = fs.createWriteStream(filePath)
    try {
        reader.pipe(writer)
    } catch (err) {
        ctx.throw(40001,'上传失败！')
    }
    
    // reader.on('end', () => {
    //     console.log('上传完成')
    // })
}

module.exports = uploadTool