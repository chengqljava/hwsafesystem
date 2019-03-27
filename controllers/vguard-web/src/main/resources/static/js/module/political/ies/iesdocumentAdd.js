$(document).ready(function() {

	SelectOption.loadDense("dense");
	var isDisplay = $("#isDisplay").val();
	if (isDisplay) {
		showUploadFile("fileUploadDiv", 'file', true, false);// 显示文件上传控件
	} else {
		showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
	}
	
	$("#knocaseform").validate({
		rules: {
			title: {
				required: true
			},
			dense: {
				required: true
			},
			receunit: {
				required: true
			},
			sendunit: {
				required: true
			},
			sendtime: {
				required: true
			},
		},
		messages: {
			title: {
				required: "标题不能为空"
			},
			dense: {
				required: "密级不能为空"
			},
			receunit: {
				required: "接收单位不能为空"
			},
			sendunit: {
				required: "发送单位不能为空"
			},
			sendtime: {
				required: "发送时间不能为空"
			},
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**保存*/
function save(){
	
	var uplist = $("input[name^=file]");
	var arrId = [];
	for (var i = 0; i < uplist.length; i++) {
		if (uplist[i].value) {
			arrId[i] = uplist[i].id;
		}
	}
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/political/iesdocument/save',
		secureuri : false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#knocaseform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

