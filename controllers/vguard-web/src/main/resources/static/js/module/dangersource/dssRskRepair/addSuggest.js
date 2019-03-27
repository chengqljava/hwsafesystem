/**
 * 新增和修改维修作业活动风险信息
 */
$(function () {
    var repairid = GetQueryString("repairid");
    $("#repairForm").validate({
        rules: {
            sugmeasure: {
                required: true,
                maxlength: 80
            }
        },
        messages: {
            sugmeasure: {
                required: "建议措施不能为空",
                maxlength: "最多输入255个字"
            }

        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrepair/load",
        dataType: "json",
        data: {
            repairid: repairid
        },
        success: function (data) {
            if (data) {
                var repairTpt = _.template($("#repairTpt").html());
                $("#repairForm").html(repairTpt(data));
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
        url: BASE_URL + "dangersource/dssrskrepair/addSug",
        data: $("#repairForm").serializeArray(),
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
	



