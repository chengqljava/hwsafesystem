/**
 * 详情
 */
$(function() {
	var recordid = getQueryString("recordid");

	$.ajax({
		type : "post",
		url : BASE_URL + "ems/emssucestimaterecord/display",
		dataType : "json",
		data : {
			recordid:recordid
		},
		success : function(data) {
			if (data) {
				var epideviceTpt = _.template($("#epideviceTpt").html());
				$("#epideviceForm").html(epideviceTpt(data));	
//				$("#eventid").val(eventid);
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