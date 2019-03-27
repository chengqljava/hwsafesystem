$(document).ready(function() {

	$("#taskform").validate({
		rules: {
			deptname: {
				required: true
			}
		},
		messages: {
			deptname: {
				required: "部门名称不能为空"
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
		url : BASE_URL+'/law/lawmydoc/router',
		cache : false,
		dataType : 'json',
		data : $("#taskform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				//parent.toast(json.msg);
				parent.layer.alert(json.msg);
			}
		},
		error : function() {
			parent.toast("转交失败");
		}
	});
}

