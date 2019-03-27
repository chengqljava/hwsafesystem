/**
 * 详情
 */
$(function () {
    var entorgid = getQueryString("entorgid");
    $.ajax({
        type : "post",
        url : BASE_URL + "enterprise/entorg/load",
        dataType: "json",
        data:{
            entorgid:entorgid
        },
        success : function(data) {
            if (data) {
                var entOrgTpt = _.template($("#entOrgTpt").html());
                $("#entOrgForm").html(entOrgTpt(data));
            }
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });

});
function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
