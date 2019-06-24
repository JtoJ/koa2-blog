/*
  加密，一般情况下，注册的时候传到后台的密码已经经过前端加密了（防止请求被拦截窃取密码，比如网站被劫持了）
  登陆的密码也会经过前端加密再传给后端
*/
const crypto = require('crypto')

//密匙
const SECRET_KEY = 'ygk_8866'

//md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.updata(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    // 拿到前端加密后的密码时，可以加上密钥，再加密一次，提升破解难度，同时提高安全性
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5.apply(str)
}

module.exports = {
    genPassword
}