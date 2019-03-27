/*新增或编辑场所环境*/
$(function () {

    var rskrecordid = getQueryString("rskrecordid");
    $("#newGradeRskForm").validate({
        rules: {
            measurestatusvalue: {
                required: true
            },
            consequencevalue: {
                required: true
            },
            exposurevalue: {
                required: true
            }
        },
        messages: {
            measurestatusvalue: {
                required: "请选择控制措施的状态"
            },
            consequencevalue: {
                required: "请选择人员暴露于危险环境的频繁程度"
            },
            exposurevalue: {
                required: "请选择发生事故可能造成的后果"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    /*保存(新增或编辑)*/
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskevaluatemes/loadbynewrsk",
        dataType: "json",
        data: {
            rskrecordid: rskrecordid
        },
        success: function (data) {
            if (data) {
            	console.log(data);
            	if(data.hisRskResult){            		
            		var hisGradeRskTpt = _.template($("#hisGradeRskTpt").html());
            		$("#hisGradeRskForm").html(hisGradeRskTpt(data.hisRskResult));
            	}
                
                var newGradeRskTpt = _.template($("#newGradeRskTpt").html());
                $("#newGradeRskForm").html(newGradeRskTpt(data));

                SelectOption.loadRskDic("measurestatusvalue", {rskdictype: "measurestatus"});
                SelectOption.loadRskDic("consequencevalue", {rskdictype: "sequel"});
                SelectOption.loadRskDic("exposurevalue", {rskdictype: "exposure"});
                $("#rskrecordid").val(rskrecordid);

                $("#grade").off("click").on("click", function () {
                    gradeRsk();
                });

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});


function gradeRsk() {
    var measurestatus = $("#measurestatusvalue").val();
    var exposure = $("#consequencevalue").val();
    var consequence = $("#exposurevalue").val();
    if (!measurestatus) {
        parent.toast("请选择控制措施的状态");
        return;
    }
    if (!consequence) {
        parent.toast("请选择人员暴露于危险环境的频繁程度");
        return;
    }
    if (!exposure) {
        parent.toast("请选择发生事故可能造成的后果");
        return;
    }
    var measurestatusvalue = parseFloat(measurestatus);
    var consequencevalue = parseFloat(consequence);
    var exposurevalue = parseFloat(exposure);
    var dangervalue = measurestatusvalue * consequencevalue * exposurevalue;
    console.log(dangervalue);
    var rskrating;
    var rskratings;
    var rskratingdesc;
    if (dangervalue >= 180) {
        rskrating = "重大风险";
        rskratings = "<label style='color: #FD0314'>重大风险</label>";
        rskratingdesc = "<label style='color: #FD0314'>极其危险，不能继续作业</label>";
    }
    if (dangervalue <= 150 && dangervalue >= 90) {
        rskrating = "重大风险";
        rskratings = "<label style='color: #FD0314'>重大风险</label>";
        rskratingdesc = "<label style='color: #FD0314'>高度危险，需立即整改</label>";
    }
    if (dangervalue <= 80 && dangervalue >= 50) {
        rskrating = "较大风险";
        rskratings = "<label style='color: #FC5D07'>较大风险</label>";
        rskratingdesc = "<label style='color: #FC5D07'>显著危险，需要整改</label>";
    }
    if (dangervalue <= 48 && dangervalue >= 20) {
        rskrating = "一般风险";
        rskratings = "<label style='color: #FDE41B'>一般风险</label>";
        rskratingdesc = "<label style='color: #FDE41B'>可能危险，需要注意</label>";
    }
    if (dangervalue <= 18) {
        rskrating = "低风险";
        rskratings = "<label style='color: #1153FD'>低风险</label>";
        rskratingdesc = "<label style='color: #1153FD'>稍有危险，或许可以接受</label>";
    }
    $("#rskratingshow").html("风险等级：" + rskratings + "<br>风险性程度:" + rskratingdesc);
    $("#formula").html("R=" + measurestatusvalue + "*" + consequencevalue + "*" + exposurevalue + "=" + dangervalue);
    $("#dangervalue").val(dangervalue);
    $("#riskrating").val(rskrating);
    return "风险等级：" + rskratings + "<br>风险性程度:" + rskratingdesc;
}

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    if (repo.id) {
        $("#businessinfoid").val(repo.id);
    }

    if (repo.text) {
        $("#businessinfoname").val(repo.text);
    }
    return repo.text;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 保存
 * @returns
 */
function save() {
    var message = gradeRsk();

    var measurestatus = $("#measurestatusvalue option:selected").text();
    var exposure = $("#exposurevalue option:selected").text();
    var consequence = $("#consequencevalue option:selected").text();
    $("#measurestatus").val(measurestatus);
    $("#exposure").val(exposure);
    $("#consequence").val(consequence);


    parent.confirm("风险辨识结果:<br>" + message, function () {
        $.ajax({
            type: "post",
            url: BASE_URL + "dangersource/dssrskevaluatemes/save",
            data: $("#newGradeRskForm").serializeArray(),
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
    });


}

