$(function() {
	var curSelId = decodeURI(getQueryString("curSelId"));
	
	//编辑风险类型时
	$.ajax({
		type : "post",
		url : BASE_URL + "dangersource/dssrsktype/display/" + curSelId,//新增风险类型时
		data : {},
		success : function(data) {
			if (data) {
				var editRiskTypeTpt = _.template($("#editRiskTypeTpt").html());
				$("#editRiskTypeForm").html(editRiskTypeTpt(data));
				
				//风险所属分类
				SelectOption.loadRiskBelongcate("belongcate");
			}
		}
	});
});

function getQueryString(name) {
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}