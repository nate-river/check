$(function () {
    //首页轮播管理
    var mySwiper1 = new Swiper('#banner', {
        direction: 'horizontal',
        loop: true,
        //是否需要分页器
        pagination: '.swiper-pagination',
        autoplay: 3000,
        speed: 300,
        grabCursor : true
    })

    //公告管理
    var mySwiper2 = new Swiper('#right', {
        direction: 'vertical',
        loop: true,
        autoplay: 3000,
        speed: 300,
        grabCursor : true
    })

    //在线考试页面
    $('.exam_test .option').on('click','a',function () {
        $(this).parent().find('span').removeClass('icon-t');
        // $('.exam_test .option').find('span').removeClass('icon-t');
        $(this).find('span').addClass('icon-t');
    })
    //提交试卷
    $(".navbar-header .back").click(function(){
        window.history.go(-1);
    });
    $(".header .cancel").click(function(){
        window.history.go(-1);
    })

})