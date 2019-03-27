$(document).ready(function () {
	var eventid = GetQueryString("eventid");
	//获取事故信息
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucevent/load/"+eventid,
		data : {},
		success : function(data) {
			if (data) {
				$("#content").html("<font size='2'>&nbsp;&nbsp;&nbsp;&nbsp;"
						+getSmpFormatDateByLong(data.event.time,true)+
						"在"+data.event.address+"发生"
						+data.event.eventname+"。事因"+
						data.event.reason+"，事故信息已上报。</font>");
				$("#casualty").html("<font size='2'>&nbsp;&nbsp;&nbsp;&nbsp;伤亡情况："+data.event.casualty+"</font>");
			}
		}
	});
						
});
/**
 * 获取参数
 * @param name
 * @returns
 */
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}