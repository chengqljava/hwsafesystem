$(document).ready(function() {
	
	$("#safeorgform").validate({
		rules: {
			safeorgname: {
				required: true,
				rangelength:[1,25]
			},
			duty: {
				required: true,
				rangelength:[1,25]
			},
			head: {
				required: true,
				rangelength:[1,25]
			},
			job: {
				required: true,
				rangelength:[1,25]
			},
			phone: {
				required: true,
				isPhone: true
			},
			email: {
				isEmail: true
			},
			member: {
				required: true,
				rangelength:[1,100]
			}
		},
		messages: {
			safeorgname: {
				required: "机构名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			duty: {
				required: "职责不能为空",
				rangelength: "请输入1-25个字符"
			},
			head: {
				required: "机构负责人不能为空",
				rangelength: "请输入1-25个字符"
			},
			job: {
				required: "职务不能为空",
				rangelength: "请输入1-25个字符"
			},
			phone: {
				required: "手机不能为空"
			},
			email: {
				isEmail: "请输入有效的电子邮件地址"
			},
			member: {
				required: "成员不能为空",
				rangelength: "请输入1-100个字符"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	/**
		$('#safeorgform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	safeorgname: {
	        		message: '机构名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            duty: {
	        		message: '职责不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            head: {
	        		message: '机构负责人不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            job: {
	        		message: '职务不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            phone: {
	        		message: '手机不能为空',
	                validators: {
	                    notEmpty: {},
	                    regexp: {
	                        regexp: /^\d{11}$/,
	                        message:"请输入 11 个数字"
	                    }
	                }
	            },
	            email: {
	                validators: {
	                	regexp: {
	                		  regexp: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
		                      message:"请输入有效的电子邮件地址"
	                    }
	                }
	            },
	            member: {
	        		message: '成员不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 100
	                    }
	                }
	            }
	        }
		}) 
		.on('success.form.fv', function(e) {
		   	 e.preventDefault();
		   	 save();
		});
		*/
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entsafeorg/save',
		cache : false,
		dataType : 'json',
		data : $("#safeorgform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safeorg').val("true");
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
				//parent.frames["layui-layer-iframe"+index].location.reload();
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
