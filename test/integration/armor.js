'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken;

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
    it('has a route for getting a single armor description', (done) => {
        chai.request(server)
            .get('/armor/van')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got the armor');
                expect(res.body.data.weight).to.equal(14);
                done();
            });
    });
    it('has a route for getting a complete armor list', (done) => {
        chai.request(server)
            .get('/armor/')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got all the armor');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should get armor by property descriptions', (done) => {
        chai.request(server)
            .get('/armor/?price=13')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got all the armor');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should return an error when given invalid property values', (done) => {
        chai.request(server)
            .get('/armor/?weight=666')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more armor properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('should return an error when given invalid properties', (done) => {
        chai.request(server)
            .get('/armor/?spaced=mammoth')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more armor properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
});