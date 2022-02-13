var express = require('express');
var router = express.Router();

//var http = require('https');
//var parseString = require('xml2js').parseString;
var mysql = require('mysql');

var mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-nodeapp-db00',
};

router.get('/',(rq,rs,next)=>{
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata', function(err, results, fields){
        if(err == null){
            var data = {title:'mysql', content: results}
            rs.render('db/index',data);
        };
    });
    connection.end();
});

router.get('/add',(rq,rs,next)=>{
    var data = {
        title: 'DB/Add',
        content: '新しいレコードを入力',
    };
    rs.render('db/add',data);
});

router.post('/add',(rq,rs,next)=>{
    var nm = rq.body.name;
    var ml = rq.body.mail;
    var ag = rq.body.age;
    var data = {
        'name': nm,
        'mail': ml,
        'age':  ag,
    };
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('INSERT into mydata set ?',data, function(err, results, fields){
        rs.redirect('/db');
    });
    connection.end();
});

router.get('/read',(rq,rs,next)=>{
    var id = rq.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata WHERE id=?', id, function(err, results, fields){
        if(err == null){
            if (results[0] == null)rs.redirect('/db');
            var data = {title:'DB/Read',
                        content: 'id = '+id+'のレコード：',
                        mydata:results[0]
            };
            rs.render('db/read',data);
        }
    });
    connection.end();
});

router.get('/edit',(rq,rs,next)=>{
    var id = rq.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata WHERE id=?', id, function(err, results, fields){
        if(err == null){
            if (results[0] == null)rs.redirect('/db');
            var data = {title:'DB/Edit',
                        content: 'id = '+id+'のレコード：',
                        mydata:results[0]
            };
            rs.render('db/edit',data);
        }
    });
    connection.end();
});

router.post('/edit',(rq,rs,next)=>{
    var id = rq.body.id
    var nm = rq.body.name;
    var ml = rq.body.mail;
    var ag = rq.body.age;
    var data = {
        'name': nm,
        'mail': ml,
        'age':  ag,
    };
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('UPDATE mydata set ? WHERE id = ?',[data,id], function(err, results, fields){
        rs.redirect('/db');
    });
    connection.end();
});

router.get('/delete',(rq,rs,next)=>{
    var id = rq.query.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata WHERE id=?', id, function(err, results, fields){
        if(err == null){
            if (results[0] == null)rs.redirect('/db');
            var data = {title:'DB/Delete',
                        content: 'id = '+id+'のレコード：',
                        mydata:results[0]
            };
            rs.render('db/delete',data);
        }
    });
    connection.end();
});

router.post('/delete',(rq,rs,next)=>{
    var id = rq.body.id;
    var connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('DELETE FROM mydata WHERE id=?', id, function(err, results, fields){
        rs.redirect('/db');
    });
    connection.end();
});

module.exports = router;