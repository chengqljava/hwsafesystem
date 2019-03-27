/**
 * 新增和修改工艺过程风险信息
 */
$(function () {
    var techid = GetQueryString("techid");
    $("#techForm").validate({
        rules: {
            sugmeasure: {
                required: true,
                maxlength: 80
            }
        },
        messages: {
            sugmeasure: {
                required: "建议措施不能为空",
                maxlength: "最多输入80个字"
            }

        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrsktech/load",
        dataType: "json",
        data: {
            techid: techid
        },
        success: function (data) {
            if (data) {
                var techTpt = _.template($("#techTpt").html());
                $("#techForm").html(techTpt(data));
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}


/**
 * 保存
 * @returns
 */
function save() {
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrsktech/addSug",
        data: $("#techForm").serializeArray(),
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("编辑失败");
        }
    });

}
	



