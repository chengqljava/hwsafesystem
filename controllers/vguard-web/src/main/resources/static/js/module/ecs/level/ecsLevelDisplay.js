/**
 *  诚信等级详情
 */
$(function () {
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecslevel/display/"+ GetQueryString("levelid"),
		dataType: "json",
		success : function(data) {
			if (data) {
				var badOtherTpt = _.template($("#badOtherTpt").html());
				$("#badOtherForm").html(badOtherTpt(data));
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
	
});
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
