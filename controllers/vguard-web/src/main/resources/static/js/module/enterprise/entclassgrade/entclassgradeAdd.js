$(document).ready(function() {
	
	$("#entclassgradeform").validate({
		rules: {
			grade: {
				required: true
			},
			alterreason: {
				required: true
			},
			alterperson: {
				required: true
			},
			altertime: {
				required: true
			}
		},
		messages: {
			grade: {
				required: "请选择修改后级别!"
			},
			alterreason: {
				required: "修改理由不能为空"
			},
			alterperson: {
				required: "修改人不能为空"
			},
			altertime: {
				required: "修改时间不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entclassgrade/save',
		cache : false,
		dataType : 'json',
		data : $("#entclassgradeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
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