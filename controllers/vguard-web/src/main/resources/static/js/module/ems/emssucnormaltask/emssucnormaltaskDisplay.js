/*新增或编辑课程管理*/
$(function () {

    var normaltaskid = getQueryString("normaltaskid");

    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucnormaltask/load",
        dataType: "json",
        data: {
            normaltaskid: normaltaskid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL =BASE_URL;
                var normaltaskTpt = _.template($("#normaltaskTpt").html());
                $("#normaltaskForm").html(normaltaskTpt(data));
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