$(function() {
	//当前所选企业id
	var entId = getQueryString("entId");
	
	
	
	
	
	
	
	
	
	
	
	
	//获取事故信息
//	$.ajax({
//		type : "post",
//		url : BASE_URL + "ems/emssucevent/load/"+eventid,
//		data : {},
//		success : function(data) {
//			if (data) {}
//		}
//	});
});
/**
 * 获取参数
 * @param name
 * @returns
 */
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}