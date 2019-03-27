
/**
 * 新增和修改生产作业活动风险信息
 */
$(function () {
	var placeid = getQueryString("placeid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskplace/display/"+placeid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var dssRskPlaceTpt = _.template($("#dssRskPlaceTpt").html());
				$("#dssRskPlaceForm").html(dssRskPlaceTpt(data));
				//
				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:5
				// },"");
				
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
