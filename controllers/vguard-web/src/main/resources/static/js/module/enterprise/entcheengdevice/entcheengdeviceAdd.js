$(document).ready(function() {
	selectcheckbox("enttypes","enttype");//设置企业类型选中
	
	$("#entcheengdeviceform").validate({
		rules: {
			cheengdevname: {
				required: true,
				rangelength:[1,50]
			}
		},
		messages: {
			cheengdevname: {
				required: "化工装置名称不能为空",
				rangelength: "请输入1-50个字符"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	
});

//设置check选中
function selectcheckbox(arrid,checkname){
	 var arr = $("#"+arrid).val().split(",");
	 var hiddens = $("input[type='checkbox'][name="+checkname+"]");
	 $.each(hiddens,function (){
		 var val=$(this).val();
		 if($.inArray(val, arr) != -1)
		 	this.checked="checked";
	 });
}

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entcheengdevice/save',
		cache : false,
		dataType : 'json',
		data : $("#entcheengdeviceform").serializeArray(),
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



