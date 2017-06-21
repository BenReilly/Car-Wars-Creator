'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken;

describe('Tire Mod GET', () => {
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
    it('has a route for getting a single tire mod', (done) => {
        chai.request(server)
            .get('/tire-mods/off-road')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'you are modified');
                expect(res.body).to.have.property('data');
                expect(res.body.data.price).to.equal(20);
                done();
            });
    });
    it('has a route for getting tire mods by a property', (done) => {
        chai.request(server)
            .get('/tire-mods/?weight=0')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got mods');
                expect(res.body.data.length).to.equal(1);
                done();
            });
    });
    it('returns an error when given invalid values', (done) => {
        chai.request(server)
            .get('/tire-mods/?mod=awesomesaucing')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more tire-mod properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('returns an error when given invalid tire mod properties', (done) => {
        chai.request(server)
            .get('/tire-mods/?spider=monkey')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more tire-mod properities or values are invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('has a route for getting all tire mods', (done) => {
        chai.request(server)
            .get('/tire-mods/')
            .set({
                token: vToken
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'got mods');
                expect(res.body.data.length).to.equal(4);
                done();
            });
    });
});