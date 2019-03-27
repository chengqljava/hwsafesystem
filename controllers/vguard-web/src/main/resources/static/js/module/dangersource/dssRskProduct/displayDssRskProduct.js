/**
 * 新增和修改生产作业活动风险信息
 */
$(function () {
	var productid = GetQueryString("productid");
	
	
	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskproduct/display/"+productid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var prodActTpt = _.template($("#prodActTpt").html());
				$("#prodActForm").html(prodActTpt(data));
				
				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:6
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
