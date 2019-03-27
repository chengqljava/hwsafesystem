$(document).ready(function() {
	 //初始化许可证类型下拉树
	SelectTree.loadInvestFieldSelect("fieldname");	

	
	$("#safeinvestinfoform").validate({
		rules: {
			fieldname: {
				required: true
			},
			investmoney: {
				required: true,
				isDecimal: true,
				rangelength:[1,8]
			},
			investtime: {
				required: true
			},
			achievement: {
				required: true,
				rangelength:[1,500]
			}
		},
		messages: {
			fieldname: {
				required: "投入领域不能为空"
			},
			investmoney: {
				required: "投入额度不能为空",
				rangelength: "请输入1-6个字符"
			},
			investtime: {
				required: "投入时间不能为空"
			},
			achievement: {
				required: "取得成效不能为空",
				rangelength: "请输入1-500个字符"
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
	
		$('#safeinvestinfoform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	fieldname: {
	        		message: '投入领域不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            investmoney: {
	        		message: '投入额度不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 10
	                    },
	                    regexp: {
	                        regexp: /^\d+(\.\d+)?$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            investtime: {
	        		message: '投入时间不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"change"
	            },
	            achievement: {
	        		message: '取得成效不能为空',
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
		url : BASE_URL+'/enterprise/entsafeinvestinfo/save',
		cache : false,
		dataType : 'json',
		data : $("#safeinvestinfoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safeinvestinfo').val("true");
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
