$(document).ready(function() {
	
	//办理人员
	SelectOption.loadSysUser("principalcode",{"jobtype": $('#jobtype').val()});
	
	$("#docsubmitform").validate({
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
			$('#principal').val($("#principalcode option:selected").text());
		   	save();
	    }   
	});
});


/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawtownsubmit/save',
		cache : false,
		dataType : 'json',
		data : $("#docsubmitform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.$("#checkendBtn").hide();
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


