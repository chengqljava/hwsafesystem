/**
 * 详情
 */
$(function () {
	var typeid = getQueryString("typeid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/codeemssucplacetype/display/"+typeid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var placeTypeTpt = _.template($("#placeTypeTpt").html());
				$("#placeTypeForm").html(placeTypeTpt(data));					
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
