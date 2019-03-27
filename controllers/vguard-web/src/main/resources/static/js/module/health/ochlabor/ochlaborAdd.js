$(document).ready(function() {
	
	// 有效期要大于生产日期
	jQuery.validator.addMethod("validityGTmanufacturedate", function(value, element) {  
		var bool = true;
		var validity =  new Date($("#validity").val());
		var manufacturedate = new Date($("#manufacturedate").val());
		if(validity != null && manufacturedate != null){
			if(validity <= manufacturedate){
				bool = false;
			}
		}
		return bool;
	}, "有效期要大于生产日期");
	
	$("#laborform").validate({
		rules : {
			laborname : {
				required : true
			},
			productionno : {
				required : true,
				isLetterAndNumAndUnderline : true//只能包含字母、数字、下划线。
			},
			manufacturer : {
				required : true
			},
			manufacturedate : {
				required : true,
				validityGTmanufacturedate : true
			},
			validity : {
				required : true,
				validityGTmanufacturedate : true
			},
			securityno : {
				required : true,
				isLetterAndNumAndUnderline : true
			},
			num : {
				required : true,
				isDigitsNonzero : true
			}
		},
		messages : {
			laborname : {
				required : "用品名称不能为空"
			},
			productionno : {
				required : "生产许可证号不能为空"
			},
			manufacturer : {
				required : "生产厂家不能为空"
			},
			manufacturedate : {
				required : "生产日期不能为空"
			},
			validity : {
				required : "有效期不能为空"
			},
			securityno : {
				required : "安检证号不能为空"
			},
			num : {
				required : "数量不能为空"
			}
		},
		submitHandler : function(form) {
			save();
		}
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/health/ochlabor/save',
		secureuri:false,
		cache : false,
		dataType : 'json',
		data : $("#laborform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				//弹出提示信息
				parent.toast(json.msg);
				//刷新列表
				parent.getActiveIFrame().reloadGrid();//重新加载
				// 关闭弹出框
				parent.closeWin();
			}else{
				parent.toast(json.msg);
				$('#laborform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
