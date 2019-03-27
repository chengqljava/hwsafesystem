$(document).ready(function() {
	$("#macprobebrandform").validate({
		rules: {
			brandname:{
				required: true
			},
			sort:{
				required: true,
				integer:true,
			}
		},
		messages: {
			brandname:{
				required: "名称不能为空"
			},
			sort:{
				required: "排序不能为空",
				integer:"只能输入整数"
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
		url : BASE_URL+'/monitor/macprobebrand/save',
		cache : false,
		dataType : 'json',
		data : $("#macprobebrandform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
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