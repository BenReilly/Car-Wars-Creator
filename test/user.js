'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../index');

chai use(chaiHttp);

describe('GET', () => {
    it('has a route for getting multiple users', (done) => {
        chai.request(server)
            .get('/user')
            .end((err, res0 => {
                res.should.have.status(200);
                done();
            }));
    });
});