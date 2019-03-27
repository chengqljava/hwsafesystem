$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadIndustryTypes("industrytypes");
	
	$("#entthreemeanform").validate({
		rules: {
			projectname: {
				required: true,
				rangelength:[1,50],
			}
		},
		messages: {
			projectname: {
				required: "项目名称不能为空",
				rangelength: "请输入1-50个字符",
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
		url : BASE_URL+'/enterprise/entthreemean/save',
		cache : false,
		dataType : 'json',
		data : $("#entthreemeanform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].frames["chemIframe"].reloadGrid();//刷新列表
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



