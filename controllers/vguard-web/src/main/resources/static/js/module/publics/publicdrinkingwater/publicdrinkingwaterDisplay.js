/**
 *
 */
$(function() {
	var drinkingid = getQueryString("drinkingid");

	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicdrinkingwater/display",
		dataType : "json",
		data : {
			"drinkingid":drinkingid
		},
		success : function(data) {
			if (data) {
				var drinkingwaterTpt = _.template($("#drinkingwaterTpt")
						.html());
				$("#drinkingwaterForm").html(drinkingwaterTpt(data));
                $('#trainfile').empty();
                $('#trainfile').hide();
                var attachment = data.attachmentList;//附件
                showChooseFiles('attachment', attachment, BASE_URL + 'publics/publicattachment/download/', false);
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

function checkMap(){
	window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
	window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
		$('#maptab').val(param.lineArray);
		$("#isFlag").val("1");
		$("#mapTag").empty();
		$("#mapTag").append('<a href="javascript:void(0);" onclick="checkMap()">已标注</a>');
	});
	parent.parent.openWin(BASE_URL + "/views/module/publics/common/mapTag.html?isDisplay=true",
			 "地理标注", "50%", "50%");
}