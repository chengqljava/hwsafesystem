$(document).ready(function() {

	$("#emsSucDispatchform").validate({
		rules : {
			distitle : {
				required : true,
			},
			discontent : {
				required : true
			},
			distime : {
				required : true
			}
		},
		messages : {
			distitle : {
				required : "标题不能为空"
			},
			discontent : {
				required : "调度内容不能为空"
			},
			distime : {
				required : "调度时间不能为空"
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
		url : BASE_URL+'/ems/emssucdispatch/save',
		secureuri:false,
		cache : false,
		dataType : 'json',
		data : $("#emsSucDispatchform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				//弹出提示信息
				parent.toast(json.msg);
				//刷新事件列表
				//parent.showdispatch($("#eventid").val());
				//var index = parent.getParentIndex();
				//parent.frames["layui-layer-iframe"+index].showdispatch($("#eventid").val());//刷新父列表（应急人员列表）
				parent.getActiveIFrame().showdispatch($("#eventid").val());//重新加载
				// 关闭弹出框
				parent.closeWin();
			}else{
				parent.toast(json.msg);
				$('#emsSucDispatchform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}
