var express = require('express');
var ejs = require('ejs');

var app = express();

app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));

app.get('/', (rq,rs)=>{
    var url = '/other?name=taro&pass=yamada'
    var msg = 'This is Index Page!<br>' + 'これはトップページ';
    rs.render('index.ejs',{
        title: 'Index',
        content: msg,
        link:{href: url, text: '別のページに移動'},
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