'use strict';

const chai = require('chai'),
    chaiHttp = require('chai-http'),
    should = chai.should(),
    expect = chai.expect,
    server = require('../../index'),
    vuser = 'testUser1',
    vpass = 'aValidPass',
    iuser = 'speca',
    ipass = 'monky';

let vToken, vId,
    anotherUser;

chai.use(chaiHttp);

describe('user POST', () => {
    describe('when there is valid, complete information', () => {
        it('creates a new user', (done) => {
            chai.request(server)
                .post('/user')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    username: 'testUser1',
                    password: 'aValidPass'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('info', 'it\'s alive!');
                    done();
                });
        });
    });
    describe('when info is bad or incomplete', () => {
        it('returns an error when trying to create a user with bad or missing username', (done) => {
            chai.request(server)
                .post('/user')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    username: 'testUser',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.have.property('info', 'you must create a password');
                    done();
                });
        });
        it('returns an error when trying to create a user with a bad or missing pass', (done) => {
            chai.request(server)
                .post('/user')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set({
                    password: 'testUser',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.have.property('info', 'you must have a username');
                    done();
                });
        });
        it('returns an error when creating a user with a duplicate name', (done) => {
            chai.request(server)
                .post('/user')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    username: 'testUser1',
                    password: 'aValidPass'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    expect(res.body).to.have.property('info', 'user creation failed');
                    expect(res.body.error.errmsg).to.match(/duplicate/);
                    done();
                });
        });
    });
});

describe('Authentication', () => {
    describe('when it has invalid credentials', () => {
        it('returns an error when provided invalid username', (done) => {
            chai.request(server)
                .post('/user/isvalid')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    username: iuser,
                    password: vpass
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid username/password combo');
                    done();
                });
        });
        it('returns an error when provided invalid password', (done) => {
            chai.request(server)
                .post('/user/isvalid')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set({
                    username: vuser,
                    password: ipass
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid username/password combo');
                    done();
                });
        });
    });
    describe('when it has incomplete credentials', () => {
        it('returns an error when provided no username', (done) => {
            chai.request(server)
                .post('/user/isvalid')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    password: vpass
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid username/password combo');
                    done();
                });
        });
        it('returns an error when provided no password', (done) => {
            chai.request(server)
                .post('/user/isvalid')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set({
                    username: vuser
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid username/password combo');
                    done();
                });
        });
    });
    it('returns a token when provided valid credentials', (done) => {
        chai.request(server)
            .post('/user/isvalid')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                username: vuser,
                password: vpass
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.property('info', 'login successful');
                expect(res.body).to.have.property('userid');
                expect(res.headers).to.have.property('token');
                vToken = res.headers.token;
                vId = res.body.userid;
                done();
            });
    });
});

describe('user GET', () => {
    describe('when authorized', () => {
        it('has a route for getting multiple users', (done) => {
            chai.request(server)
                .get('/user')
                .set({
                    token: vToken
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body.data).to.be.an('array');
                    expect(res.body).to.have.property('info', 'i got you some users');
                    anotherUser = res.body.data[0].userid;
                    done();
                });
        });
        it('has a route for getting a single user by id', (done) => {
            chai.request(server)
                .get('/user/' + vId)
                .set({
                    token: vToken
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('info', 'here\'s your guy');
                    expect(res.body.data).to.have.property('id', vId);
                    expect(res.body.data).to.have.property('username', vuser);
                    expect(res.body.data.cars).to.be.an('array');
                    done();
                });
        });
        it('returns an error when given an invalid ID', (done) => {
            chai.request(server)
                .get('/user/invalidId')
                .set({
                    token: vToken
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('info', 'i don\'t know that guy');
                    expect(res.body).not.to.have.property('data');
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });
    describe('when not authorized', () => {
        it('returns an error when getting multiple users', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.be.an('array');
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
        it('returns an error when getting a single user', (done) => {
            chai.request(server)
                .get('/user/' + vId)
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body.data).not.to.have.property('id');
                    expect(res.body.data).not.to.have.property('username');
                    expect(res.body.data).not.to.have.property('cars');
                    done();
                });
        });
    })
});

describe('user PUT', () => {
    describe('when authorized', () => {
        it('has a route editing a user', (done) => {
            chai.request(server)
                .put('/user/' + vId)
                .set({
                    token: vToken
                })
                .send({
                    username: 'testUserEdited'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('info', 'we rebuilt him');
                    done();
                });
        });
        it('returns an error when trying to edit a different user', (done) => {
            chai.request(server)
                .put('/user/' + anotherUser)
                .set({
                    token: vToken
                })
                .send({
                    username: 'differentUser'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'you can only edit yourself');
                    done();
                });
        });
    });
    describe('when not authorized', () => {
        it('returns an error when trying to edit a user', (done) => {
            chai.request(server)
                .put('/user/' + vId)
                .send({
                    username: 'testUserEdited'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid token');
                    expect(res.body).to.have.property('data');
                    done();
                });
        });
    });
});

describe('user DELETE', () => {
    describe('when not authorized', () => {
        it('returns an error when trying to delete a user', (done) => {
            chai.request(server)
                .delete('/user/' + vId)
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'invalid token');
                    done();
                });
        });
    });
    describe('when authorized', () => {
        it('returns an error when deleting a different user', (done) => {
            chai.request(server)
                .delete('/user/' + anotherUser)
                .set({
                    token: vToken
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    expect(res.body).to.have.property('info', 'you cannot delete other users');
                    done();
                });
        });
        it('has a route deleting a user', (done) => {
            chai.request(server)
                .delete('/user/' + vId)
                .set({
                    token: vToken
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('info', 'terminated user ' + vId);
                    done();
                });
        });
    });
});