var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var query = require("../mysql.js");
var pool = require("./mysql.js");


router.get('/', function (req, res, next) {
    res.render("index/student/homepage");
});
router.use("/exam", function (req, res, next){
   var stunum=req.session.user;
    pool.getConnection(function(err,conn){
        conn.query("SELECT * FROM student WHERE stdnum=?",[stunum],function(error,rows,field){
            conn.release();
            if(!error){
                    pool.getConnection(function (err, conn) {
                        conn.query("SELECT * FROM task",function (error, rows1, fields) {
                            if (!error) {
                                conn.release();
                                var data=[];
                                for(var j=0;j<rows1.length;j++){
                                var arr=rows1[j].c_id.split(",");
                                for(var i=0;i<arr.length;i++){
                                if(arr[i]==rows[0].c_id){
                                data.push(rows1[j]);
                                            }
                                         }
                                    }
                                pool.getConnection(function(err,conn){
                                    conn.query("SELECT * FROM sturecord WHERE s_id=?",[stunum],function(error,rows2,fields){
                                        if(!error){
                                            conn.release();
                                            var str="";
                                            for(var k=0;k<rows2.length;k++){
                                               str+=rows2[k].tid+";";
                                            }
                                            str=str.slice(0,-1);
                                            console.log(str);
                                            res.render("index/student/exam", {data: data,data1:str});
                                        }
                                    })
                                })
                            }
                        });
                    })
            }
        })
    })

});
//renderdata  = a.map(function(v,i){
//    const o = v;
//    o.options = b.filter(function(d,i){
//        return d.id = v.id
//    });
//    return o;
//})
//var ids = vals.map(function(v,i){
//    return v.qid
//}).join(',');
router.use("/test/:id", function (req, res, next){
    var tid = req.params.id;
    pool.getConnection(function(err,conn){
        conn.query("SELECT * FROM taskrecord WHERE task_id=?",[tid],function(erro,rows,field){
            conn.release();
            if(!erro){
                var tpl=rows.map(function(v,i){return v.q_id;}).join(",");
                pool.getConnection(function(err,conn){
                    conn.query(`SELECT * FROM questseared WHERE id in (${tpl})`,function(error,rows1,field){
                        if(!error){
                            pool.getConnection(function(err,conn){
                                conn.query(`select * from options where q_id in (${tpl})`,function(error,rows2,fields){
                                    conn.release();
                                    if(!error){
                                        pool.getConnection(function(err,conn){
                                                conn.query(`select * from solution where q_id in (${tpl})`,function(error,rows3,fields){
                                                    conn.release();
                                                    var  ret=rows3.map(function(v,i){
                                                        return v.correct;

                                                    }).join(",");
                                                    if(!error){
                                                        res.render("index/student/exam_online",{data:rows1,id:tid,data1:rows2,data2:ret});
                                                    }
                                                })
                                        })
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    })
});

router.use("/option/:id", function (req, res, next) {
    var id = req.params.id;
    pool.getConnection(function (err, conn) {
        conn.query("SELECT * FROM options WHERE q_id=?", [id], function (error, rows, fields) {
            conn.release();
            if (!error) {
                res.json(rows);
            }
        })
    })
});

router.use("/Tresult", function (req, res, next) {
    var data = JSON.parse(req.body.data);
    var s_id=req.session.user;
    var tid = req.body.tid;
    var num = req.body.num;
    var quenum = req.body.quenum;
    var stdnum=req.session.user;
    var newarr = [];
    for (var i = 0; i < data.length; i++) {
        var arr = [];
        arr.push(data[i].q_id);
        arr.push(data[i].whether);
        arr.push(data[i].mark);
        arr.push(data[i].del);
        arr.push(stdnum);
        arr.push(data[i].task_id);
        newarr.push(arr);
    }
    pool.getConnection(function (err, conn) {
        conn.query("INSERT INTO answer (q_id,whether,mark,del,stdnum,task_id) VALUES ?", [newarr], function (error, rows, result) {
            conn.release();
            if (!error) {
                pool.getConnection(function (err, conn) {
                    conn.query("INSERT INTO sturecord SET s_id=?,tid=?,del=?,score=?,quenum=?", [s_id, tid, "0", num, quenum], function (error, rows, result) {
                        conn.release();
                        if (!error) {
                            res.send("yes");
                        } else {
                            res.send("no");
                        }
                    })
                })

            }else{
                res.send("no");
            }

        })
    })
});

router.use("/result/:id", function (req, res, next) {
    var id = req.params.id;
    var stunum= req.session.user;
    pool.getConnection(function (err, conn) {
        conn.query("SELECT * FROM sturecord WHERE tid=?", [id], function (error, rows, fields) {
            conn.release();
            var rowed=[];
            rows.forEach(function(obj,i){
                if(obj.s_id==stunum){
                    rowed.push(obj);
                }
            })
            if (!error){
               pool.getConnection(function(err,conn){
                   conn.query("SELECT * FROM taskrecord WHERE task_id=?",[id],function(error,rows1,fields){
                       if(!error){
                           conn.release();
                           var str=rows1.map(function(v,i){
                               return v.q_id;
                           }).join(",");
                           pool.getConnection(function(err,conn){
                               conn.query(`SELECT * FROM questseared WHERE id in (${str}) order by type_id asc`,function(error,rows2,fields){
                                if(!error){
                                    pool.getConnection(function(err,conn){
                                        conn.query(`SELECT * FROM options WHERE  q_id in (${str})`,function(error,rows3,fields){
                                    if(!error){
                                        conn.release();
                                        pool.getConnection(function(err,conn){
                                            conn.query(`SELECT * FROM answer WHERE  stdnum=${stunum}`,function(error1,rows4,fields){                                 conn.release();
                                                if(!error1){
                                                    var spli=[];
                                                    var rows5=[];
                                                    rows4.forEach(function(obj,i){
                                                        if(obj.task_id==id){
                                                            rows5.push(obj);
                                                        }
                                                    })
                                                    rows5.forEach(function(obj,index){
                                                                spli.push(obj.mark);
                                                    });
             pool.getConnection(function(err,conn){
                 conn.query(`SELECT * FROM questsearch WHERE id in (${str}) order by type_id asc`,function(error,rows6,fields){
                     if(!error){
                         conn.release();
                         var answer=[];
                         rows6.forEach(function(obj,index){
                             answer.push(obj.correct);
                         });
                         //console.log(str);
                         //console.log(answer);
                         res.render("index/student/exam_score",{data:rowed,data1:rows2,data2:rows3,data3:spli,data4:answer});
                     }
                 })
             })
                                                }
                                            })
                                        })
                                    }
                                        })
                                    })
                                }
                               })
                           })
                       }
                   })
               })
            }
        })
    })
});


router.use("/examErr",function(req,res,next){
    var stdnum=req.session.user;
    pool.getConnection(function(err,conn){
        conn.query(`select * from answer where whether='0'`,function(error,rows,fields){
            conn.release();
            if(rows!=""){
                if (!error) {
                    var arr = [];
                    rows.forEach(function (obj, index) {
                        if (obj.stdnum == stdnum) {
                            arr.push(obj);
                        }
                    });
                    var tpl = arr.map(function (v, i) {
                        return v.q_id;
                    }).join(",");
                    var tab = arr.map(function (v, i) {
                        return v.mark;
                    }).join("=");
                    pool.getConnection(function (err, conn) {
                        conn.query(`select * from questseared where id in (${tpl})`, function (err1, rows1, field1) {
                            conn.release();
                            if (!err1) {
                                pool.getConnection(function (err, conn) {
                                    conn.query(`select * from options where q_id in (${tpl})`, function (err2, rows2, field2) {
                                        conn.release();
                                        if (!err2) {
                                            console.log(rows2 + "---" + tab);
                                            pool.getConnection(function(error,conn){
                                                conn.query(`select * from solution where q_id in (${tpl})`,function(err3,rows3,fields){
                                                    conn.release();
                                                    var answer=rows3.map(function(v,i){
                                                        return  v.correct;
                                                    }).join("?");
                                                    res.render("index/student/exam_score1", {
                                                        data1: rows1,
                                                        data2: rows2,
                                                        data3: tab,
                                                        data4:answer
                                                    });
                                                })
                                            })
                                        }
                                    })
                                })
                            }
                        })

                    })
                }
            }else{
                res.render("index/student/exam_score1", {
                    data1:"",
                    data2:"",
                    data3:""
                });
            }
        })
    })
})



//我的
router.use("/mine",function(req,res,next){
    res.render("index/student/my");
});
router.use("/user_psw",function(req,res,next){
    res.render("index/student/user_psw");
});
router.use("/editPass",function(req,res,next){
    var pass1 = req.body.pass1;
    var pass2 = req.body.pass2;
    var pass0 = req.body.pass0;
    var stdnum = req.session.user;
    if(stdnum){
        query(`select * from student where stdnum = '${stdnum}'`,function(error,rows,field){
            if(error){
                console.log(error);
            }else{
                var md5 = crypto.createHash('md5');
                md5.update(pass0);
                pass0=md5.digest("hex");
                if(rows[0].pass!=pass0){
                    res.send({falg:"no",info:"原始密码输入错误"});
                }else{
                    if(pass1==pass2){
                        if(pass1){
                            var md5 = crypto.createHash('md5');
                            md5.update(pass1);
                            pass1=md5.digest("hex");
                            query(`update student set pass='${pass1}' where stdnum = '${stdnum}'`,function(error,rows,next){
                                if(error){
                                    console.log(error);
                                }else{
                                    req.session.login=null;
                                    req.session.user=null;
                                    res.send({falg:"ok",info:"修改成功"});
                                }
                            })
                        }else{
                            res.send({falg:"no",info:"密码不能为空"});
                        }
                    }else{
                        res.send({falg:"no",info:"两次密码输入不一致"});
                    }
                }
            }
        });

    }else{
        res.send({falg:"no",info:"您还没有登录，请登录"});
    }


});
router.use("/userInfo",function(req,res,next){
    var stdnum = req.session.user;
    query(`select * from studentsclass where stdnum='${stdnum}'`,function(error,rows,field){
        res.render("index/student/user_info",{data:rows[0]});
    })
});
module.exports = router;

