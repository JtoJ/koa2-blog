const { escape } = require('../db/mysql')
const xss = require('xss')

const safeTransform = reqData => {
    for (const key in reqData) {
        if (reqData.hasOwnProperty(key)) {
            reqData[key] = xss(reqData[key]);
            reqData[key] = escape(reqData[key])
        }
    }
    return reqData
}

module.exports = {
    safeTransform
}