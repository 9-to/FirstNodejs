const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const URL = require('url').URL;
const qs = require('querystring');

const index_page = fs.readFileSync('./mini_board/index.ejs', 'utf8');
const login_page = fs.readFileSync('./mini_board/login.ejs', 'utf8');
const style_css = fs.readFileSync('./mini_board/style.css', 'utf8');

const maxNum = 10;
const filename = "./mini_board/mydata.txt";
var message_data;
readFromFile(filename);

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
            responseIndex(rq,rs)
            break;
        case '/login':
            responseLogin(rq,rs);
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

function responseLogin(rq,rs){
    var content = ejs.render(login_page,{});
    rs.writeHead(200,{'Content-Type': 'text/html'});
    rs.write(content);
    rs.end();
}

function responseIndex(rq,rs){
    if(rq.method == 'POST'){
        var body = '';
        rq.on('data',(data)=>{
            body += data;
        });
        rq.on('end',()=>{
            data = qs.parse(body);
            addToData(data.id,data.msg,filename,rq);
            writeIndex(rq,rs);
        });
    } else {
        writeIndex(rq,rs);
    }
}

function writeIndex(rq,rs){
    var msg = "Plz write message";
    var content = ejs.render(index_page,{
        title: "Index",
        content: msg,
        data: message_data,
        filename: 'data_item',
    });
    rs.writeHead(200,{'Content-Type': 'text/html'});
    rs.write(content);
    rs.end();
}

function readFromFile(fname){
    fs.readFile(fname,'utf8',(err,data)=>{
        message_data = data.split('\n');
    });
}

function addToData(id,msg,fname,rq){
    var obj = {'id': id, 'msg': msg};
    var obj_str = JSON.stringify(obj);
    console.log('add data: '+ obj_str);
    message_data.unshift(obj_str);//配列を最前列で追加する
    if(message_data.length>maxNum){
        message_data.pop();//最後のデータを取り出す
    }
    saveToFile(fname);
}

function saveToFile(fname){
    var data_str = message_data.join('\n');
    fs.writeFile(fname, data_str,(err)=>{
        if(err){throw err;}
    });
}