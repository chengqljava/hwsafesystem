$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadRate("grade"); 
	SelectOption.loadTureFalse("certificate"); 


	$("#safestandardform").validate({
		rules: {
			standardname: {
				required: true,
				rangelength:[1,25]
			},
			grade: {
				required: true
			},
			term: {
				required: true
			},
			reviewer: {
				required: true,
				rangelength:[1,25]
			},
			organizer: {
				required: true,
				rangelength:[1,25]
			},
			certificate: {
				required: true
			}
		},
		messages: {
			standardname: {
				required: "执行标准名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			grade: {
				required: "认定等级不能为空"
			},
			term: {
				required: "认定期限不能为空"
			},
			reviewer: {
				required: "评审单位不能为空",
				rangelength: "请输入1-25个字符"
			},
			organizer: {
				required: "评审组织单位不能为空",
				rangelength: "请输入1-25个字符"
			},
			certificate: {
				required: "是否颁发证书牌匾不能为空"
			}
		},
		submitHandler:function(form){
			save();
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
	
		$('#safestandardform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	standardname: {
	        		message: '执行标准名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            grade: {
	        		message: '认定等级不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            term: {
	        		message: '认定期限不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"change"
	            },
	            reviewer: {
	        		message: '评审单位不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            organizer: {
	        		message: '评审组织单位不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            certificate: {
	        		message: '是否颁发证书牌匾不能为空',
	                validators: {
	                    notEmpty: {}
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
		url : BASE_URL+'/enterprise/entsafestandard/save',
		cache : false,
		dataType : 'json',
		data : $("#safestandardform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safestandard').val("true");
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
