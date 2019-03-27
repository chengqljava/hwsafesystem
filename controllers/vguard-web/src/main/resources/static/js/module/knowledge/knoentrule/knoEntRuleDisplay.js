/**
 * 新增编辑
 */
$(function() {
	var entruleid = getQueryString("entruleid");
	$.ajax({
		type : "post",
		url : BASE_URL + "knowledge/knoentrule/load",
		dataType : "json",
		data : {
			"entruleid":entruleid
		},
		success : function(data) {
			if (data) {
				var entruleTpt = _.template($("#entruleTpt").html());
				$("#entruleForm").html(entruleTpt(data));
				var knoAttachList = data.knoAttachList;
				showChooseFiles('attachment', knoAttachList, BASE_URL + 'knowledge/knolaw/download/', false);
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