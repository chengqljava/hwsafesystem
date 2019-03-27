$(function() {
	
	//选择发送者
	$("#userName").off("click").on("click", function(){
		parent.openWin(BASE_URL + "/system/sysmessage/selUsername",
				"选择主办执法人员", "70%", "65%");
	});
	
	

	$("#messageAddForm").validate({
		rules: {
			content: {
				required: true,
				rangelength:[1, 500]
			},
			userName: {
				required: true
			}
		},
		messages: {
			content: {
				required: "短信内容不能为空",
				rangelength: "请输入1-500个字符"
			},
			userName: {
				required: "接收者不能为空"
			}
			
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
});

/*保存(新增)*/
function save(){
	$.ajax({
		type: "post",
		url: BASE_URL + "/system/sysmessage/saveAddMessage",
		cache: false,
		dataType: "json",
		data: $("#messageAddForm").serializeArray(),
		global: false,
		success: function(json) {
			if(json.success == true){
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


/**
 * 给所选择执法人员赋值
 * @param entInfoObj
 */
function setUserNameInfo(userObj){
		$("#userid").val(userObj.userid);
		$("#userName").val(userObj.userName);
}