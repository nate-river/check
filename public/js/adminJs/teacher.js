
function del(id){
        if(confirm("您确定要删除吗?")){

            $.ajax({
                url:"teacherdel",
                data:{id:id},
                type:"post",
                success:function(){
                    window.location.reload();//刷新当前页面.
                }

            })
        }
    }


$("#checkall").click(function(){
    $("input[name='id[]']").each(function(){
        if (this.checked) {
            this.checked = false;
        }
        else {
            this.checked = true;
        }
    });
})

function DelSelect(){
    var Checkbox=false;
    $("input[name='id[]']").each(function(){
        if (this.checked==true) {
            Checkbox=true;
        }
    });
    if (Checkbox){
        var t=confirm("您确认要删除选中的内容吗？");
        if (t==false) return false;
    }
    else{
        alert("请选择您要删除的内容!");
        return false;
    }
}

/*上下页*/
var num = 0;
var falg1 = true;
var falg2 = true;
function next() {
    if (falg2) {
        if (falg1) {
            num++;
            $.ajax({
                url: "/admin/addteacher",
                type: "post",
                data: {num: num},
                success: function (data) {
                    console.log(data);
                    if (data.length == 0) {
                        alert("没有更多了");
                        num--;
                        falg2 = false;
                        falg1 = false;
                    } else {
                        $("tr").remove(".inner");
                        for (var i = 0; i < data.length; i++) {
                            $("#after").after(`<tr class="inner">
        <td>
          <input type="checkbox" name="id[]" value="${data[i].id}" />
          ${data.length-i}
        </td>
        <td>${data[i].jobnum}</td>
        <td>${data[i].tname}</td>
        <td>${data[i].c_id}</td>
        <td>
          ${data[i].addtime}
        </td>
        <td>${data[i].uptime}</td>
        <td><div class="button-group">
          <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span class="icon-edit"></span> 修改</a>
          <a class="button border-red" href="javascript:void(0)" onclick="return del('${data[i].id}')"><span class="icon-trash-o"></span> 删除</a> </div>
        </td>
      </tr>`)
                        }
                    }
                }
            })

        } else {
            alert("没有更多了");
        }
    }
}
function last() {
    if (num > 0) {
        falg2 = true;
        num--;
        $.ajax({
            url: "/admin/addteacher",
            type: "post",
            data: {num: num},
            success: function (data) {
                console.dir(data);
                if (data == "no") {
                    alert("没有更多了");
                    falg1 = false;
                } else {
                    $("tr").remove(".inner");
                    for (var i = 0; i < data.length; i++) {
                        $("#after").after(`<tr class="inner">
        <td>
          <input type="checkbox" name="id[]" value="${data[i].id}" />
         ${data.length-i}
        </td>
        <td>${data[i].jobnum}</td>
        <td>${data[i].tname}</td>
        <td>${data[i].c_id}</td>
        <td>
          ${data[i].addtime}
        </td>
        <td>${data[i].uptime}</td>
        <td><div class="button-group">
          <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span class="icon-edit"></span> 修改</a>
          <a class="button border-red" href="javascript:void(0)" onclick="return del('${data[i].id}')"><span class="icon-trash-o"></span> 删除</a> </div>
        </td>
      </tr>`)
                    }
                }
            }
        })
    } else {
        alert("没有更多了")
    }
}


    function updates(id){
        $.ajax({
            url:"/admin/selectT",
            type:"post",
            data:{id:id},
            success:function(e){
                console.log(e[0].tname);
                $("input[name=tname]").val(e[0].tname);
                $("input[name=jobnum]").val(e[0].jobnum);
                $("#form").attr("action","/admin/updatateacherdata");
                $("input[name=tid]").val(e[0].id);
            }
        });
    }
    /*teacher验证*/
    $("#form").validate({
        rules: {
            jobnum:"required",
            tname: "required",
            cid:"required",
            pass1: {
                minlength: 6,
            },
            pass2: {
                minlength: 6,
                equalTo: "#pass1"
            },
        },
        messages: {
            jobnum:"required",
            tname: "required",
            cid:"必填",
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

$(".header .cancel").click(function(){
    window.history.go(-1);
})
