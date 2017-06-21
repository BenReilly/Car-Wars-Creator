'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

describe('When the user is not authenticated', () => {
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
            .get('/suspensions/car/heavy')
            .end((err, res) => {
                res.should.have.status(403);
                expect(res.body.data).not.to.be.an('array');
                expect(res.body).to.have.property('info', 'invalid token');
                done();
            });
    });
    it('fails if there is no token for multi route', (done) => {
        chai.request(server)
            .get('/weapons/')
            .end((err, res) => {
                res.should.have.status(403);
                expect(res.body.data).not.to.be.an('array');
                expect(res.body).to.have.property('info', 'invalid token');
                done();
            });
    });
});