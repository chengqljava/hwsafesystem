$(document).ready(function() {
	$("#myform").validate({
		rules: {
			probleminfo: {
				required: true
			},
			answer: {
				required: true
			}
		},
		messages: {
			probleminfo: {
				required: "问题不能为空"
			},
			answer: {
				required: "回答不能为空"
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
		url : BASE_URL+'/chat/chatproblem/save',
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

