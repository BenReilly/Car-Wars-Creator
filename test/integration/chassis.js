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
    it('has a route for getting a chassis type', (done) => {
        chai.request(server)
            .get('/chassis/light')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got a chassis');
                expect(res.body).to.have.property('data');
                expect(res.body.data.weight).to.equal(-10);
                done();
            });
    });
    it('has a route for getting chassis by price', (done) => {
        chai.request(server)
            .get('/chassis/?price=100')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the chassis');
                expect(res.body.data.length).to.equal(1);
                done();
            });
    });
    it('returns an error when given invalid values', (done) => {
        chai.request(server)
            .get('/chassis/?strength=medium')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more chassis properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('returns an error when given invalid chassis properties', (done) => {
        chai.request(server)
            .get('/chassis/?vehicle=car')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more chassis properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('has a route for getting all chassis', (done) => {
        chai.request(server)
            .get('/chassis/')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the chassis');
                expect(res.body.data.length).to.equal(4);
                done();
            });
    });
    describe('when not authorized', () => {
        it('fails if there is a bad token for single route', (done) => {
            chai.request(server)
                .get('/chassis/standard')
                .set({
                    token: 'vToken'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('fails if there is a bad token for multi route', (done) => {
            chai.request(server)
                .get('/chassis/')
                .set({
                    token: 'vToken'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('fails if there is no token for single route', (done) => {
            chai.request(server)
                .get('/chassis/extra heavy')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('fails if there is no token for multi route', (done) => {
            chai.request(server)
                .get('/chassis/')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
    });
});