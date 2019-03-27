/**
 * 提供虚假资料详情
 */
$(function () {
	var fakeid = getQueryString("fakeid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadfake/display/"+fakeid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var badFakeTpt = _.template($("#badFakeTpt").html());
				$("#badFakeForm").html(badFakeTpt(data));
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
