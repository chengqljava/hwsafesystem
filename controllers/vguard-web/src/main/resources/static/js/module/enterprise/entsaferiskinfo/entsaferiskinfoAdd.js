$(document).ready(function() {

	$("#saferiskinfoform").validate({
		rules: {
			infoname: {
				required: true,
				rangelength:[1,25]
			},
			infotype: {
				required: true,
				rangelength:[1,250]
			},
			measure: {
				required: true,
				rangelength:[1,500]
			}
		},
		messages: {
			infoname: {
				required: "安全风险较大作业名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			infotype: {
				required: "存在的风险或可能引发的事故类型不能为空",
				rangelength: "请输入1-250个字符"
			},
			measure: {
				required: "安全防范措施不能为空",
				rangelength: "请输入1-500个字符"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	/**
		$('#saferiskinfoform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	infoname: {
	        		message: '安全风险较大作业名称',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            infotype: {
	        		message: '存在的风险或可能引发的事故类型不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 250
	                    }
	                }
	            },
	            measure: {
	        		message: '安全防范措施不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 500
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
		url : BASE_URL+'/enterprise/entsaferiskinfo/save',
		cache : false,
		dataType : 'json',
		data : $("#saferiskinfoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_saferiskinfo').val("true");
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
