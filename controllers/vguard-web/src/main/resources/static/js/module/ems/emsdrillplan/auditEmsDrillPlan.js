/*新增或编辑课程管理*/
$(function () {
	$("#ids").val(getQueryString("curSelPidIdArr"));
    $("#emsDrillOpinionForm").validate({
        rules: {
        	result: {
                required: true
            },
            opinion: {
                required: true
            }
        },
        messages: {
        	result: {
                required: "请选择审核结果"
            },
            opinion: {
                required: "请填写审核意见"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });
});

/*保存(新增或编辑)*/
function save() {
    $.ajax({
        type: "post",
        async: false,
        url: BASE_URL + "ems/emsdrillplan/audit",
        data: $("#emsDrillOpinionForm").serializeArray(),
        dataType: "json",
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}