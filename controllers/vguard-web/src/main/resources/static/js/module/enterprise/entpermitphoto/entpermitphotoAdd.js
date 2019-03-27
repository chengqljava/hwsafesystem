$(document).ready(function() {
	 //初始化许可证类型下拉树
	SelectTree.loadPermitTypeSelect("permittypename");	
	showUploadFile("fileUploadDiv",'image',true);//显示文件上传控件
	//是否无限期
	var isvalid = $('#valid').val();
	if(isvalid == 0 && isvalid != null && isvalid != ""){//如果isvalid为空字符串 和0比较结果为 true
		$('#validityperiod').attr('disabled',true);
	}else if(isvalid ==1){
		$('#validityperiod').attr('disabled',false);
	}
	if(!isvalid){
		$("#isvalid").val("1");
	}
	
	//证书有效期不能为空
	jQuery.validator.addMethod("validityperiod" ,function(value,element){
		 var validityperiod = $('#validityperiod').val();
		 var isvalid = $('#isvalid').val();
		 if(!validityperiod && isvalid == "1"){
			 return false;
		 }else if(!validityperiod && !isvalid){
			 return false;
		 }else{
			 return true;
		 }
	},"证书有效期不能为空");

	$("#permitphotoform").validate({
		rules: {
			permittypename: {
				required: true
			},
			permitname: {
				required: true,
				rangelength:[1,25]
			},
			permitcode: {
				required: true,
				rangelength:[1,25]
			},
			permitscope: {
				required: true,
				rangelength:[1,100]
			},
			issuingauthority: {
				required: true,
				rangelength:[1,25]
			},
			issuingdate: {
				required: true
			},
			validityperiod: {
				validityperiod: true
			}
		},
		messages: {
			permittypename: {
				required: "证照类型不能为空"
			},
			permitname: {
				required: "证照名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			permitcode: {
				required: "证书编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			permitscope: {
				required: "审批结果不能为空",
				rangelength: "请输入1-100个字符"
			},
			issuingauthority: {
				required: "发证机关不能为空",
				rangelength: "请输入1-25个字符"
			},
			issuingdate: {
				required: "发证时间不能为空"
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
	
		$('#permitphotoform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	permittypename: {
	        		message: '证照类型不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            permitname: {
	        		message: '证照名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            permitcode: {
	        		message: '证书编号不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            permitscope: {
	        		message: '审批结果不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 100
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
	var arrId = []; 
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	 
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/enterprise/entpermitphoto/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#permitphotoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_permitphoto').val("true");
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
 * 营业期限结束时间勾选validenddate-error
 */
function enddataclick(obj){
	//证书有效期
	if(obj.checked){
		//无限期
		if($("#validityperiod-error")){
			$("#validityperiod-error").remove();//删除证书有效期验证信息
		} 
		$("#isvalid").val("0"); //表示勾上,无期限
		$("#validityperiod").val("");
		$('#validityperiod').attr('disabled',true);
	}else{
		$("#isvalid").val("1"); //表示没勾上,有期限
		$('#validityperiod').attr('disabled',false);
	}	
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
