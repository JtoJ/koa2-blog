const http = require('http')

// 组合中间件
function compose(middlewareList) {
    return function (ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                // 加上Promise.resolve防止传入的不是async函数时，也能正常调用next()
                // 此处的dispatch就作为next
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1))
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        // 先执行第一个中间件
        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }

    use(fn) {
        this.middlewareList.push(fn)
        // 可用于链式调用
        return this
    }

    createContext(req, res) {
        const ctx = {
            req,
            res
        }
        return ctx
    }

    callback() {
        const fn = compose(this.middlewareList)

        return (req, res) => {
            const ctx = this.createContext(req, res)
            return fn(ctx)
        }
    }

    listen(...arg) {
        const server = http.createServer(this.callback())
        server.listen(...arg)
    }
}

module.exports = LikeKoa2