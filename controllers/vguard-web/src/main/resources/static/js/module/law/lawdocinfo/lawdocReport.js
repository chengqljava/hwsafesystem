$(document).ready(function() {
	
	//办理人员
	SelectOption.loadSysUser("username",{"jobtype": $('#jobtype').val()});
	
	$("#docreportform").validate({
		rules: {
			username: {
				required: true
			}
		},
		messages: {
			username: {
				required: "办理人员不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
});


/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/save',
		cache : false,
		dataType : 'json',
		data : $("#docreportform").serializeArray(),
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


