const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');

const index_page = fs.readFileSync('./node-app01/index.ejs', 'utf8');
const other_page = fs.readFileSync('./node-app01/other.ejs', 'utf8');
const style_css = fs.readFileSync('./node-app01/style.css', 'utf8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server running at http://localhost:3000/');

//=======

function getFromClient(rq,rs){
    var url_parts = url.parse(rq.url);
    switch(url_parts.pathname){
        case '/':
            var content = ejs.render(index_page,{
                title:"Index!!",
                content:"これはIndexページ",
            });
            rs.writeHead(200,{'Content-Type': 'text/html'});
            rs.write(content);
            rs.end();
            break;
        case '/other':
            var content = ejs.render(other_page,{
                title:"Other",
                content:"これはOtherページ",
            });
            rs.writeHead(200,{'Content-Type': 'text/html'});
            rs.write(content);
            rs.end();
            break;
        case '/style.css':
            rs.writeHead(200,{'Content-Type': 'text/css'});
            rs.write(style_css);
            rs.end();
            break;
        default:
            rs.writeHead(200,{'Content-Type': 'text/plain'});
            rs.end('no page.');
            break;
    }
}

function writeToResponse(err,data){
    var content = data.replace(/dummy_title/g, 'タイトル').replace(/dummy_content/g, 'コンテンツ');
    rs.writeHead(200,{'Content-Type': 'text/html'});
    rs.write(content);
    rs.end();
}