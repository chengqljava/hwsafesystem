$(function() {
	var eventid = getQueryString("eventid");
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/eventcourse/loadEventInfo",
		dataType : "json",
		data : {
			eventid : eventid
		},
		success : function(data) {
			$("#entname").attr("title",data.eventname);
			$("#eventtime").attr("title",getSmpFormatDateByLong(data.time, false));
			$("#eventlevel").attr("title",SelectOption.getAcclevel(data.eventlevel));
			$("#eventaddress").attr("title",data.address);
			$("#eventreson").attr("title",data.reason);
			$("#eventcontent").attr("title",data.content);
			$("#eventcasualty").attr("title",data.casualty);
			
			$("#entname").html(data.eventname);
			$("#eventtime").html(getSmpFormatDateByLong(data.time, false));
			$("#eventlevel").html(SelectOption.getAcclevel(data.eventlevel));
			$("#eventaddress").html(data.address);
			$("#eventreson").html(data.reason);
			$("#eventcontent").html(data.content);
			$("#eventcasualty").html(data.casualty);
			
			var yjyaList = data.planList;
			if (yjyaList.length > 0) {
				$.each(yjyaList,function(index,plan){
					$("#yjyaInfo").append("<tr>" +
							"<td title='"+plan.PLANNO+"'>"+plan.PLANNO+"</td>" +
							"<td title='"+plan.PLANNAME+"'>"+plan.PLANNAME+"</td>" +
							"<td title='"+plan.UNITNAME+"'>"+plan.UNITNAME+"</td>" +
							"<td title='"+plan.DISTRICTNAME+"'>"+plan.DISTRICTNAME+"</td>" +
							"<td title='"+SelectOption.getEmsPlanType(plan.PLANTYPE)+"'>"+SelectOption.getEmsPlanType(plan.PLANTYPE)+"</td>" +
					"</tr>");
				});
			}
			
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
});

/**
 * 获取当前url访问路径后缀参数值
 * 
 * @param name
 * @returns
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}