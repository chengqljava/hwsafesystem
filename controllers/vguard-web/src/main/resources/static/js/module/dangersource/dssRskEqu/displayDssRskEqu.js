/**
 * 展示设备设施风险信息
 */
$(function () {
	var equid = GetQueryString("equid");

	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskequ/display/"+equid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var equTpt = _.template($("#equTpt").html());
				$("#equForm").html(equTpt(data));
				
				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:2
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
