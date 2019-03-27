/**
 *
 */
$(function() {
	var eid = getQueryString("eid");
	$.ajax({
		type : "post",
		url : BASE_URL + "publics/publicenvironmental/display",
		dataType : "json",
		data : {
			"eid":eid
		},
		success : function(data) {
			if (data) {
				console.log(data);
				var drinkingwaterTpt = _.template($("#drinkingwaterTpt")
						.html());
				$("#drinkingwaterForm").html(drinkingwaterTpt(data));
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
