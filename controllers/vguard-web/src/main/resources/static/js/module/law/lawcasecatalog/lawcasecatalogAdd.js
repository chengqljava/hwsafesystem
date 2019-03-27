$(document).ready(function() {

	$("#catalogform").validate({
		rules: {
			ordernum: {
				required: true
			},
			docname: {
				required: true
			},
			createdate: {
				required: true
			},
			page: {
				required: true,
				isDigits: true
			}
		},
		messages: {
			ordernum: {
				required: "序号不能为空"
			},
			docname: {
				required: "文件名称及编号不能为空"
			},
			createdate: {
				required: "日期不能为空"
			},
			page: {
				required: "页号不能为空",
				isDigits: "请输入数字"
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
		url : BASE_URL+'/law/lawcasecatalog/save',
		cache : false,
		dataType : 'json',
		data : $("#catalogform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.frames["contentIframe"].reloadGrid();//刷新父列表
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

