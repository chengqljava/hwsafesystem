
/**
 * 新增和修改生产作业活动风险信息
 */
$(function () {
	var operid = getQueryString("operid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrskoper/display/"+operid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var dssRskOperTpt = _.template($("#dssRskOperTpt").html());
				$("#dssRskOperForm").html(dssRskOperTpt(data));

				// SelectTree.loadRiskTypeTree("typename",{
				// 	userType:0,
				// 	typecode:4
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