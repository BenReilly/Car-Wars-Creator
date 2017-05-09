'use strict';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('../routes/car');

chai.use(chaiHttp);

describe('GET', () => {
    it('has a route for getting multiple users', (done) => {
        chai.request(server)
            .get(':3001/user')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});