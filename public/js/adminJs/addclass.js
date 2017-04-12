

    function del(id) {
        if (confirm("您确定要删除吗?如果本班不为空则不能删除")) {
            $.ajax({
                url: "classdel",
                data: {id: id},
                type: "post",
                success: function () {
                    window.location.reload();//刷新当前页面.
                }

            })
        }
    }
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
        });
        $("#form").validate({
            rules: {
                genre: "required",
                cname: "required"
            },
            messages: {
                genre: "必填",
                cname: "必填"
            }
        });


    })

function DelSelect() {
    var Checkbox = false;
    $("input[name='id[]']").each(function () {
        if (this.checked == true) {
            Checkbox = true;
        }
    });
    if (Checkbox) {
        var t = confirm("您确认要删除选中的内容吗？");
        if (t == false) return false;
    }
    else {
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
                url: "/admin/addclass",
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
                <input type="checkbox" name="id[]" value="${data[i].id}"/> ${data.length-i}
                </td>
                <td>${data[i].cname}</td>
                <td>
                ${data[i].genre}
                </td>
                <td>
                    ${data[i].addtime}
                </td>
                <td>${data[i].uptime}</td>
                <td>
                    <div class="button-group">
                        <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span
                                class="icon-edit"></span> 修改</a>
                        <a class="button border-red" href="javascript:void(0)" onclick="return del('${data[i].id}')">
                            <span class="icon-trash-o"></span> 删除</a></div>
                </td>`)
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
            url: "/admin/addclass",
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
                <input type="checkbox" name="id[]" value="${data[i].id}"/> ${data.length-i}
                </td>
                <td>${data[i].cname}</td>
                <td>
                ${data[i].genre}
                </td>
                <td>
                    ${data[i].addtime}
                </td>
                <td>${data[i].uptime}</td>
                <td>
                    <div class="button-group">
                        <a class="button border-main" href="#add" onclick="return updates('${data[i].id}')"><span
                                class="icon-edit"></span> 修改</a>
                        <a class="button border-red" href="javascript:void(0)" onclick="return del('${data[i].id}')">
                            <span class="icon-trash-o"></span> 删除</a></div>
                </td>`)
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
            url: "/admin/selectC",
            type: "post",
            data: {id: id},
            success: function (e) {
                $("input[name=cname]").val(e[0].cname);
                $("input[name=genre]").val(e[0].genre);
                $("#form").attr("action", "/admin/updataclassdata");
                $("input[name=cid]").val(e[0].id);
            }
        });
    }
    /*class验证*/
