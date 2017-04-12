$(function(){
    var num=3;
    setInterval(function(){
        num--;
        $(".tipsCon b").html(num);
        if(num==0){
            if($(".tipsCon a").attr("href")==""){
                history.go(-1);
            }else{
                location.href=$(".tipsCon a").attr("href");
            }
        }
    },1000);
})
