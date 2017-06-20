'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken

describe('Tire GET', () => {
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
    it('has a route for getting a single tire', (done) => {
        chai.request(server)
            .get('/tires/heavy-duty')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'you are tired');
                expect(res.body).to.have.property('data');
                expect(res.body.data.dp).to.equal(6);
                done();
            });
    });
    it('has a route for getting tires by a property', (done) => {
        chai.request(server)
            .get('/tires/?dp=9')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got tires');
                expect(res.body.data.length).to.equal(1);
                done();
            });
    });
    it('returns an error when given invalid values', (done) => {
        chai.request(server)
            .get('/tires/?vehicle=pogo')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more tire properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('returns an error when given invalid tire properties', (done) => {
        chai.request(server)
            .get('/tires/?spider=monkey')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more tire properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('has a route for getting all tires', (done) => {
        chai.request(server)
            .get('/tires/')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got tires');
                expect(res.body.data.length).to.equal(4);
                done();
            });
    });
    describe('when not authorized', () => {
        it('fails if there is a bad token for single route', (done) => {
            chai.request(server)
                .get('/tires/solid')
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
                .get('/tires/')
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
                .get('/tires/puncture-resistant')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('fails if there is no token for multi route', (done) => {
            chai.request(server)
                .get('/tires/')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
    });
});