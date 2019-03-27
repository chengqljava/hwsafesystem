/**
 * 新增和修改违约欠款信息
 */
$(function () {
    var violationid = GetQueryString("violationid");
    $("#badViolationForm").validate({
        rules: {
            businessinfoid: {
                required: true
            },
            violationtime: {
                required: true
            },
            money: {
                required: true,
                number: true
            },
            violationfact: {
                required: true,
                maxlength: 120
            },
            handlemethod: {
                maxlength: 120
            }
            ,
            remark: {
                maxlength: 120
            }
        },
        messages: {
            businessinfoid: {
                required: "企业名称不能为空"
            },
            violationtime: {
                required: "违约欠款日期不能为空"
            },
            money: {
                required: "拖欠款额不能为空",
                number: "请输入数字"
            },
            violationfact: {
                required: "违约事实不能为空",
                maxlength: "最多输入120个字"
            },
            handlemethod: {
                maxlength: "最多输入120个字"
            }
            ,
            remark: {
                maxlength: "最多输入120个字"
            }

        },
        submitHandler: function (form) {
            save();
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "ecs/ecsbadviolation/load",
        dataType: "json",
        data: {
            violationid: violationid
        },
        success: function (data) {
            if (data) {
                var badViolationTpt = _.template($("#badViolationTpt").html());
                $("#badViolationForm").html(badViolationTpt(data));
                if(violationid != "-1"){                	
                	$("#businessinfoid").attr("disabled",true);
                }
                SelectTwo.initSelect2($('#businessinfoid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业');

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
        url: BASE_URL + "ecs/ecsbadviolation/save",
        data: $("#badViolationForm").serializeArray(),
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
