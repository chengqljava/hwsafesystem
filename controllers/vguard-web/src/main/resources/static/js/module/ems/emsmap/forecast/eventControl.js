$(function() {
	// 获取综合预测id
	var forecastid = getQueryString("forecastid");
	var textArea = parent.textArea;
	console.log(111);
	// 获取事故信息id
	var eventid = getQueryString("eventid");
	if (forecastid != '0' && typeof(forecastid) !='undefined' && forecastid != null && forecastid != 'null') {
		/* 读取 */
		$.ajax({
			type : "post",
			url : BASE_URL + "ems/emssucigrforecast/load",
			dataType : "json",
			data : {
				forecastid : forecastid,
				eventid : eventid
			},
			success : function(data) {
				if (data) {
					var text = data.eventcontrol;
					document.getElementById("eventcontrol").value = text;
					if (data.forecastid != "") {
						$("#eventcontrol").attr("readonly", "readonly");// 设为只读
						$("#eventcontrol").addClass("margin-top","5px");
//						$("#eventcontrol").removeAttr("readonly");    //去除readonly属性

					} else {
						$("#eventcontrol").before(
								"<div>还可以输入<span id='word'>1000</span>个字</div>");		
//						$("#eventcontrol").val("").focus();
					}
				}
			},
			error : function() {
				parent.toast("初始化信息加载失败");
			}
		});
	}else{
		$("#eventcontrol").before(
				"<div style='margin-bottom: 3px;float: right;'>还可以输入<span id='word'>"+(1000 -textArea.length) +"</span>个字<div>");
		$("#eventcontrol").text(textArea);
	}
});

function wordsDeal() {
	var curLength = $("#eventcontrol").val().length;
	if (curLength > 1000) {
		console.log("超过字数限制");
	} else {
		$("#word").text(1000 - $("#eventcontrol").val().length);
	}
}
function getText(){
	var text = $("#eventcontrol").val();
	parent.textArea = text;
}


function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
