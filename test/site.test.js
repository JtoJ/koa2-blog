const app = require('../app');
const request = require('supertest')(app);
const should = require('should');

describe('test/site.test.js', function () {
    let username = 'ygk'
    let password = '123'

    describe('user login', function () {
        it('should not login when username is empty', function () {
            request.post('/login')
            .send({
                username: '',
                password: password
            })
            .expect(200, function (err, res) {
                should.not.exist(err)
                res.text.should.containEql('用户名不能为空')
                done()
            })
        })
        it('should not login when password is empty', function () {
            request.post('/login')
            .send({
                username: username,
                password: ''
            })
            .expect(200, function (err, res) {
                should.not.exist(err)
                res.text.should.containEql('密码不能为空')
                done()
            })
        })
        it('should not login when user is not exit', function () {
            request.post('/login')
            .send({
                username: username,
                password: password
            })
            .expect(200, function (err, res) {
                should.not.exist(err)
                res.text.should.containEql('用户不存在')
                done()
            })
        })
    })
})