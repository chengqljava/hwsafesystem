/*新增或编辑课程管理*/
$(function () {
    //回显
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdrillplan/load/"+getQueryString("pid"),
        dataType: "json",
        data: {},
        success: function (data) {
            if (data) {
                var emsDrillPlanTpt = _.template($("#emsDrillPlanTpt").html());
                $("#emsDrillPlanForm").html(emsDrillPlanTpt(data));
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}