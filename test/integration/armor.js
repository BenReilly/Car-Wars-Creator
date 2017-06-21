'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken

describe('Armor GET', () => {
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
    it('has a route for getting a single armor type', (done) => {
        chai.request(server)
            .get('/armor/laser-reflective')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got an armor');
                expect(res.body).to.have.property('data');
                expect(res.body.data.weight).to.equal(110);
                done();
            });
    });
    it('has a route for getting armors by weight', (done) => {
        chai.request(server)
            .get('/armor/?weight=110')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the armor');
                expect(res.body.data.length).to.equal(2);
                done();
            });
    });
    it('returns an error when given invalid values', (done) => {
        chai.request(server)
            .get('/armor/?weight=666')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more armor properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('returns an error when given invalid armor properties', (done) => {
        chai.request(server)
            .get('/armor/?spider=monkey')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more armor properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('has a route for getting all armor', (done) => {
        chai.request(server)
            .get('/armor/')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the armor');
                expect(res.body.data.length).to.equal(5);
                done();
            });
    });
});