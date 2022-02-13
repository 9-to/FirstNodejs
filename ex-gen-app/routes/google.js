var express = require('express');
var router = express.Router();

var http = require('https');
var parseString = require('xml2js').parseString;

router.get('/',(rq,rs,next)=>{
    var opt = {
        host: 'news.google.com',
        port: 443,
        path: '/rss?ie=UTF-8&oe=UTF-8&hl=en-US&gl=US&ceid=US:en'
    };
    http.get(opt,(res2)=>{
        var body ='';
        res2.on('data',(data)=>{
            body += data;
        });
        res2.on('end',()=>{
            parseString(body.trim(), (err, result)=>{
                var data = {
                    title: 'google RSS info',
                    content: result.rss.channel[0].item,
                };
                rs.render('google',data);
            });
        });
        res2.on('error',(data)=>{
            console.log('err');
        });
    });
});

module.exports = router;