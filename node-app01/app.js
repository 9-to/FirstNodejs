const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const URL = require('url').URL;
const qs = require('querystring');

const index_page = fs.readFileSync('./node-app01/index.ejs', 'utf8');
const other_page = fs.readFileSync('./node-app01/other.ejs', 'utf8');
const style_css = fs.readFileSync('./node-app01/style.css', 'utf8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server running at http://localhost:3000/');

//=======

function getFromClient(rq,rs){
    var base_url = 'http://' + rq.headers.host + '/';
    var url_parts = new URL(rq.url,base_url);
    console.log(url_parts);
    switch(url_parts.pathname){
        case '/':
            var param = url_parts.searchParams;
            responseIndex(rq,rs,param)
            break;
        case '/other':
            responseOther(rq,rs);
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

function responseIndex(rq,rs,param){
    var msg = "これはIndexページ。";
    if(param.has('msg')){
        msg += 'あなたは' + param.get('msg') + 'と送りました';
    }
    var content = ejs.render(index_page,{
        title: "Index!!",
        content: msg,
    });
    rs.writeHead(200,{'Content-Type': 'text/html'});
    rs.write(content);
    rs.end();
}

function responseOther(rq,rs){
    var msg = "これはOtherページ。";
    if(rq.method == 'POST'){
        var body = '';
        rq.on('data',(data)=>{
            body += data;
        });
        rq.on('end',()=>{
            var post_data = qs.parse(body);
            msg += 'あなたは、' + post_data.msg + 'とpostしました。';
            var content = ejs.render(other_page,{
                title: "Other",
                content: msg,
            });
            rs.writeHead(200,{'Content-Type': 'text/html'});
            rs.write(content);
            rs.end();
        });
    }else{
        var msg = "ページがありません。";
        var content = ejs.render(other_page,{
            title: "Other",
            content: msg,
        });
        rs.writeHead(200,{'Content-Type': 'text/html'});
        rs.write(content);
        rs.end();
    }
}