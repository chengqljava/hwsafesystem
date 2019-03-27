/**
 * 监测报警
 */
$(function() {
	var alarmmonitorid = getQueryString("alarmmonitorid");

	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macalarmmonitor/load/"+alarmmonitorid,
		dataType : "json",
		data : {},
		success : function(data) {
			if (data) {
				console.log(data);
				var alarmMonitorTpt = _.template($("#alarmMonitorTpt").html());
				$("#alarmMonitorForm").html(alarmMonitorTpt(data));
			}
		},
		error : function() {
			parent.toast("加载失败");
		}
	});

});

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
