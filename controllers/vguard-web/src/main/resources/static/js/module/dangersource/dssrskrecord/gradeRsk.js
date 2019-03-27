/*新增或编辑场所环境*/
$(function () {

    var rskrecordid = getQueryString("rskrecordid");
    $("#gradeRskForm").validate({
        rules: {
            likelihoodvalue: {
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
            likelihoodvalue: {
                required: "请选择事故发生的可能性"
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
        url: BASE_URL + "dangersource/dssrskevaluaterecord/loadByRskRecordid",
        dataType: "json",
        data: {
            rskrecordid: rskrecordid
        },
        success: function (data) {
            if (data) {
                var gradeRskTpt = _.template($("#gradeRskTpt").html());
                $("#gradeRskForm").html(gradeRskTpt(data));

                SelectOption.loadRskDic("likelihoodvalue", {rskdictype: "likelihood"});
                SelectOption.loadRskDic("consequencevalue", {rskdictype: "consequence"});
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
    var likelihood = $("#likelihoodvalue").val();
    var exposure = $("#consequencevalue").val();
    var consequence = $("#exposurevalue").val();
    if (!likelihood) {
        parent.toast("请选择事故发生的可能性");
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
    var likelihoodvalue = parseFloat(likelihood);
    var consequencevalue = parseFloat(consequence);
    var exposurevalue = parseFloat(exposure);
    var dangervalue = likelihoodvalue * consequencevalue * exposurevalue;
    console.log(dangervalue);
    var rskrating;
    var rskratings;
    var rskratingdesc;
    if (dangervalue > 320) {
        rskrating = "重大风险";
        rskratings = "<label style='color: #FD0314'>重大风险</label>";
        rskratingdesc = "<label style='color: #FD0314'>极其危险，不能继续作业</label>";
    }
    if (dangervalue <= 320 && dangervalue > 160) {
        rskrating = "重大风险";
        rskratings = "<label style='color: #FD0314'>重大风险</label>";
        rskratingdesc = "<label style='color: #FD0314'>高度危险，需立即整改</label>";
    }
    if (dangervalue <= 160 && dangervalue > 70) {
        rskrating = "较大风险";
        rskratings = "<label style='color: #FC5D07'>较大风险</label>";
        rskratingdesc = "<label style='color: #FC5D07'>显著危险，需要整改</label>";
    }
    if (dangervalue <= 70 && dangervalue > 20) {
        rskrating = "一般风险";
        rskratings = "<label style='color: #FDE41B'>一般风险</label>";
        rskratingdesc = "<label style='color: #FDE41B'>可能危险，需要注意</label>";
    }
    if (dangervalue < 20) {
        rskrating = "低风险";
        rskratings = "<label style='color: #1153FD'>低风险</label>";
        rskratingdesc = "<label style='color: #1153FD'>稍有危险，或许可以接受</label>";
    }
    $("#rskratingshow").html("风险等级：" + rskratings + "<br>风险性程度:" + rskratingdesc);
    $("#formula").html("D=" + likelihoodvalue + "*" + consequencevalue + "*" + exposurevalue + "=" + dangervalue);
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

    var likelihood = $("#likelihoodvalue option:selected").text();
    var exposure = $("#exposurevalue option:selected").text();
    var consequence = $("#consequencevalue option:selected").text();
    $("#likelihood").val(likelihood);
    $("#exposure").val(exposure);
    $("#consequence").val(consequence);


    parent.confirm("风险辨识结果:<br>" + message, function () {
        $.ajax({
            type: "post",
            url: BASE_URL + "dangersource/dssrskevaluaterecord/save",
            data: $("#gradeRskForm").serializeArray(),
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

