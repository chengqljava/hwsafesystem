$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadSex("sex");//性别
	SelectOption.loadUserType("usertype");//用户类型

	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	// 电话验证       
	jQuery.validator.addMethod("phoneCheck", function(value, element) {       
	    return this.optional(element) || /^\d{11}$/.test(value);       
	}, "请输入11个数字");
	// 身份证验证       
	jQuery.validator.addMethod("idcardCheck", function(value, element) {       
	    return this.optional(element) || /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);       
	}, "身份证输入不合法");
	
	$("#userform").validate({
		rules: {
			nickname: {
				required: true,
				rangelength:[2,20]
			},
            sex: {
            	required: true
            },
            phone: {
            	required: true,
            	phoneCheck: true
            },
            email: {
            	isEmail: true
            },
            idcard: {
            	idcardCheck: true
            },
            tel: {
            	isTelephone: true
            },
            hometel: {
            	isTelephone: true
            }
		},
		messages: {
			nickname: {
				required: "用户名不能为空",
				rangelength: "请输入2-20个字符"
			},
			sex: {
				required: "性别不能为空"
			},
            phone: {
            	required: "手机号不能为空"
            },
            email: {
            	email: "请输入有效的电子邮件地址"
            }
		},
		submitHandler:function(form){
	        $('#usertype').removeAttr("disabled"); 
		   	save();
	    }   
	});
	
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysuser/save',
		cache : false,
		dataType : 'json',
		data : $("#userform").serializeArray(),
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

