$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadProharmPost("post"); 
	 //初始化职业危害因素下拉树
	SelectTree.loadHarmFactorSelect("factorname");	

	//女工接触人数验证   
	$.validator.addMethod("checkWomanqty", function(value, element) {   
	    var contactqty = $("#contactqty").val();
	    var womanqty = $("#womanqty").val();
	    if(contactqty){
	    	if(parseInt(contactqty)>=parseInt(womanqty)){
	    		return true;
	    	}
	    }
	    return false;
	}, "女工接触人数不能大于接触总人数");
	
	$("#proharmctrlform").validate({
		rules: {
			workplace: {
				required: true,
				rangelength:[1,25]
			},
			factorname: {
				required: true
			},
			contactqty: {
				required: true,
				rangelength:[1,8],
				number: true
			},
			womanqty: {
				required: true,
				rangelength:[1,8],
				number: true,
				checkWomanqty: true
			},
			post: {
				required: true
			},
			inspectdate: {
				required: true
			},
			inspectresult: {
				required: true,
				rangelength:[1,25]
			}
		},
		messages: {
			workplace: {
				required: "工作场所不能为空",
				rangelength: "请输入1-25个字符"
			},
			factorname: {
				required: "职业危害因素不能为空"
			},
			contactqty: {
				required: "接触人数不能为空",
				rangelength: "请输入1-8个字符",
				number: "请输入数字"
			},
			womanqty: {
				required: "女工接触人数不能为空",
				rangelength: "请输入1-8个字符",
				number: "请输入数字"
			},
			post: {
				required: "岗位不能为空"
			},
			inspectdate: {
				required: "检测日期不能为空"
			},
			inspectresult: {
				required: "检测结果不能为空",
				rangelength: "请输入1-25个字符"
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
	
		$('#proharmctrlform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	factorname: {
	        		message: '职业危害因素不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            workplace: {
	        		message: '工作场所名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            contactqty: {
	        		message: '接触人数不能为空',
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
	        		message: '其中女工接触人数不能为空',
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
	            post: {
	        		message: '岗位不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            inspectdate: {
	        		message: '检测日期不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"change"
	            },
	            inspectresult: {
	        		message: '检测结果不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
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
		url : BASE_URL+'/enterprise/entproharmctrl/save',
		cache : false,
		dataType : 'json',
		data : $("#proharmctrlform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新列表
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

function getFrame(){
	for(var i=0; i<parent.frames.length; i++){
		var frame = parent.frames[i];
		
	}
}
