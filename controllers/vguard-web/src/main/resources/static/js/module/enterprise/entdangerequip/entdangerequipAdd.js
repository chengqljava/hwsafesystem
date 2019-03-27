$(document).ready(function() {
	 //初始化特种作业岗位下拉树
	SelectTree.loadDangerEquipTypeSelect("equipname");
	
	jQuery.validator.addMethod("Integer", function(value, element) { 
		var num =  /^[0-9]+$/;
		return this.optional(element) || (num.test(value)); 
		}, "请输入整数");
	$("#dangerequipform").validate({
		rules: {
			equipname: {
				required: true
			},
			quantity: {
				required: true,
				Integer:true,
				rangelength:[1,9]
			},
			quantityunit: {
				required: true,
				rangelength:[1,10]
			}
		},
		messages: {
			equipname: {
				required: "危险设备类型不能为空"
			},
			quantity: {
				required: "数量不能为空",
				Integer: "请输入整数，不能有其他字符空格和全角数字",
				rangelength:"请输入1-9个字符"
			},
			quantityunit: {
				required: "数量单位不能为空",
				rangelength: "请输入1-10个字符"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	/**
		$('#dangerequipform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	equipname: {
	        		message: '危险设备类型不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            quantity: {
	        		message: '数量不能为空',
	                validators: {
	                    notEmpty: {},
	                    regexp: {
	                        regexp: /^\d+$/,
	                        message:"请输入数字"
	                    }
	                }
	            },
	            quantityunit: {
	        		message: '数量单位不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 10
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
		url : BASE_URL+'/enterprise/entdangerequip/save',
		cache : false,
		dataType : 'json',
		data : $("#dangerequipform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_dangerequip').val("true");
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
