/**
 * 详细信息
 */
$(function () {
    var deviceinfoid = GetQueryString("deviceinfoid");

    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macdeviceinfo/loadDeviceInfo",
        dataType: "json",
        data: {
        	deviceinfoid: deviceinfoid
        },
        success: function (data) {
            if (data) {
                var macDeviceInfoTpt = _.template($("#macDeviceInfoTpt").html());
                $("#macDeviceInfoForm").html(macDeviceInfoTpt(data));
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
