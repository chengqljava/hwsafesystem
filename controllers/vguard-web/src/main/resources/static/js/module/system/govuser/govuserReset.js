$(document).ready(function() {
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	
	$("#userform").validate({
		rules: {
			password1: {
				required: true,
				rangelength:[1,100],
				stringCheck:true,
				remote:{
				    url: BASE_URL+'/system/sysuser/existsPassword',     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	password: function(){
							return $("#password").val();
						},
						username: function(){
							return $("#username").val()
						},
						password1: function(){
							return $("#password1").val()
						}
				    }
				}
			},
			password2: {
				required: true,
				rangelength:[6,16],
				stringCheck: true
			},
			password3: {
				required: true,
				stringCheck:true,
				rangelength:[6,16]
            }
		},
		messages: {
			password1: {
				required: "当前密码不能为空",
				remote: "当前密码错误!"
			},
			password2: {
				required: "新密码不能为空",
				rangelength: "请输入6-16个字符"
			},
			password3: {
				required: "确认新密码不能为空",
				rangelength: "请输入6-16个字符"
			}
		},
		submitHandler:function(form){
			var password2 = $("#password2").val();
		   	var password3 = $("#password3").val();
		    var password1 = $("#password1").val();
		   	if(password1 == password2){
		 		parent.toast("新密码和当前密码相同,请重新录入！");
		 		return;
		   	}
		   	if(password2 != password3){
		 		parent.toast("新密码和确认新密码不一致！");
		 		return;
		   	}
		    $("#password").val(password2);
		   	save();
	    }   
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/govuser/setPwd',
		cache : false,
		dataType : 'json',
		data : $("#userform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
//				parent.getActiveIFrame().reloadGrid();//重新加载
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

