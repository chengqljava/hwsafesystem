/**
 * 展示工艺过程风险信息
 */
$(function () {
	var techid = GetQueryString("techid");
	
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrsktech/display/"+techid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var techTpt = _.template($("#techTpt").html());
				$("#techForm").html(techTpt(data));
				
				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:3
				// },"");
				
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
