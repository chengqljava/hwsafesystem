/**
 * 详细信息
 */
$(function () {
    var hiddendangerid = GetQueryString("hiddendangerid");

    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendangerrecheck/load",
        dataType: "json",
        data: {
        	'hiddendangerid': hiddendangerid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var hiddendangerTpt = _.template($("#hiddendangerTpt").html());
                $("#hiddendangerForm").html(hiddendangerTpt(data));

                $('#trainpic').empty();
                $('#trainpic').hide();
                $('#picWarning').hide();

                var attach = data.attachList;//图片附件

                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
            }
            autoHeight();
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});
function autoHeight(){
	var height = $("body").height();
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
//  通过iframe的id设置高度
    $(window.parent.document).find("#"+frameId).css('height',height);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
