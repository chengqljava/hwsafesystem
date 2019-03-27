$(document).ready(function() {
	
	SelectOption.loadLawBasisType("basistypecode");
	
	$("#myform").validate({
		rules: {
			basistypecode: {
				required: true
			},
			behavior: {
				required: true
			},
			lawrule: {
				required: true
			}
		},
		messages: {
			basistypecode: {
				required: "请选择类别"
			},
			behavior: {
				required: "违法行为描述不能为空"
			},
			lawrule: {
				required: "法律规定不能为空"
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
		url : BASE_URL+'/law/lawbasis/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
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

