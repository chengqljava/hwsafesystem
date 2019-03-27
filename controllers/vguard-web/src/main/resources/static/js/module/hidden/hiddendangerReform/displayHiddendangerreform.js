/**
 * 详细信息
 */
$(function () {
    var hiddendangerreformid = GetQueryString("hiddendangerreformid");
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendangerreform/load",
        dataType: "json",
        data: {
        	'hiddendangerreformid': hiddendangerreformid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var hiddendangerTpt = _.template($("#hiddendangerTpt").html());
                $("#hiddendangerForm").html(hiddendangerTpt(data));
                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
                autoHeight();
            };
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
//    autoHeight();
});
//自适应高度
function autoHeight(){
	var height = $("html").height();
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
//  通过iframe的id设置高度
    $(window.parent.document).find("#"+frameId).css('height',height);
    $(window.parent.document).find("#"+frameId).parent('.layui-layer-content').parent('.layui-layer').css('height',height + 33 );
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
