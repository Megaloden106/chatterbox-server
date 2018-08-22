var urlParser = require('url');
var fs = require('fs');

var readMessage = (cb, body) => {
  fs.readFile('database.txt', (err, data) => {
    if (err) {
      return console.error(err);
    }
    cb(data, body);
  });
};

var writeMessage = (message) => {
  readMessage((data) => {
    data = JSON.parse(data);
    data.results.push(message);
    console.log(data);
    fs.writeFile('database.txt', JSON.stringify(data), (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('The file has been saved!');
    });
  });
};

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var sendResponse = (response, data, statusCode = 200) => {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var parseData = (request, response) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    readMessage((data, body) => {
      body = JSON.parse(body);
      body.createdAt = new Date();
      body.objectId = JSON.parse(data).results.length;
      writeMessage(body);
      let responseData = {
        createdAt: body.createAt,
        objectId: body.objectId
      };
      sendResponse(response, responseData, 201);
    }, body);
  });  
};

const params = {
  order: (data, query) => {
    data.results.sort((a, b) => {
      let sort = query.order;
      return sort[0] === '-' 
        ? Date.parse(b[sort.slice(1)]) - Date.parse(a[sort.slice(1)])
        : Date.parse(a[sort]) - Date.parse(b[sort]);
    });  
  },
  key: (data, query) => {
    data.results = data.results.filter((object) => {
      return object[query.key];
    });    
  },
  skip: (data, query) => {
    data.results.splice(0, query.skip);
  },
  limit: (data, query) => {
    data.results = data.results.slice(0, query.limit);
  },
};

const responses = {
  POST: (request, response) => {
    parseData(request, response);
  },
  GET: (request, response) => {
    var query = urlParser.parse(request.url, true).query;
    if (Object.keys(query).length > 0) {
      readMessage((data, body) => {
        let queryData = {
          results: JSON.parse(data).results.slice()
        };
        for (let key in body) {
          if (params[key]) {
            params[key](queryData, body);
          }
        }
        sendResponse(response, queryData, 203);
      }, query);
    } else {
      readMessage((data) => {
        sendResponse(response, JSON.parse(data));
      });
    }    
  },
  OPTIONS: (request, response) => {
    sendResponse(response, null, 205);   
  }
};

exports.requestHandler = function(request, response) {
  var { method, url } = request;
  
  if (!url.includes('/classes/messages') || !responses[method]) {
    sendResponse(response, 'Error 404', 404);
  } else {
    responses[method](request, response);
  }
};
