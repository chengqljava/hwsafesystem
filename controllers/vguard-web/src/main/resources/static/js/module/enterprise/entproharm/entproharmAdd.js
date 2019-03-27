$(document).ready(function() {
	// 企业规模下拉框
	SelectOption.loadEntscale("entscale");
	// 用人单位类型下拉框
	SelectOption.loadEntType("enttype");
	// 行业分类下拉框
	SelectOption.loadBaseCodeFromDB(BASE_URL+'/enterprise/entproharm/industrytypeselect', "industrytypeid", "{}");
	// 是否职业卫生管理机构
	SelectOption.loadTureFalse("manageorg");
	// 其中定期进行健康体检人员比例
	SelectOption.loadPhysicals("physicals");
	// 是否建立职业健康档案
	SelectOption.loadTureFalse("healthfile");
	// 是否职业病危害申报
	SelectOption.loadTureFalse("declare");
	
	//经济类型树
	SelectTree.loadEconomictypeSelect("economictypename");


	//女职工总人数验证   
	$.validator.addMethod("checkWomanqty", function(value, element) {   
	    var empqty = $("#empqty").val();
	    var womanqty = $("#womanqty").val();
	    if(empqty){
	    	if(parseInt(empqty)>=parseInt(womanqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "女职工人数不能大于职工总人数");
	
	//接触职业危害总人数验证   
	$.validator.addMethod("checkContactqty", function(value, element) {   
	    var empqty = $("#empqty").val();
	    var contactqty = $("#contactqty").val();
	    if(empqty){
	    	if(parseInt(empqty)>=parseInt(contactqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "接触职业危害总人数不能大于职工总人数");
	
	//接触职业危害女职工人数验证
	$.validator.addMethod("checkWomancontactqty", function(value, element) {  
	    var womanqty = $("#womanqty").val(); 
	    var contactqty = $("#contactqty").val();
	    var womancontactqty = $("#womancontactqty").val();
	    if(womanqty && contactqty){
	    	if(parseInt(contactqty)>=parseInt(womancontactqty)
	    			&& parseInt(womanqty)>=parseInt(womancontactqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "接触职业危害女职工人数不能大于接触职业危害总人数及女职工总人数");
	
	//职业病累计人数验证
	$.validator.addMethod("checkProharmqty", function(value, element) {  
		var empqty = $("#empqty").val();//职工总数
		var contactqty = $("#contactqty").val();//接触职业危害总人数
		var proharmqty = $("#proharmqty").val();//职业病累计人数
	    if(empqty && contactqty){
	    	if(parseInt(empqty)>=parseInt(proharmqty)
	    			&& parseInt(contactqty)>=parseInt(proharmqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "职业病累计人数不能大于接触职业危害总人数及职工总人数");
	
	//职业病患者中女职工人数验证
	$.validator.addMethod("checkWomanharmqty", function(value, element) {   
	    var proharmqty = $("#proharmqty").val();//职业病累计人数
	    var womanqty = $("#womanharmqty").val();
	    var womancontactqty = $("#womancontactqty").val();//接触职业危害女职工人数
	    if(proharmqty && womancontactqty){
	    	if(parseInt(womancontactqty)>=parseInt(womanqty) 
	    		&& parseInt(proharmqty)>=parseInt(womanqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "职业病患者中女职工人数不能大于职业病累计人数及接触职业危害女职工人数");
	
	
	$("#proharmform").validate({
		rules: {
			address: {
				required: true,
				rangelength:[1,50]
			},
			enttype: {
				required: true
			},
			industrytypeid: {
				required: true
			},
			manageorg: {
				required: true
			},
			managefulltime: {
				required: true,
				number: true
			},
			physicals: {
				required: true
			},
			manageparttime: {
				required: true,
				number: true
			},
			empqty: {
				required: true,
				number: true
			},
			womanqty: {
				required: true,
				number: true,
				checkWomanqty: true
			},
			contactqty: {
				required: true,
				number: true,
				checkContactqty: true
			},
			womancontactqty: {
				required: true,
				number: true,
				checkWomancontactqty: true
			},
			proharmqty: {
				required: true,
				number: true,
				checkProharmqty: true
			},
			womanharmqty: {
				required: true,
				number: true,
				checkWomanharmqty: true
			},
			healthfile: {
				required: true
			},
			declare: {
				required: true
			},
			declarecode: {
				required: true
			},
			inputperson: {
				required: true
			},
			telephone: {
				required: true,
				isTelephone: true
			}
		},
		messages: {
			address: {
				required: "工作场所详细地址不能为空",
				rangelength: "请输入1-50个字符"
			},
			enttype: {
				required: "用人单位类型不能为空"
			},
			industrytypeid: {
				required: "行业分类不能为空"
			},
			manageorg: {
				required: "是否职业卫生管理机构不能为空"
			},
			managefulltime: {
				required: "职业卫生管理人数（专职）不能为空",
				number: "请输入数字"
			},
			physicals: {
				required: "定期进行健康体检人员比例不能为空"
			},
			manageparttime: {
				required: "职业卫生管理人数（兼职）不能为空",
				number: "请输入数字"
			},
			empqty: {
				required: "职工总数不能为空",
				number: "请输入数字"
			},
			womanqty: {
				required: "女职工人数不能为空",
				number: "请输入数字"
			},
			contactqty: {
				required: "接触职业危害总人数不能为空",
				number: "请输入数字"
			},
			womancontactqty: {
				required: "接触职业危害女职工人数不能为空",
				number: "请输入数字"
			},
			proharmqty: {
				required: "职业病累计人数不能为空",
				number: "请输入数字"
			},
			womanharmqty: {
				required: "职业病患者中女职工人数不能为空",
				number: "请输入数字"
			},
			healthfile: {
				required: "是否建立职业健康档案不能为空"
			},
			declare: {
				required: "是否职业病危害申报不能为空"
			},
			declarecode: {
				required: "申报登记号不能为空",
			},
			inputperson: {
				required: "填表人姓名不能为空",
				rangelength: "请输入1-10个字符"
			},
			telephone: {
				required: "联系电话不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	/**
		$('#proharmform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	address: {
	        		message: '工作场所详细地址不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 50
	                    }
	                }
	            },
	            enttype: {
	        		message: '用人单位类型不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            industrytypeid: {
	        		message: '行业分类不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            manageorg: {
	        		message: '是否职业卫生管理机构不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            managefulltime: {
	        		message: '职业卫生管理人数（专职）不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            physicals: {
	        		message: '定期进行健康体检人员比例不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            manageparttime: {
	        		message: '职业卫生管理人数（兼职）不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            empqty: {
	        		message: '职工总数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            womanqty: {
	        		message: '女职工人数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            contactqty: {
	        		message: '接触职业危害总人数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            womancontactqty: {
	        		message: '接触职业危害女职工人数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            proharmqty: {
	        		message: '职业病累计人数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            womanharmqty: {
	        		message: '职业病患者中女职工人数不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 8
	                    },
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            healthfile: {
	        		message: '是否建立职业健康档案不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            declare: {
	        		message: '是否职业病危害申报不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            declarecode: {
	        		message: '申报登记号不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 10
	                    }
	                }
	            },
	            inputperson: {
	        		message: '填表人姓名不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 10
	                    }
	                }
	            },
	            telephone: {
	        		message: '联系电话不能为空',
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
		url : BASE_URL+'/enterprise/entproharm/save',
		cache : false,
		dataType : 'json',
		data : $("#proharmform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.frames["contentIframe"].location.reload();
				parent.$('#ent_proharm').val("true");
				parent.loadSafemenutree();
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.toast("保存失败");
		}
	});
}

//职业危害控制
function proharmctrl(){
	var proharmid = $("#proharmid").val();
	if(proharmid){
		parent.parent.openWin(BASE_URL+"/enterprise/entproharmctrl/"+proharmid,'职业危害控制','70%','60%');
	}else{
		parent.parent.toast("请先保存职业病危害信息");
	}
}
