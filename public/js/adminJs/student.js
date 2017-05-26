function del(id) {
    if (confirm("您确定要删除吗?")) {
        $.ajax({
            url: "/admin/studentdel",
            data: {id: id},
            type: "post",
            success: function () {
                window.location.reload();//刷新当前页面.
            }
        })
    }
}


var num = 0;
var falg1 = true;
var falg2 = true;
function next() {
    if (falg2) {
        if (falg1) {
            num++;
            $.ajax({
                url: "/admin/addstudent",
                type: "post",
                data: {num: num},
                success: function (data) {
                    var data = data.stud;
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
                    <input type="checkbox" name="id[]" value="${data[i].id}"/>
                    ${data.length-i}
                </td>
                <td>${data[i].stdnum}</td>
                <td>${data[i].sname}</td>
                <td>${data[i].cname}</td>
                <td>${data[i].phone}</td>
                <td>${data[i].addtime}</td>
                <td>${data[i].uptime}</td>
                <td>
                    <div class="button-group">
                        <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span
                                class="icon-edit"></span> 修改</a>
                        <a class="button border-red" href="javascript:void(0)"
                           onclick="return del('${data[i].id}')"><span class="icon-trash-o"></span> 删除</a>
                    </div>
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
            url: "/admin/addstudent",
            type: "post",
            data: {num: num},
            success: function (data) {
                var data = data.stud;
                if (data == "no") {
                    alert("没有更多了");
                    falg1 = false;
                } else {
                    $("tr").remove(".inner");
                    for (var i = 0; i < data.length; i++) {
                        $("#after").after(`<tr class="inner">
                <td>
                    <input type="checkbox" name="id[]" value="${data[i].id}"/>
                    ${data.length-i}
                </td>
                <td>${data[i].stdnum}</td>
                <td>${data[i].sname}</td>
                <td>${data[i].cname}</td>
                <td>${data[i].phone}</td>
                <td>${data[i].addtime}</td>
                <td>${data[i].uptime}</td>
                <td>
                    <div class="button-group">
                        <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span
                                class="icon-edit"></span> 修改</a>
                        <a class="button border-red" href="javascript:void(0)"
                           onclick="return del('${data[i].id}')"><span class="icon-trash-o"></span> 删除</a>
                    </div>
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

function updates(id) {
    $.ajax({
        url: "/admin/selectS",
        type: "post",
        data: {id: id},
        success: function (e) {
            $("input[name=sname]").val(e[0].sname);
            $("select[name=c_id]").val(e[0].c_id);
            $("input[name=phone]").val(e[0].phone);
            $("input[name=sid]").val(e[0].id);
            $("#form").attr("action", "/admin/updatastudentdata");
        }
    });
}
$(function(){





    $(function(){
        $("#checkall").click(function () {
            $("input[name='id[]']").each(function () {
                if (this.checked) {
                    this.checked = false;
                }
                else {
                    this.checked = true;
                }
            });
        })
        $("#check").change(function () {
            var values = $("#check").val();
            $.ajax({
                url: "/admin/addstudent",
                data: {values:values},
                type: "post",
                success: function (data) {
                    var data = data.stud;
                    if (data == "no") {
                        alert("没有更多了");
                        falg1 = false;
                    } else {
                        $("tr").remove(".inner");
                        for (var i = 0; i < data.length; i++) {
                            $("#after").after(`<tr class="inner">
                <td>
                    <input type="checkbox" name="id[]" value="${data[i].id}"/>
                    ${data[i].id}
                </td>
                <td>${data[i].stdnum}</td>
                <td>${data[i].sname}</td>
                <td>${data[i].cname}</td>
                <td>${data[i].phone}</td>
                <td>${data[i].addtime}</td>
                <td>${data[i].uptime}</td>
                <td>
                    <div class="button-group">
                        <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span
                                class="icon-edit"></span> 修改</a>
                        <a class="button border-red" href="javascript:void(0)"
                           onclick="return del('${data[i].id}')"><span class="icon-trash-o"></span> 删除</a>
                    </div>
                </td>
            </tr>`)
                        }
                    }

                }
            })
        });
        /*student验证*/
        $("#form").validate({
            rules: {
                c_id: "required",
                sname: "required",
                phone: "required",
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
                c_id: "必填",
                sname: "必填",
                phone: "必填",
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
        });
    });
    $(".header .cancel").click(function(){
        window.history.go(-1);
    });
})