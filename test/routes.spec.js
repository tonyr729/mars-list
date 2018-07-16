const environment = process.env.NODE_ENV || 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  
  it('should receive a response of HTML when we hit the root endpoint', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      })
  });
});

describe('API Routes', () => {
  beforeEach(done => {
    database.migrate.rollback()
      .then(() => {
        return database.migrate.latest()
      })
      .then(() => {
        return database.seed.run();
      })
      .then(() => {
        done();
      });
  });

  describe('GET /api/v1/items', () => {
    it('should return all of the items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          (response.body[0]).should.have.property('name');
          (response.body[0].name).should.equal('Oxygenator');
          (response.body[0]).should.have.property('isPacked');
          (response.body[0].isPacked).should.equal(false);
          done();
        });
    });
  });
});