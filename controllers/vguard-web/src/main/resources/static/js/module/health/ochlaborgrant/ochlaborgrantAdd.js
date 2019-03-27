$(document).ready(function() {
	// 发放数量不能大于剩余数量
	jQuery.validator.addMethod("validatorResidue", function(value, element) {  
		var bool = true;
		var residue = $("#residue").val();
		if(parseInt(value) > parseInt(residue)){
			bool = false;
		}
		return bool;
	}, "发放数量不能大于剩余数量");
	$("#laborgrantform").validate({
		rules : {
			grantname : {
				required : true
			},
			granttime : {
				required : true
			},
			num : {
				required : true,
				isDigitsNonzero : true,
				validatorResidue : true
			},
			recipient : {
				required : true
			}
		},
		messages : {
			grantname : {
				required : "发放人不能为空"
			},
			granttime : {
				required : "发放时间不能为空"
			},
			num : {
				required : "发放数量不能为空"
			},
			recipient : {
				required : "收件人不能为空"
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
		url : BASE_URL+'/health/ochlaborgrant/save',
		secureuri:false,
		cache : false,
		dataType : 'json',
		data : $("#laborgrantform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				//弹出提示信息
				parent.toast(json.msg);
				//刷新列表
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新用品发放列表
				parent.getActiveIFrame().reloadGrid();//刷新用品登记信息
				// 关闭弹出框
				parent.closeWin();
			}else{
				parent.toast(json.msg);
				$('#laborgrantform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
