/**
 * 新增和修改培训记录信息
 */
$(function () {
    var assessid = GetQueryString("assessid");

    $.ajax({
        type: "post",
        url: BASE_URL + "train/etsexaassess/load",
        dataType: "json",
        data: {
        	assessid: assessid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var assessInfoTpt = _.template($("#assessInfoTpt").html());
                $("#assessInfoForm").html(assessInfoTpt(data));
                var etsAttachFiles = data.etsAttachFiles;//资料附件
                showChooseFiles('assessfile', etsAttachFiles, BASE_URL + 'train/etsattach/download/', false);
                autoHeight();
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
