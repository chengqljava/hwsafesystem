$(document).ready(function() {
	 
	 $("#knomsdsform").validate({
			rules: {
				chname: {
					required: true,
					rangelength:[1,100]
				},
				molformula: {
					required: true,
					rangelength:[1,50]
				},
				casno: {
					required: true,
					rangelength:[1,50]
				}
			},
			messages: {
				chname: {
					required: "中文名称不能为空",
					rangelength: "请输入1-100个字符"
				},
				molformula: {
					required: "分子式不能为空",
					rangelength:"请输入1-100个字符"
				},
				casno: {
					required: "CAS号不能为空",
					rangelength:"请输入1-200个字符"
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
		url : BASE_URL+'/knowledge/knomsds/save',
		cache : false,
		dataType : 'json',
		data : $("#knomsdsform").serializeArray(),
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
