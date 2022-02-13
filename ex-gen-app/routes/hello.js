var express = require('express');
var router = express.Router();

router.get('/',(rq,rs)=>{
    var data = {title: 'Hello!',
                content: 'This is My Sample Page.',};
    rs.render('hello',data);
});

module.exports = router;