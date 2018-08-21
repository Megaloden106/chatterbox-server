/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

const data = {
  results: []
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  var url = require('url');
  var query = url.parse(request.url, true).query;
  
  var { method, url } = request;
  
  console.log('Serving request type ' + method + ' for url ' + url);
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/json';
    
  if (method === 'POST' && url.includes('/classes/messages')) {
    let requestBody;
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      requestBody = JSON.parse(chunk);
    }).on('end', () => {
      requestBody.createdAt = new Date();
      requestBody.objectId = data.results.length;
      data.results.push(requestBody);
      response.writeHead(201, headers);
      let resData = {
        createdAt: requestBody.createAt,
        objectId: requestBody.objectId
      };
      response.end(JSON.stringify(resData));
    });
  } else if (method === 'GET' && url.includes('/classes/messages')) {
    request.on('error', (err) => {
      console.error(err);
    });
    if (Object.keys(query).length > 0) {
      // add on data for filter
      response.writeHead(203, headers);
      let queryResults = {
        results: data.results.slice()
      };
      if (query.order) {
        queryResults.results.sort((a, b) => {
          let sort = '-objectId';
          if (sort.includes('createdAt')) {
            return sort[0] === '-' 
              ? Date.parse(b[sort.slice(1)]) - Date.parse(a[sort.slice(1)]) 
              : Date.parse(a[sort]) - Date.parse(b[sort]);
          } else {
            return sort[0] === '-' ? b[sort.slice(1)] - a[sort.slice(1)] : a[sort] - b[sort];
          }
        });
        // queryResults.results.sort((a, b) => {
        //   let sort = query.order;
        //   console.log(a, b);
        //   console.log('a', Date.parse(a[sort.slice(1)]));
        //   console.log('b', Date.parse(b[sort.slice(1)]));
        //   if (sort.includes('createdAt')) {
        //     return sort[0] === '-' 
        //       ? Date.parse(b[sort.slice(1)]) - Date.parse(a[sort.slice(1)]) 
        //       : Date.parse(a[sort]) - Date.parse(b[sort]);
        //   } else {
        //     return sort[0] === '-' ? b[sort.slice(1)] - a[sort.slice(1)] : a[sort] - b[sort];
        //   }
        // });
      }
      if (query.key) {
        queryResults.results = queryResults.results.filter((object) => {
          return object[query.key];
        });
      }
      if (query.skip) {
        queryResults.results.splice(0, query.skip);
      }
      if (query.limit) {
        queryResults.results = queryResults.results.slice(0, query.limit);
      }
      response.end(JSON.stringify(queryResults));
    } else {
      response.writeHead(200, headers);
      response.end(JSON.stringify(data));
    }
  } else {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(404, headers);
    response.end('Error 404');
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;


// The outgoing status.

// See the note below about CORS headers.

// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.

// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.


// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.
