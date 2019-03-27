$(document).ready(function() {
	showUploadFile("myfile",{allowedFileExtensions:['apk','ipa']},true);//显示文件上传控件
	SelectOption.loadIsOnLine("isonline");//是否发布
	SelectOption.loadAppType("apptype");//app类型
	
	$("#sysappversionform").validate({
		rules : {
			appname : {
				required : true
			},
			appversion : {
				isFloatGtZero:true,
				required : true
			},
			onlinetime:{
				required : true
			},
			isonline:{
				required : true
			},
			apptype : {
				required : true
			},
			filemyfile:{
				required : true
			}
		},
		messages : {
			appname : {
				required : "app名称不能为空"
			},
			appversion : {
				isFloatGtZero:"版本必须是大于0的数字",
				required : "app版本不能为空"
			},
			onlinetime : {
				required : "发布时间不能为空"
			},
			isonline : {
				required : "是否发布没有选择"
			},
			apptype : {
				required : "app类型没有选择"
			},
			filemyfile:{
				required:"文件没上传"
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
});

/** 保存 */
function save() {
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL + '/system/sysappversion/save',
		secureuri:false,
	    files : $("input[name='filemyfile']"),
		cache : false,
		dataType : 'json',
		data : $("#sysappversionform").serializeArray(),
		global : false,
		success : function(json) {
			if (json.success == true) {
				parent.toast(json.msg);// 弹出提示信息
				parent.getActiveIFrame().reloadGrid();// 刷新列表
				parent.closeWin();// 关闭弹出框
			} else {
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}