var express = require('express');
var router = express.Router();

router.get('/',(rq,rs)=>{
    var msg = "なんか書け";
    if(rq.session.message != undefined){
        msg = "Last message: "+ rq.session.message;
    }
    var data = {title: 'Hello!',
                content: msg,};
    rs.render('hello',data);
});

router.post('/post',(rq,rs)=>{
    var msg = rq.body['message'];
    rq.session.message = msg;
    var data = {title: 'Hello!',
                content: "Last message: "+ rq.session.message,};
    rs.render('hello',data);
});

module.exports = router;