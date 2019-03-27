$(function() {
	$("#hiddendangerForm").validate({
		rules : {
			hiddendangertype : {
				required : true
			}
		},
		messages : {
			hiddendangertype : {
				required : "请选择"
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
	SelectOption.loadDangerCon("hiddendangertype");// 隐患来源
});
// 保存
function save() {
	var fomData = $("#hiddendangerForm").serializeArray();
	fomData.push({
		'name' : 'dangerIds',
		value : getQueryString('dangerIds')
	});
	$.ajax({
		type : 'post',
		url : BASE_URL + 'hidden/hidhiddendanger/hanDanger',
		cache : false,
		dataType : 'json',
		data : fomData,
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);
				// 刷新列表
				parent.getActiveIFrame().reloadGrid();
				// 关闭弹出框
				parent.closeWin();
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}