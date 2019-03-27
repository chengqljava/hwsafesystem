/**
 * 详情
 */
$(function () {

    var entorgid = getQueryString("entorgid");
    $.ajax({
        type : "post",
        url : BASE_URL + "enterprise/entcontacts/loadContactList",
        dataType: "json",
        data:{
            entorgid:entorgid
        },
        success : function(data) {
            if (data) {
                var entAddressListInfoTpt = _.template($("#entAddressListInfoTpt").html());
                $("#entAddressListInfoForm").html(entAddressListInfoTpt(data));
            }
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });
});


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
