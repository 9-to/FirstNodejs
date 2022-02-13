var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');

var app = express();

app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

var data = {
    'Taro':['taro@yamada','09-999-999','Tokyo'],
    'Hanako':['hanako@flower','080-888-888','Yokohama'],
    'Sachiko':['sachiko@happy','070-777-777','Nagoya'],
    'Ichiro':['ichiro@baseball','060-666-666','USA'],
};


app.get('/', (rq,rs)=>{
    //var url = '/other?name=taro&pass=yamada'
    var msg = 'This is Index Page!<br>' + 'これはトップページ';
    rs.render('index.ejs',{
        title: 'Index',
        content: msg,
        data: data,
        //link:{href: url, text: '別のページに移動'},
    });
});

app.post('/',(rq,rs)=>{
    var msg = 'This is Posted Page!<br>あなたは<b>'+rq.body.message+'</b>と送信しました';
    rs.render('index.ejs',{
        title:'Post',
        content:msg,
    });
});


app.get('/other', (rq,rs)=>{
    var name = rq.query.name;
    var pass = rq.query.pass;
    var msg = 'あなたの名前は' + name + '<br>パスワードは' + pass +'です';
    rs.render('index.ejs',{
        title: 'Other',
        content: msg,
        link:{href:'/', text:'トップページに移動'},
    });
});


app.listen(3000,()=>{
    console.log('Server running at http://localhost:3000/');
});