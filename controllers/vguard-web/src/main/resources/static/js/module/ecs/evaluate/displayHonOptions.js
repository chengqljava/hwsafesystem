$(document).ready(function() {
	//查询
	$.ajax({
		type : "post",
		url : BASE_URL + "ecs/ecshonoption/load/" + GetQueryString("optionid"),
		data : {},
		success : function(data) {
			if (data) {
				var ecsHonOptionsTpt = _.template($("#ecsHonOptionsTpt").html());
				$("#ecsHonOptionsForm").html(ecsHonOptionsTpt(data));
			}
		}
	});
});

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
