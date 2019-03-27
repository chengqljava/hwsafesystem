$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadEmsPlanType("templatetype"); //模板类型
	SelectOption.loadExpertLevel("templatelevel"); //适用级别

	$("#emsPlaTemplateform").validate({
		rules : {
			templatenum : {
				required : true,
				isLetterAndNum : true
			},
			templatename : {
				required : true
			},
			templatetype : {
				required : true
			},
			templatelevel : {
				required : true
			},
			releasetime : {
				required : true
			}
		},
		messages : {
			templatenum : {
				required : "模板编号不能为空"
			},
			templatename : {
				required : "模板名称不能为空"
			},
			templatetype : {
				required : "模板类型不能为空"
			},
			templatelevel : {
				required : "适用级别不能为空"
			},
			releasetime : {
				required : "发布时间不能为空"
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
		url : BASE_URL+'/ems/emsplatemplate/save',
		secureuri:false,
		cache : false,
		dataType : 'json',
		data : $("#emsPlaTemplateform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);
				//弹出提示信息
				parent.getActiveIFrame().reloadGrid();
				//刷新列表
				parent.closeWin();
				// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#emsPlaTemplateform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
