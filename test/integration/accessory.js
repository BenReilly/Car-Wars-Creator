'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index');

let vToken;

describe('accessory GET', () => {
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
    it('has a route for getting a single accessory description', (done) => {
        chai.request(server)
            .get('/accessory/body%20blades')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'accessorized');
                expect(res.body.data.loadedWeight).to.equal(600);
                done();
            });
    });
    it('has a route for getting a complete accessory list', (done) => {
        chai.request(server)
            .get('/accessories/')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'blinged');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('has a route for getting weapons by category', (done) => {
        chai.request(server)
            .get('/accessories/defense')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'heavily accessorized');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should get accessorized by property descriptions', (done) => {
        chai.request(server)
            .get('/accessories/?space=1')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'select accessorized');
                expect(res.body.data.length).to.be.greaterThan(0);
                done();
            });
    });
    it('should return an error when given invalid property values', (done) => {
        chai.request(server)
            .get('/accessories/?effect=apocalypse')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more accessory properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
    it('should return an error when given invalid properties', (done) => {
        chai.request(server)
            .get('/accessories/?spaced=mammoth')
            .set({ token: vToken })
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body).to.have.property('info', 'one or more accessory properties or values is invalid');
                expect(res.body).not.to.have.property('data');
                done();
            });
    });
});