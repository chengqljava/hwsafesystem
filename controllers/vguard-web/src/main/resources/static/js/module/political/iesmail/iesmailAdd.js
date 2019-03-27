$(document).ready(function() {
	$("#knosafeform").validate({
		rules: {
			title:{
				required: true
			},
			sender:{
				required: true
			},
			sendernu:{
				required: true,
				 email: true
			},
			receiver:{
				required: true
			},
			receivenu:{
				required: true,
				 email: true
			}
		},
		messages: {
			title:{
				required: "名称不能为空",
				rangelength: "请输入1-60个字符"
					
			},
			sender:{
				required: "发送人不能为空"
			},
			sendernu:{
				required: "发送人邮箱不能为空",
				email: "请输入一个正确的邮箱"
			},
			receiver:{
				required: "接收人"
			},
			receivenu:{
				required: "接收人邮箱不能为空",
				email: "请输入一个正确的邮箱"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});


/**保存*/
function save(){
	
	var formData = $("#knosafeform").serializeArray();
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/political/iesmail/save',
		cache : false,
		dataType : 'json',
		data : $("#knosafeform").serializeArray(),
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