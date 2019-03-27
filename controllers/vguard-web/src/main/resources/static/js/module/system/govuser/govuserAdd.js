$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadSex("sex");//性别
	SelectOption.loadUserType("usertype");//用户类型
	 //初始化机构下拉树
	SelectTree.loadOrgByOrgidSelect("organname",{"orgid":$('#orgid').val()},null,
			function(treeNode){
		if(treeNode.tId){
			if(treeNode.id != null){
				$('#departname').removeAttr("disabled"); 
				SelectTree.loadDepartSelect("departname",{"orgid":$('#organname').attr('selectvalue')});
			}
		}
	});
	
	//初始化部门下拉树
	//SelectTree.loadDepartSelect("departname",{"orgid":$('#organname').attr('selectvalue')});

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
			username: {
				required: true,
				rangelength:[1,100],
				stringCheck:true,
				remote:{
				    url: BASE_URL+"/system/sysuser/existsUser",     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	username: function(){
							return $("#username").val();
						}
				    }
				}
			},
			nickname: {
				required: true,
				rangelength:[2,20]
			},
			password: {
				required: true,
				stringCheck:true,
				rangelength:[6,16]
            },
            organname: {
            	required: true
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
            	isTelephone:true
            },
            hometel: {
            	isTelephone:true
            },
            jobtype: {
            	required: true
            },
            execcode: {
            	required: true
            }
		},
		messages: {
			username: {
				required: "账号不能为空",
				rangelength: "请输入1-100个字符",
				remote: "账号已存在!"
			},
			nickname: {
				required: "用户名不能为空",
				rangelength: "请输入2-20个字符"
			},
			password: {
				required: "密码不能为空",
				rangelength: "请输入6-16个字符"
			},
			organname: {
            	required: "机构不能为空"
            },
			sex: {
				required: "性别不能为空"
			},
            phone: {
            	required: "手机号不能为空"
            },
            jobtype: {
            	required: "职务类型不能为空"
            },
            execcode: {
            	required: "执法证号不能为空"
            }
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
	         var eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       }else if(element.is(':file')){
	    	 eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       }else {
	         error.insertAfter(element);
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
		url : BASE_URL+'/system/govuser/save',
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

