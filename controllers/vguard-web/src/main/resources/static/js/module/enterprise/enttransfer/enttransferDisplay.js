/**
 * 详情
 */
$(function () {
	var changeid = getQueryString("changeid");	
	$.ajax({
		type : "post",
		url : BASE_URL + "enterprise/enttransfer/display/"+changeid,
		dataType: "json",
		data:{
			
		},
		success : function(data) {
			if (data) {
				var enttransferTpt = _.template($("#enttransferTpt").html());
				$("#enttransferForm").html(enttransferTpt(data));									
				SelectOption.loadChangeState("changestate");//交接状态下拉选	
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
