/**
 * 设备维修
 */
$(function() {
	var maintainid = getQueryString("maintainid");

	$.ajax({
		type : "post",
		url : BASE_URL + "monitor/macmaintan/load",
		dataType : "json",
		data : {
			"maintainid":maintainid
		},
		success : function(data) {
			if (data) {
//				console.log(data);
				var macmaintanTpt = _.template($("#macmaintanTpt")
						.html());
				$("#macmaintanForm").html(macmaintanTpt(data));
				
//				SelectOption.loadEquipmenttype("equipmenttype");
//				SelectOption.loadMaintiantype("maintiantype");
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
