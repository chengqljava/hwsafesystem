$(document).ready(function() {


	$("#saferewardform").validate({
		rules: {
			rewardname: {
				required: true,
				rangelength:[1,25]
			},
			rewardtime: {
				required: true
			},
			rewardcontent: {
				required: true,
				rangelength:[1,100]
			},
			awarder: {
				required: true,
				rangelength:[1,25]
			}
		},
		messages: {
			rewardname: {
				required: "获奖名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			rewardtime: {
				required: "获奖时间不能为空"
			},
			rewardcontent: {
				required: "获奖内容不能为空",
				rangelength: "请输入1-100个字符"
			},
			awarder: {
				required: "颁奖单位不能为空",
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
	
		$('#saferewardform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	rewardname: {
	        		message: '获奖名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            rewardcontent: {
	        		message: '获奖内容不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 100
	                    }
	                }
	            },
	            awarder: {
	        		message: '颁奖单位不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            rewardtime: {
	        		message: '获奖时间不能为空',
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
		url : BASE_URL+'/enterprise/entsafereward/save',
		cache : false,
		dataType : 'json',
		data : $("#saferewardform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safereward').val("true");
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
