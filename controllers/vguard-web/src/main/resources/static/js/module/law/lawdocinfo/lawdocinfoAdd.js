$(document).ready(function() {
	SelectOption.loadTureFalse("isreceipt");
	
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	/**数字验证*/
	jQuery.validator.addMethod("num", function(value, element) {
		var num = /^([0-9]+)$/;
		return this.optional(element) || (num.test(value));
		}, "只能输入数字(0-9)");
	
	$("#docinfoform").validate({
		rules: {
			doccode: {
				stringCheck: true
			},
			docname: {
				required: true
			},
			ordernum: {
				num : true
			}
		},
		messages: {
			docname: {
				required: "文书名称不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
});

function sda(){
	$('#doccontent').val($('#condiv').html());
}

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawdocinfo/save',
		cache : false,
		dataType : 'json',
		data : $("#docinfoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
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


