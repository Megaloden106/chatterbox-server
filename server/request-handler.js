var url = require('url');

const data = {
  results: []
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
    body = JSON.parse(body);
    body.createdAt = new Date();
    body.objectId = data.results.length;
    data.results.push(body);
    let responseData = {
      createdAt: body.createAt,
      objectId: body.objectId
    };
    sendResponse(response, responseData, 201);
  });  
};

const params = {
  order: (data, query) => {
    data.results.sort((a, b) => {
      let sort = query.order;
      if (sort.includes('createdAt')) {
        return sort[0] === '-' 
          ? b[sort.slice(1)].getTime() - a[sort.slice(1)].getTime() 
          : a[sort].getTime() - b[sort].getTime();
      } else {
        return sort[0] === '-' 
          ? b[sort.slice(1)] - a[sort.slice(1)] 
          : a[sort] - b[sort];
      }
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
    var query = url.parse(request.url, true).query;
    if (Object.keys(query).length > 0) {
      let queryData = {
        results: data.results.slice()
      };
      for (let key in query) {
        if (params[key]) {
          params[key](queryData, query);
        }
      }
      sendResponse(response, queryData, 203);
    } else {
      sendResponse(response, data);
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
