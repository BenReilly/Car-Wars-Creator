'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken

describe('Chassis GET', () => {
    beforeEach((done) => {
        chai.request(server)
            .post('/user/isValid')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                username: 'platypus',
                password: 'password'
            })
            .end((err, res) => {
                vToken = res.headers.token;
                done();
            });
    });
});