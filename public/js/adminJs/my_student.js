function submit(){
    var pass0 = $("input[name=pass0]").val();
    var pass1 = $("input[name=pass1]").val();
    var pass2 = $("input[name=pass2]").val();
    if(pass1){
        if(pass2){
            if(pass1==pass2){
                $.ajax({
                    url:"/student/editPass",
                    type:"post",
                    data:{pass1:pass1,pass2:pass2,pass0:pass0},
                    success:function(e){
                        if(e.falg=="ok"){
                            $(".tishi_box").text(e.info);
                            $(".tishi_box").css("display","block");
                            setTimeout(function(){
                                $(".tishi_box").css("display","none");
                                location.href="/login";
                            },500);
                        }else{
                            $(".tishi_box").text(e.info);
                            $(".tishi_box").css("display","block");
                            setTimeout(function(){
                                $(".tishi_box").css("display","none");
                            },500);
                        }
                    }
                })
            }else{
                $(".tishi_box").text("两次密码输入不一致");
                $(".tishi_box").css("display","block");
                setTimeout(function(){
                    $(".tishi_box").css("display","none");
                },500);
                $("input[name=pass1]").val("");
                $("input[name=pass2]").val("");
                $("input[name=pass0]").val("");
            }
        }else{

        }
    }
}