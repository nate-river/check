$(function () {
    //获取用户名和密码
    var user,psw;
    //登录
    var login=$('.login_btn .login');
    login.on('click',function () {
        user=$('.user input').val();
        psw=$('.psw input').val();
        location.href='task.html';
        //ajax请求判断用户登录是否正确
        /*$.post("", { user: ""+user+"", psw: ""+psw+"" },
        function(data){
            if(data=='ok'){
                location.href='task.html';
            }
        });*/
    })
    //取消
    var cancel=$('.login_btn .cancel');
    cancel.on('click',function () {
        $('.user input').val('');
        $('.psw input').val('');
    })
})