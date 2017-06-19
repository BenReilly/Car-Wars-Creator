'use strict';

const expect = require('chai').expect,
    user = require('../../models/user'),
    config = require('../../config'),
    bcrypt = require('bcryptjs');

describe.only('User Model', () => {
    it('should be invalid if username is empty', (done) => {
        let u = new user({
            password: new Buffer.from('astring')
        });
        u.validate((err) => {
            expect(err.errors.username).to.exist;
            expect(err.errors.password).not.to.exist;
            done();
        });
    });
    it('should be invalid if password is empty', (done) => {
        let u = new user({
            username: 'someUser'
        });
        u.validate((err) => {
            expect(err.errors.username).not.to.exist;
            expect(err.errors.password).to.exist;
            done();
        });
    });
    it('should be valid if it has a username and a password', (done) => {
        let u = new user({
            username: 'someUser',
            password: 'astring'
        });
        u.validate((err) => {
            expect(err).not.to.exist;
            done();
        });
    });
    it('should authenticate passwords', (done) => {
        let salt = bcrypt.genSaltSync(10),
            u = new user({
                username: 'someUser',
                password: bcrypt.hashSync('astring', salt)
            });
        expect(u.comparePassword('astring')).to.be.true;
        expect(u.comparePassword('badstring')).to.be.false;
        done();
    });
    it('should check if a user is an admin', (done) => {
        let u1 = new user({
                username: 'aUser',
                password: 'somestring'
            }),
            u2 = new user({
                username: 'anotherUser',
                password: 'anotherString',
                admin: true
            });
        expect(u1.isAdmin()).to.be.false;
        expect(u2.isAdmin()).to.be.true;
        done();
    });
});