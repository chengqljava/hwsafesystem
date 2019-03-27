$(function () {
	//获取保护场所类型
	var type = GetQueryString("type");
	//获取事故信息id
	var eventid = GetQueryString("eventid");
	var placeIds = GetQueryString("placeIds");
	$.ajax({
		type : "get",
		url : BASE_URL + "ems/emssucplace/list",
		data : {
			"type":type,
			"placeIds":placeIds
		},
		success : function(data) {
			if (data) {
				$("#pernum").html("影响区域范围内大概有"+data.num+"人，这些人需要及时营救与撤离！");
			}
		},
		error : function() {
			parent.toast("网络繁忙...");
		}
	});
});
	
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

