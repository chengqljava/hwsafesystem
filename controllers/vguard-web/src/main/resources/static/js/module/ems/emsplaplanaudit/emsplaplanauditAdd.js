$(document).ready(function() {

	SelectOption.loadEmsPlanAuditResult("auditresult");
	
	$("#auditform").validate({
		rules: {
			auditresult: {
				required: true
			},
			auditcontent: {
				required: true
			}
		},
		messages: {
			auditresult: {
				required: "审核结果不能为空"
			},
			auditcontent: {
				required: "审核意见不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplaplanaudit/save',
		cache : false,
		dataType : 'json',
		data : $("#auditform").serializeArray(),
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

