var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'
      }
    });
        
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    var requestParams = {
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'
      }
    };
    
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    var requestParams = {
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'
      }
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });


  it('Should accept a \'GET\' request with a query', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    var requestParams = {
      method: 'GET',
      uri: 'http://127.0.0.1:3000/classes/messages?order=-createdAt'
    };
    
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      expect(response.statusCode).to.equal(203);
      done();
    });
  });
  
  // custom test 1
  // Reverse Order
  it('Should accept an \'GET\' request with a order parameter', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nicholas',
        text: 'I\'m working on it!'
      }
    });
    
    var requestParams = {
      method: 'GET',
      uri: 'http://127.0.0.1:3000/classes/messages?order=-createdAt'
    };
    
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      var messages = JSON.parse(body).results;
      expect(messages[0].username).to.equal('Nicholas');
      expect(messages[0].text).to.equal('I\'m working on it!');
      done();
    });
  });
  
  // custom test 2
  // limit
  it('Should accept an \'GET\' request with a limit parameter', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    var requestParams = {
      method: 'GET',
      uri: 'http://127.0.0.1:3000/classes/messages?limit=5'
    };
    
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      var messages = JSON.parse(body).results;
      expect(messages.length).to.equal(5);
      done();
    });
  });
  
  // custom test 3
  // skip
  it('Should accept an \'GET\' request with a skip parameter', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!'
      }
    });
    
    var requestParams = {
      method: 'GET',
      uri: 'http://127.0.0.1:3000/classes/messages?limit=100&skip=5'
    };
    
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      var messages = JSON.parse(body).results;
      expect(messages.length).to.equal(7);
      done();
    });
  });
  
  // custom test 4
  // include / ADV: needs change from client side (comments to post)
  // it('Should accept an \'OPTIONS\' request with a include parameter', function(done) {
  //   request({
  //     method: 'POST',
  //     uri: 'http://127.0.0.1:3000/classes/messages',
  //     json: {
  //       username: 'Nick',
  //       text: 'Do my bidding!'
  //     }
  //   });
    
  //   var requestParams = {
  //     method: 'OPTIONS',
  //     uri: 'http://127.0.0.1:3000/classes/messages',
  //     data: {
  //       order: '-createdAt'
  //     },
  //   };
    
  //   request(requestParams, function(error, response, body) {
  //     // Now if we request the log, that message we posted should be there:
  //     expect(response.statusCode).to.equal(203);
  //     done();
  //   });
  // });
  
  // custom test 5
  // keys
  it('Should accept an \'GET\' request with a keys parameter', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Nick',
        text: 'Do my bidding!',
        roomname: '4chan'
      }
    }); 
    
    var requestParams = {
      method: 'GET',
      uri: 'http://127.0.0.1:3000/classes/messages?key=roomname',
    };
    
    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      var messages = JSON.parse(body).results;
      expect(messages.length).to.equal(1);
      expect(messages[0].roomname).to.equal('4chan');
      done();
    });
  });

});


// var requestParams = {
//   method: 'POST',
//   uri: 'http://127.0.0.1:3000/classes/messages',
//   json: {
//     username: 'Nick',
//     text: 'Do my bidding!'
//   }
// };