$(document).ready(function() {
	SelectOption.loadVideoModelStyle("type");
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	$("#macVideoBrandtypeform").validate({
		rules: {
			brandtypename:{
				required: true
			},
			brandtypenum:{
				required: true,
				stringCheck:true
			},
			type:{
				required: true
			}
		},
		messages: {
			brandtypename:{
				required: "型号名称不能为空"
			},
			brandtypenum:{
				required: "型号编码不能为空",
				stringCheck:"只能包括字母、数字、点和下划线"
			},
			type:{
				required: "主机/摄像头不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/monitor/macvideobrandtype/save',
		cache : false,
		dataType : 'json',
		data : $("#macVideoBrandtypeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().refreshTree();//刷新树
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