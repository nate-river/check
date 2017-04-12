var express = require('express');
var router = express.Router();
var query = require("../mysql.js");
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/admin/login');
});
router.get('/student',function(req,res,next){
  if(req.session.login){
      res.render('index/homepage');
  }else{
    res.redirect('/');
  }

});
router.use("/studentLoginCheck",function(req,res,next){
  var sname = req.body.sname;
  var pass = req.body.pass;
    var md5 = crypto.createHash('md5');
    md5.update(pass);
    pass=md5.digest("hex");
  query(`select * from student where del=0 and sname='${sname}'`,function(error,rows,field){
    if(error){

    }else{
      if(rows){
        for(var i=0;i<rows.length;i++){
          if(rows[i].pass==pass){
            res.send("ok");
            break;
          }else{
            res.send("no")
          }
        }
      }else{
        res.send("no")
      }
    }
  })
});
router.get('/teacher',function(req,res,next){
    if(req.session.login=="teacher"||req.session.login=="admin"){
        res.render('index/task')
    }else{
        res.redirect('/');
    }
});
module.exports = router;
