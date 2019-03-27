/**
 * 新增和修改工艺过程风险信息
 */
$(function () {
    var techid = GetQueryString("techid");
    $("#techForm").validate({
        rules: {
            typeid: {
                required: true
            },
            element: {
                required: true,
                maxlength:500
            },
            introducer: {
                required: true,
                maxlength:500
            },
            warp: {
                required: true,
                maxlength:500
            },
            risk: {
                required: true,
                maxlength:500
            },
            riskfactor: {
                required: true,
                maxlength:500
            },
            ctrlmeasure: {
                required: true,
                maxlength:500
            }
        },
        messages: {
            typeid: {
                required: "所属模块不能为空"
            },
            element: {
                required: "要素不能为空",
                maxlength:"最多输入500个字"
            },
            introducer: {
                required: "特性不能为空",
                maxlength:"最多输入500个字"
            },
            warp: {
                required: "工作任务不能为空",
                maxlength:"最多输入500个字"
            },
            risk: {
                required: "安全风险不能为空",
                maxlength:"最多输入500个字"
            },
            riskfactor: {
                required: "可能导致事故的因素不能为空",
                maxlength:"最多输入500个字"
            },
            ctrlmeasure: {
                required: "控制措施不能为空",
                maxlength:"最多输入500个字"
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

                SelectTree.loadRiskTypeTree("typename", {
                    userType: 0,
                    typecode: 3
                }, "");

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
        url: BASE_URL + "dangersource/dssrsktech/save",
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
