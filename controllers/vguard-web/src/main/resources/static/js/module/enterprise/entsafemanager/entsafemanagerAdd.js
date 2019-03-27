$(document).ready(function() {

	//初始化下拉框
	SelectOption.loadFullTimePartTime("fulltimeorparttime"); // 专职兼职
	SelectOption.loadSafeManagerType("persontype"); // 人员类型
	
	$("#safemanagerform").validate({
		rules: {
			fulltimeorparttime: {
				required: true
			},
			persontype: {
				required: true
			},
			duty: {
				required: true,
				rangelength:[1,25]
			},
			personname: {
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
			}
		},
		messages: {
			fulltimeorparttime: {
				required: "专职兼职不能为空"
			},
			persontype: {
				required: "人员类型不能为空"
			},
			duty: {
				required: "职责不能为空",
				rangelength: "请输入1-25个字符"
			},
			personname: {
				required: "姓名不能为空",
				rangelength: "请输入1-25个字符"
			},
			job: {
				required: "职务不能为空",
				rangelength: "请输入1-25个字符"
			},
			phone: {
				required: "手机不能为空"
			}
		},
		submitHandler:function(form){
			if(checkDate()){
				save();
			}else{
				parent.toast("证书有效期应大于证书发证时间，请重新输入！");
			}
	    }   
	});
	
	/**
	$('.form_datetime').datetimepicker({
        language: 'zh_CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        format: 'yyyy-mm-dd'
    });
	
		$('#safemanagerform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	fulltimeorparttime: {
	        		message: '专职兼职不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            persontype: {
	        		message: '人员类型不能为空',
	                validators: {
	                    notEmpty: {}
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
	            personname: {
	        		message: '姓名不能为空',
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
		url : BASE_URL+'/enterprise/entsafemanager/save',
		cache : false,
		dataType : 'json',
		data : $("#safemanagerform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safemanager').val("true");
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
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
 * 检查证书有效期是否大于发证时间
 * @returns {Boolean}
 */
function checkDate(){
	var issuingdate = $("#issuingdate").val();
	var validityperiod = $("#validityperiod").val();
	if(validityperiod && issuingdate){
		if(issuingdate>=validityperiod){
			return false;
		}
	}
	return true;
}
