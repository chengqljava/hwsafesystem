/**
 * 展示维修作业活动风险信息
 */
$(function () {
	var repairid = GetQueryString("repairid");
	
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskrepair/display/"+repairid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var repairTpt = _.template($("#repairTpt").html());
				$("#repairForm").html(repairTpt(data));
				
				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:1
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
