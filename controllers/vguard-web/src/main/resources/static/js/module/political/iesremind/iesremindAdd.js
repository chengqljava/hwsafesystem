$(document).ready(function() {

	$("#knocaseform").validate({
		rules: {
			title: {
				required: true
			},
			dopeople: {
				required: true
			},
			time: {
				required: true
			},
		},
		messages: {
			title: {
				required: "标题不能为空"
			},
			dopeople: {
				required: "待办人不能为空"
			},
			time: {
				required: "时间不能为空"
			},
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
		url : BASE_URL+'/political/iesremind/save',
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

