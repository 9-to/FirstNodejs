var express = require('express');
var router = express.Router();

var data =[
    {name: 'Taro', age:35, mail:'taro@yamada'},
    {name:'Hanako', age:29, mail:'hanako@flower'},
    {name:'Sachiko', age:41, mail:'sachiko@happy'},
];

router.get('/',(rq,rs,next)=>{
    var n = rq.query.id;
    rs.json(data[n]);
});


module.exports = router;