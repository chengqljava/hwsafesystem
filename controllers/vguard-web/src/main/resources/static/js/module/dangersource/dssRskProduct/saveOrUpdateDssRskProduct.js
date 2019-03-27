/**
 * 新增和修改生产作业活动风险信息
 */
$(function () {
    var productid = GetQueryString("productid");
    $("#prodActForm").validate({
        rules: {
            typeid: {
                required: true
            },
            procedure: {
                required: true,
                maxlength: 500
            },
            worktask: {
                required: true,
                maxlength: 500
            },
            saferisk: {
                required: true,
                maxlength: 500
            },
            adfactor: {
                required: true,
                maxlength: 500
            },
            ctrlmeasure: {
                required: true,
                maxlength: 500
            }
        },
        messages: {
            typeid: {
                required: "所属模块不能为空"
            },
            procedure: {
                required: "工序不能为空",
                maxlength: "最多输入500个字"
            },
            worktask: {
                required: "工作任务不能为空",
                maxlength: "最多输入500个字"
            },
            saferisk: {
                required: "安全风险不能为空",
                maxlength: "最多输入500个字"
            },
            adfactor: {
                required: "可能导致事故的因素不能为空",
                maxlength: "最多输入500个字"
            },
            ctrlmeasure: {
                required: "控制措施不能为空",
                maxlength: "最多输入500个字"
            }

        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskproduct/load",
        dataType: "json",
        data: {
            productid: productid
        },
        success: function (data) {
            if (data) {
                var prodActTpt = _.template($("#prodActTpt").html());
                $("#prodActForm").html(prodActTpt(data));

                SelectTree.loadRiskTypeTree("typename", {
                    userType: 0,
                    typecode: 6
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
        url: BASE_URL + "dangersource/dssrskproduct/save",
        data: $("#prodActForm").serializeArray(),
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
