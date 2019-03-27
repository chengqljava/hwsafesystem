/**
 * 详细信息
 */
$(function () {
    var checkplanid = GetQueryString("checkplanid");

    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckplan/load",
        dataType: "json",
        data: {
        	checkplanid: checkplanid
        },
        success: function (data) {
            if (data) {
                var govcommonplanTpt = _.template($("#govcommonplanTpt").html());
                $("#govcommonplanForm").html(govcommonplanTpt(data));
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
