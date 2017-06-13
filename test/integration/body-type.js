'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken

describe('Body Type GET', () => {
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
    it('has a route for getting a single body type', (done) => {
        chai.request(server)
            .get('/body-types/pickup')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got a body');
                expect(res.body).to.have.property('data');
                expect(res.body.data.weight).to.equal(2100);
                done();
            });
    });
    it('has a route for getting body types by vehicle', (done) => {
        chai.request(server)
            .get('/body-types/?vehicle=bike')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the bodies');
                expect(res.body.data.length).to.equal(5);
                done();
            });
    });
    it('returns an error when given invalid values', (done) => {
        chai.request(server)
            .get('/body-types/?vehicle=skateboard')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more body type properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('returns an error when given invalid body type properties', (done) => {
        chai.request(server)
            .get('/body-types/?spider=monkey')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more body type properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('has a route for getting all body types', (done) => {
        chai.request(server)
            .get('/body-types/')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the bodies');
                expect(res.body.data.length).to.equal(18);
                done();
            });
    });
    describe('when not authorized', () => {
        it('fails if there is a bad token for single route', (done) => {
            chai.request(server)
                .get('/body-types/pickup')
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
                .get('/body-types/')
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
                .get('/body-types/pickup')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('fails if there is no token for multi route', (done) => {
            chai.request(server)
                .get('/body-types/')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
    });
})