/**
 * 展示违约欠款信息
 */
$(function () {
	var violationid = GetQueryString("violationid");

	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadviolation/display/"+violationid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var badViolationTpt = _.template($("#badViolationTpt").html());
				$("#badViolationForm").html(badViolationTpt(data));

				
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
