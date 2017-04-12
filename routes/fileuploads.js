var multer = require('multer');
var md5 = require('md5');
var config = require('./config');

var storage = multer.diskStorage({
    destination: config.upload.path,
    //TODO:文件区分目录存放
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + md5(file) + "." + fileFormat[fileFormat.length - 1]);
    }
});


var upload = multer({
    storage: storage,

});
//导出对象
module.exports = upload;