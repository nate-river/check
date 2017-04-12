
    function del(id) {
        if (confirm("您确定要删除吗?")) {
            $.ajax({
                url: "Administratordel",
                data: {id: id},
                type: "post",
                success: function () {
                    window.location.reload();//刷新当前页面.
                }
            })
        }
    }
    $(function(){
        $("#checkall").click(function(){
            $("input[name='id[]']").each(function(){
                if (this.checked) {
                    this.checked = false;
                }
                else {
                    this.checked = true;
                }
            });
        });

        $("#check").change(function(){
            var values = $("#check").val();
            alert(values);
            $.ajax({
                url:"/admin/selectclass",
                data:values,
                type:"post",
                success:function(){

                }
            })
        });
        /*验证*/
        $("#form").validate({
            rules: {
                aname: "required",
                pass1: {
                    required: true,
                    minlength: 6
                },
                pass2: {
                    required: true,
                    minlength: 6,
                    equalTo: "#pass1"
                },
            },
            messages: {
                aname: "必填",
                pass1: {
                    required: "必填",
                    minlength: "不得小于6位数"
                },
                pass2: {
                    required: "必填",
                    minlength: "不得小于6位数",
                    equalTo: "两次密码输入不一致"
                }
            }
        })

    })


    function updates(id) {
        $.ajax({
            url: "/admin/selectA",
            type: "post",
            data: {id: id},
            success: function (e) {
                $("input[name=aname]").val(e[0].aname);
                $("input[name=aid]").val(e[0].id);
                $("#form").attr("action", "/admin/updataAdministratordata");
            }
        });
    }

    function check(id){
        alert(id);
    }
