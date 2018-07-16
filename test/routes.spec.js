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
        return database.migrate.latest();
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

  describe('POST /api/v1/items', () => {
    it('should create a new item', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Medical Supplies',
          isPacked: false
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');        
          (response.body).should.have.property('id');
          done();
        })
    })

    it('should return a response with status 422 if there is a missing parameter', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Snacks'
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        })
    })
  })

  describe('PATCH /api/v1/items/:id', () => {
    it('should update a the contents of a specific item', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/' + response.body[0].id)
            .send({
              item: {
                isPacked: true
              }
            })
            .end((error, response) => {
              response.should.have.status(202);
              response.should.be.json;
              response.body.should.have.property('id');
              response.body.id.should.equal(1)
              done();
            })
        })
    })

    it('should return a response with a status of 500 if incorrect id is provided', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .patch('/api/v1/items/nonsense12315')
            .send({
              item: {
                isPacked: true
              }
            })
            .end((error, response) => {
              response.should.have.status(500);
              done();
            })
        })
    })
  })

  describe('DELETE, api/v1/items/:id', () => {
    it('should delete a specific item based on parameters', done => {
      chai.request(server)
      .get('/api/v1/items')
      .end((error, response) => {
        chai.request(server)
        .delete('/api/v1/items/' + response.body[0].id)
        .end((error, response) => {
          response.should.have.status(204);
          done();
        });
      });
    });
      
    it('should return a response with a status of 500 if incorrect id is provided', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((error, response) => {
          chai.request(server)
            .delete('/api/v1/items/notaid@34523')
            .end((error, response) => {
              response.should.have.status(500);
              done();
            })
        })
    })
  })
});