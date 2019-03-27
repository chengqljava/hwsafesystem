$(document).ready(function() {

	$("#safepunishform").validate({
		rules: {
			punishitem: {
				required: true,
				rangelength:[1,25]
			},
			punishcontent: {
				required: true,
				rangelength:[1,100]
			},
			enforcer: {
				required: true,
				rangelength:[1,25]
			},
			punishresult: {
				required: true,
				rangelength:[1,100]
			},
			punishtime: {
				required: true
			}
		},
		messages: {
			punishitem: {
				required: "处罚事项不能为空",
				rangelength: "请输入1-25个字符"
			},
			punishcontent: {
				required: "处罚内容不能为空",
				rangelength: "请输入1-100个字符"
			},
			enforcer: {
				required: "执法主体不能为空",
				rangelength: "请输入1-25个字符"
			},
			punishresult: {
				required: "执行结果不能为空",
				rangelength: "请输入1-100个字符"
			},
			punishtime: {
				required: "处罚时间不能为空"
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
	
		$('#safepunishform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	punishitem: {
	        		message: '处罚事项不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            punishcontent: {
	        		message: '处罚内容不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 100
	                    }
	                }
	            },
	            enforcer: {
	        		message: '执法主体不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            punishresult: {
	        		message: '执行结果不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 100
	                    }
	                }
	            },
	            punishtime: {
	        		message: '处罚时间不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"change"
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
		url : BASE_URL+'/enterprise/entsafepunish/save',
		cache : false,
		dataType : 'json',
		data : $("#safepunishform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safepunish').val("true");
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
