$(function() {
	var exposureid = getQueryString("exposureid");
	
	//编辑市级以上曝光记录时
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecsbadexposure/edit/" + exposureid,//新增风险类型时
		data : {},
		success : function(data) {
			if (data) {
				var editRiskTypeTpt = _.template($("#editRiskTypeTpt").html());
				$("#editBadexpoForm").html(editRiskTypeTpt(data));
				//风险所属分类
			}
		}
	});
	
});

function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}