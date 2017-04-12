var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var query = require("../mysql.js");
var pool=require("./mysql.js");

/* GET home page. */
router.get('/', function(req, res, next){
  var name=req.session.user;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM task  WHERE t_id=? ORDER BY ID DESC",[name],function(error,rows,fields){
      conn.release();
        if(!error){
          var data=rows?rows:"";
         pool.getConnection(function(err,conn){
           conn.query("SELECT * FROM task  WHERE t_id=? ORDER BY ID DESC LIMIT 0,1",[name],function(error,rows1,fields){
             res.render('index/teacher/task',{data:data,data1:rows1});
           })
         })
        }
    })
  })
});
router.use('/task', function(req, res, next){
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM stage  WHERE s_id=234",function(error,rows,fields){
      conn.release();
      res.render('index/teacher/arrange_task',{data:rows});
    })
  })
});
router.use('/Option/:id', function(req, res, next){
  var sid=req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM stage  WHERE s_id=?",[sid],function(error,rows,fields){
      conn.release();
      pool.getConnection(function(err,conn){
        conn.query("SELECT * FROM stage WHERE id=?",[sid],function(error,rows1,fields){
          conn.release();
          res.render('index/teacher/arrange',{data:rows,data1:rows1});
        })
      })
    })
  })
});

router.use('/point/:id', function(req, res, next){
  var tid = req.params.id;
        pool.getConnection(function(err,conn){
          conn.query(`SELECT * FROM questseared `,function(error,rows,field){
            var tpl=rows.map(function(v,i){return v.id;}).join(",");
            if(!error){
              pool.getConnection(function(err,conn){
                conn.query(`select * from options`,function(error,rows1,fields){
                  conn.release();
                  if(!error){
                    pool.getConnection(function(err,conn){
                      conn.query("SELECT * FROM type",function(error,rows2,fields){
                        conn.release();
                        if(!error){
                          pool.getConnection(function(err,conn){
                            conn.query("SELECT * FROM stage WHERE id=?",[tid],function(error,rows3,fields){
                              conn.release();
                              console.log(error);
                              if(!error){
                                console.log(rows);
                                res.render("index/teacher/know_test1",{data:rows,id:tid,data1:rows1,data2:rows2,data3:rows3});
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



router.use('/question/:id', function(req, res, next){
  var sid=req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM question WHERE id=?",[sid],function(error,rows,fields){
      conn.release();
      if(rows[0].type_id==1||rows[0].type_id==2){
        pool.getConnection(function(err,conn){
          conn.query("SELECT * FROM options WHERE q_id=?",[sid],function(error,rows1,fields){
            conn.release();
            res.render('index/teacher/know_quest',{data:rows,data1:rows1});
          })
        })
      }else{
        res.render('index/teacher/know_quest',{data:rows,data1:""});
      }
    })
  })
});

//保存修改的ajax路由
router.use("/addTask",function(req,res,next){
      var data=req.body.data;
      var name="试卷草稿";
      var myDate=new Date();
      var month=myDate.getMonth()+1;
      var day=myDate.getDate();
      var time=month+"月"+day+"日";
      var  t_id=req.session.user;
      pool.getConnection(function(err,conn){
        conn.query("INSERT INTO task SET name=?,c_id=?,t_id=?,status=?,del=?,time=?",[name,"",t_id,"2","0",time],function(error,rows,fields){
             conn.release();
             if(!error){
               var tid=rows.insertId;
               var spl=data.split(";");
               var arr=[];
               for(i=0;i<spl.length;i++){
                 var newarr=[];
                 newarr.push(tid);
                 newarr.push(spl[i]);
                 newarr.push("0");
                 arr.push(newarr);
               }

               pool.getConnection(function(err,conn){
                 conn.query("INSERT INTO taskrecord  (task_id,q_id,del) VALUES ?",[arr],function(erro,vals,fields){
                   conn.release();
                   if(!erro){
                     res.send("yes");
                   }
                 })
               })
             }
        })
      })
});


//直接发布的ajax路由
router.use("/diectly",function(req,res,next){
  var data=req.body.data;
  var name="试卷草稿";
  var myDate=new Date();
  var month=myDate.getMonth()+1;
  var day=myDate.getDate();
  var time=month+"月"+day+"日";
  var  t_id=req.session.user;
  console.log(t_id)
  pool.getConnection(function(err,conn){
    conn.query("INSERT INTO task SET name=?,c_id=?,t_id=?,status=?,del=?,time=?",[name,"",t_id,"2","0",time],function(error,rows,fields){
      conn.release();
      if(!error){
        var tid=rows.insertId;
        var spl=data.split(";");
        var arr=[];
        for(i=0;i<spl.length;i++){
          var newarr=[];
          newarr.push(tid);
          newarr.push(spl[i]);
          newarr.push("0");
          arr.push(newarr);
        }

        pool.getConnection(function(err,conn){
          conn.query("INSERT INTO taskrecord  (task_id,q_id,del) VALUES ?",[arr],function(erro,vals,fields){
            conn.release();
            if(!erro){
              res.json(rows.insertId);
            }
          })
        })
      }
    })
  })
});


router.use("/showQuest/:id", function (req, res, next) {
  var tid = req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM taskrecord WHERE task_id=?",[tid],function(erro,rows,field){
      conn.release();
      if(!erro){
        console.log(rows)
        var tpl=rows.map(function(v,i){return v.q_id;}).join(",");
        pool.getConnection(function(err,conn){
          conn.query(`SELECT * FROM questseared WHERE id in (${tpl})`,function(error,rows1,field){
            conn.release();
            if(!error){
              pool.getConnection(function(err,conn){
                conn.query(`select * from options where q_id in (${tpl})`,function(error,rows2,fields){
                  conn.release();
                  if(!error){
                    res.render("index/teacher/show_task",{data:rows1,id:tid,data1:rows2});
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


router.use("/publish/:id",function(req,res,next){
      var id=req.params.id;
      var t_id=req.session.user;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM teacher WHERE jobnum=?",[t_id],function(error,rows1,fields){
      conn.release();
      console.log(error)
      if(!error){
        pool.getConnection(function(err,conn){
          conn.query(`SELECT * FROM class WHERE id in (${rows1[0].c_id})`,function(error,rows,fields){
            conn.release();
            if(!error){
              console.log(rows);
              console.log(rows1[0].c_id);
              res.render("index/teacher/test_pub",{tid:id,data:rows});
            }
          })
        })
      }
    })
  })
});



router.use("/updateTask/:id",function(req,res,next){
  pool.getConnection(function(err,conn){
    console.log(req.body.c_id)
    conn.query("UPDATE task SET c_id=?,status=?,name=?,c_name=?  where id=?",[req.body.c_id,req.body.status,req.body.name,req.body.c_name,req.params.id],function(error,rows,fields){
      conn.release();
      if(!error){
        res.send("yes");
      }
    })
  })
});

router.use("/showWork/:id",function(req,res,next){
   var tid=req.params.id;
   var teaid=req.session.user;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM task WHERE id=?",[tid],function(error,rows,fields){
      conn.release();
      if(!error){
        pool.getConnection(function(err,conn){
          conn.query("SELECT * FROM taskrecord WHERE task_id=?",[tid],function(error,rows1,fields){
            conn.release();
            if(!error){

              pool.getConnection(function(err,conn){
                conn.query("select * from task where id=?",[tid],function(error,rows2,fields){
                  if(!error){
                    conn.release();
                    pool.getConnection(function(err,conn){
                      conn.query(`select * from studentsclass where c_id in (${[rows2[0].c_id]})`,function(error,rows3,field){
                        conn.release();
                        if(!error){
                          var tpl="";
                          tpl=rows3.map(function(v,i){
                            return v.stdnum;
                          }).join(",");
                          pool.getConnection(function(err,conn){
                            conn.query(`select * from sturecord where s_id in (${tpl})`,function(error,rows4,field){
                              conn.release();
                              if(!error){
                                var arr=[];
                                rows4.forEach(function(obj,i){
                                  if(obj.tid==tid){
                                    arr.push(obj);
                                  }
                                })
                                res.render("index/teacher/task_report",{data:rows,len:rows1.length,count:rows3.length,work:arr.length});
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
})


router.use("/stuInfo/:id",function(req,res,next){
  var tid=req.params.id;
  var teaid=req.session.user;
  pool.getConnection(function(err,conn){
    conn.query("select * from task where id=?",[tid],function(error,rows,fields){
      if(!error){
        conn.release();
        pool.getConnection(function(err,conn){
          conn.query(`select * from studentsclass where c_id in (${rows[0].c_id})`,function(error,rows1,field){
            conn.release();
            if(!error){
              var tpl="";
              tpl=rows1.map(function(v,i){
                return v.stdnum;
              }).join(",");
              pool.getConnection(function(err,conn){
                conn.query(`select * from sturecord where s_id in (${tpl})`,function(error,rows2,field){
                  conn.release();
                  if(!error){
                    var arr=[];
                    rows2.forEach(function(obj,i){
                      if(obj.tid==tid){
                        arr.push(obj);
                      }
                    })
                    res.render("index/teacher/stu_pro",{data:arr,data1:rows1,tid:tid})
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





router.use("/workInfo/:id", function (req, res, next) {
  var tid = req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM taskrecord WHERE task_id=?",[tid],function(erro,rows,field){
      conn.release();
      if(!erro){
        console.log(rows)
        var tpl=rows.map(function(v,i){return v.q_id;}).join(",");
        pool.getConnection(function(err,conn){
          conn.query(`SELECT * FROM questseared WHERE id in (${tpl})`,function(error,rows1,field){
            if(!error){
              pool.getConnection(function(err,conn){
                conn.query(`select * from options where q_id in (${tpl})`,function(error,rows2,fields){
                  conn.release();
                  if(!error){
                    res.render("index/teacher/task_draft",{data:rows1,id:tid,data1:rows2});
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


//给草稿添加试题
router.use("/reAdd",function(req,res,next){
  var tid=req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM stage  WHERE s_id=234",function(error,rows,fields){
      conn.release();
      res.render('index/teacher/arrange_task1',{data:rows});
    })
  })
})
router.use("/reOption/:id",function(req,res,next){
  var sid=req.params.id;
  pool.getConnection(function(err,conn){
    conn.query("SELECT * FROM stage  WHERE s_id=?",[sid],function(error,rows,fields){
      conn.release();
      pool.getConnection(function(err,conn){
        conn.query("SELECT * FROM stage WHERE id=?",[sid],function(error,rows1,fields){
          conn.release();
          res.render('index/teacher/arrange1',{data:rows,data1:rows1});
        })
      })
    })
  })
})

router.use("/rePoint/:id/:tid",function(req,res,next){
  var tid = req.params.id;
  var task_id=req.params.tid;
  pool.getConnection(function(err,conn){
    conn.query(`SELECT * FROM questseared `,function(error,rows,field){
      var tpl=rows.map(function(v,i){return v.id;}).join(",");
      if(!error){
        conn.release();
        pool.getConnection(function(err,conn){
          conn.query(`select * from options`,function(error,rows1,fields){
            conn.release();
            if(!error){
              pool.getConnection(function(err,conn){
                conn.query("SELECT * FROM type",function(error,rows2,fields){
                  conn.release();
                  if(!error){
                    pool.getConnection(function(err,conn){
                      conn.query("SELECT * FROM taskrecord WHERE task_id=?",[task_id],function(error,rows3,fields){
                        if(!error){
                          conn.release();
                          var arr=[];
                          for(var i=0;i<rows.length;i++){
                            if(filter(rows[i].id)){
                              arr.push(rows[i]);
                            }
                          }
                          function filter(e){
                            for(var j in rows3){
                              if(rows3[j].q_id==e){
                                return false;
                                break;
                              }
                            }
                            return true;
                          }
                          console.log(arr);
                          pool.getConnection(function(err,conn){
                            conn.query("select * from stage where id=?",[tid],function(error,rows3,fields){
                              conn.release();
                              if(!error){
                                res.render("index/teacher/know_test2",{data:arr,id:tid,data1:rows1,data2:rows2,data3:rows3});
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
router.use("/Wquetion",function(req,res,next){
      pool.getConnection(function(err,conn){
        conn.query("select * from taskrecord",function(error,rows,fields){
          conn.release();
          if(!error){
            res.json(rows);
          }
        });
      });
});
router.use("/readdTask",function(req,res,next){
        var tid=req.body.task_id;
        var data=req.body.data;
        var spl=data.split(";");
        var arr=[];
        for(i=0;i<spl.length;i++){
          var newarr=[];
          newarr.push(tid);
          newarr.push(spl[i]);
          newarr.push("0");
          arr.push(newarr);
        }
        pool.getConnection(function(err,conn){
          conn.query("INSERT INTO taskrecord  (task_id,q_id,del) VALUES ?",[arr],function(erro,vals,fields){
            conn.release();
            if(!erro){
              res.send("yes");
            }
          })
        })
});


router.use("/rediectly",function(req,res,next){
  var tid=req.body.task_id;
  var data=req.body.data;
  var spl=data.split(";");
  var arr=[];
  for(i=0;i<spl.length;i++){
    var newarr=[];
    newarr.push(tid);
    newarr.push(spl[i]);
    newarr.push("0");
    arr.push(newarr);
  }
  pool.getConnection(function(err,conn){
    conn.query("INSERT INTO taskrecord  (task_id,q_id,del) VALUES ?",[arr],function(erro,vals,fields){
      conn.release();
      if(!erro){
        res.send("yes");
      }
    })
  })
});


router.use("/stuInfo/:id",function(req,res,next){
  var tid=req.params.id;
  var teaid=req.session.user;
  pool.getConnection(function(err,conn){
    conn.query("select * from teacher where jobnum=?",[teaid],function(error,rows,fields){
            if(!error){
              conn.release();
              pool.getConnection(function(err,conn){
                conn.query("select * from studentsclass where c_id=?",[rows[0].c_id],function(error,rows1,field){
                  conn.release();
                  if(!error){
                    var tpl="";
                    tpl=rows1.map(function(v,i){
                      return v.stdnum;
                    }).join(",");
                    pool.getConnection(function(err,conn){
                      conn.query(`select * from sturecord where s_id in (${tpl})`,function(error,rows2,field){
                        conn.release();
                        if(!error){
                         var arr=[];
                          rows2.forEach(function(obj,i){
                            if(obj.tid==tid){
                              arr.push(obj);
                            }
                          })
                          res.render("index/teacher/stu_pro",{data:arr,data1:rows1,tid:tid})
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

router.use("/result/:id/:name", function (req, res, next) {
  var id = req.params.id;
  var stunum= req.params.name;
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
                                      console.log(rows2)
                                      console.log(str);
                                      console.log(answer);
                                      res.render("index/student/exam_score2",{data:rowed,data1:rows2,data2:rows3,data3:spli,data4:answer});
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












/*我的*/
router.use("/mine",function(req,res,next){
  res.render("index/teacher/my");
});
router.use("/user_psw",function(req,res,next){
  res.render("index/teacher/user_psw");
});
router.use("/editPass",function(req,res,next){
  var pass1 = req.body.pass1;
  var pass2 = req.body.pass2;
  var pass0 = req.body.pass0;
  var jobnum = req.session.user;
  if(jobnum){
    query(`select * from teacher where jobnum = '${jobnum}'`,function(error,rows,field){
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
              query(`update teacher set pass='${pass1}' where jobnum = '${jobnum}'`,function(error,rows,next){
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
  var jobnum = req.session.user;
  query(`select * from teacher where jobnum='${jobnum}'`,function(error,rows,field){
    query(`select * from class where id in (${rows[0].c_id})`,function(error,rows1,fields){
      if(!error){
        var str=rows1.map(function(v,i){
          return v.cname
        }).join("、");
        res.render("index/teacher/user_info",{data:rows[0],data1:str});
      }
    })
  })
});

router.get("/show/:c_id",function(req,res,next){
  var c_id = req.params.c_id;
  query(`select * from student where c_id=${c_id}`, function (error, rows, field) {
    if (error) {
      console.log(error);
    } else {
      res.render("admin/show", {data: rows});
    }
  });
});
module.exports = router;
