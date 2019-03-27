/**
 * 展示投诉并立案事件信息
 */
$(function () {
	var caseid = GetQueryString("caseid");

	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadcase/display/"+caseid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var badCaseTpt = _.template($("#badCaseTpt").html());
				$("#badCaseForm").html(badCaseTpt(data));

				
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
