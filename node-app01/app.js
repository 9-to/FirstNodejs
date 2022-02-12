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

var data2 = {
    'Taro':['taro@yamada','09-999-999','Tokyo'],
    'Hanako':['hanako@flower','080-888-888','Yokohama'],
    'Sachiko':['sachiko@happy','070-777-777','Nagoya'],
    'Ichiro':['ichiro@baseball','060-666-666','USA'],
};
var data = {msg2: 'no message...'};

function responseIndex(rq,rs,param){
    if(rq.method == 'POST'){
        var body = '';
        rq.on('data',(data)=>{
            body += data;
        });
        rq.on('end',()=>{
            data = qs.parse(body);
            setCookie('msg2',data.msg2,rs);
            writeIndex(rq,rs,param);
        });
    } else {
        writeIndex(rq,rs,param);
    }
}

function writeIndex(rq,rs,param){
    var msg = "伝言を表示する";
    var cookie_data = getCookie('msg2',rq);
    if(param.has('msg')){
        msg += 'あなたは' + param.get('msg') + 'と送りました';
    }
    var content = ejs.render(index_page,{
        title: "Index!!",
        content: msg,
        data: data,
        cookie_data: cookie_data,
    });
    rs.writeHead(200,{'Content-Type': 'text/html'});
    rs.write(content);
    rs.end();
}

function setCookie(key,value, rs){
    var cookie = encodeURI(value);
    rs.setHeader('Set-Cookie',[key+ '=' + cookie]);
}

function getCookie(key,rq){
    var cookie_data = rq.headers.cookie != null ? rq.headers.cookie : '';
    var data = cookie_data.split(';');
    for(var i in data){
        if(data[i].trim().startsWith(key + '=')){
            var result = data[i].trim().substring(key.length + 1);
            return encodeURI(result);
        }
    }
    return '';
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
                data: data2,
                filename: 'data_item',
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