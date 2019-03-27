$(document).ready(function() {
	$("#entNoBusinessForm").validate({
		rules: {
			entaddress: {
				required: true
			},
			copyoforg: {
				required: true
			},
			leadername: {
				required: true
			},
			leaderphone: {
				required: true
			}
		},
		messages: {
			entaddress: {
				required: "企业地址不能为空"
			},
			copyoforg: {
				required: "抄送部门不能为空"
			},
			leadername: {
				required: "负责人姓名不能为空"
			},
			leaderphone: {
				required: "联系电话不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entnobusiness/save',
		cache : false,
		dataType : 'json',
		data : $("#entNoBusinessForm").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);//弹出提示信息
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}