'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken;

describe('weapons GET', () => {
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
    it('has a route for getting a single weapon description', (done) => {
        chai.request(server)
            .get('/weapon/autocannon')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'loaded up');
                expect(res.body.data.loadedWeight).to.equal(600);
                done();
            });
    });
    it('has a route for getting a complete weapon list', (done) => {
        chai.request(server)
            .get('/weapons/')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'check out these guns');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('has a route for getting weapons by category', (done) => {
        chai.request(server)
            .get('/weapons/dropped%20liquids')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'fully armed');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should get weapons by property descriptions', (done) => {
        chai.request(server)
            .get('/weapons/?space=2')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'check out these guns');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should return an error when given invalid property values', (done) => {
        chai.request(server)
            .get('/weapons/?effect=apocalypse')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more weapon properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('should return an error when given invalid properties', (done) => {
        chai.request(server)
            .get('/weapons/?spaced=mammoth')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more weapon properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
});