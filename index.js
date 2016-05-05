var http = require('http');
var qs = require('querystring');
var port = process.env.PORT || 4000;
var spawn = require('child_process').spawn;

var server = http.createServer(function (req, res) {
  if(req.method === "POST") {
      if (req.url === "/speak")
      {
          var requestBody = '';
          req.on('data', function(data) {
            requestBody += data;
            if(requestBody.length > 1e7) {
              res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
              res.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
            }
          });
          req.on('end', function() {
            console.log("requestBody", requestBody);

            var formData = qs.parse(requestBody);
            res.writeHead(200, {'Content-Type': 'text/html'});
            if( formData.text )
            {
                console.log("text", formData.text );
                var speakCmd = spawn('espeak', ['-vbg-bg+f4', '-p30', '-s130',formData.text]);
            }
            res.end();
          });
      } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end("unhandled request");
      }
  } else if(req.url == "/form") {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<!doctype html><html><head><meta charset="utf-8"><title>response</title></head><body>');
      res.write('<form action="/speak" method="post">');
      res.write('<textarea name="text"></textarea>');
      res.write('<button type="submit">Submit data</button>');
      res.write('</form>');
      res.end();
  } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end("invalid");
  }
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
