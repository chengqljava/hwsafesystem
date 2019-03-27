$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadSex("sex"); // 性别
	 //初始化特种作业岗位下拉树
	SelectTree.loadSpecialPositionSelect("positionname");

	$("#entoperatorform").validate({
		rules: {
			operatorname: {
				required: true,
				rangelength:[1,25]
			},
			sex: {
				required: true
			},
			positionname: {
				required: true
			},
			certificatename: {
				required: true,
				rangelength:[1,25]
			},
			certificatecode: {
				required: true,
				rangelength:[1,25]
			},
			issuingauthority: {
				required: true,
				rangelength:[1,25]
			},
			issuingdate: {
				required: true
			},
			validityperiod: {
				required: true
			}
		},
		messages: {
			operatorname: {
				required: "姓名不能为空",
				rangelength: "请输入1-25个字符"
			},
			sex: {
				required: "性别不能为空"
			},
			positionname: {
				required: "特种作业岗位不能为空"
			},
			certificatename: {
				required: "操作证名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			certificatecode: {
				required: "证书编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			issuingauthority: {
				required: "发证机关不能为空",
				rangelength: "请输入1-25个字符"
			},
			issuingdate: {
				required: "发证时间不能为空"
			},
			validityperiod: {
				required: "证书有效期不能为空"
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
	
		$('#entoperatorform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	operatorname: {
	        		message: '姓名不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            sex: {
	        		message: '性别不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            positionname: {
	        		message: '特种作业岗位不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            certificatename: {
	        		message: '操作证名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            certificatecode: {
	        		message: '证书编号不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            issuingauthority: {
	        		message: '发证机关不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            issuingdate: {
	        		message: '发证时间不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"change"
	            },
	            validityperiod: {
	        		message: '证书有效期不能为空',
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
		url : BASE_URL+'/enterprise/entoperator/save',
		cache : false,
		dataType : 'json',
		data : $("#entoperatorform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_operator').val("true");
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
