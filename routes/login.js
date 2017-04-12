var express = require('express');
var router = express.Router();
var query = require("../mysql.js");
var crypto = require('crypto');

router.get("/", function (req, res, next) {
    var yz = parseInt(Math.random() * 10000);
    req.session.yz=yz;
    res.render("admin/adminlogin", {data: yz});
});
router.use("/check", function (req, res, next) {
    var num = req.body.num;
    var yz = req.body.yz;
    var name = req.body.names;
    var pass = req.body.pass;
    var md5 = crypto.createHash('md5');
    md5.update(pass);
    pass = md5.digest("hex");
    if (yz == req.session.yz) {
        if (num == 0) {
            //学生
            query(`select * from student where del=0 and stdnum='${name}'`, function (error, rows, field) {
                if (error) {
                    req.session.yz=parseInt(Math.random() * 10000);
                    res.send("no");
                } else {
                    if (rows.length > 0) {
                        var result = rows[0];
                        if (result.pass == pass) {
                            req.session.login = "student";
                            req.session.user = name;
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("student");
                        } else {
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("no");
                        }
                    } else {
                        req.session.yz=parseInt(Math.random() * 10000);
                        res.send("no");
                    }

                }
            })
        } else if (num == "1") {
            //教师
            query(`select * from teacher where del=0 and jobnum='${name}'`, function (error, rows, field) {
                if (error) {
                    req.session.yz=parseInt(Math.random() * 10000);
                    res.send("no");
                } else {
                    if (rows.length > 0) {
                        var result = rows[0];
                        if (result.pass == pass) {
                            req.session.login = "teacher";
                            req.session.user = name;
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("teacher");
                        } else {
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("no");
                        }
                    } else {
                        req.session.yz=parseInt(Math.random() * 10000);
                        res.send("no");
                    }

                }
            })
        } else if (num == "2") {
            //管理员
            query(`select * from Administrator where del=0 and aname='${name}'`, function (error, rows, field) {
                if (error) {
                    req.session.yz=parseInt(Math.random() * 10000);
                    res.send("no");
                } else {
                    if (rows.length > 0) {
                        var result = rows[0];
                        if (result.pass == pass) {
                            req.session.login = "admin";
                            req.session.user = name;
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("admin");
                        } else {
                            req.session.yz=parseInt(Math.random() * 10000);
                            res.send("no");
                        }
                    } else {
                        req.session.yz=parseInt(Math.random() * 10000);
                        res.send("no");
                    }

                }
            })
        } else {
            req.session.yz=parseInt(Math.random() * 10000);
            res.send("no");
        }
    } else {
        req.session.yz=parseInt(Math.random() * 10000);
        res.send("no");
    }

});
router.use("/loginUp", function (req, res, next) {
    req.session.login = "";
    res.redirect("/login");
});

module.exports = router;