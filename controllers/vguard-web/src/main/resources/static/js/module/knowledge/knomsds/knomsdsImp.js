$(document).ready(function() {
	showUploadFile('myfile','xls',true);//显示文件上传控件
	
	$("#knomsdsform").validate({
		rules: {
			uploadFilemyfile: {
				required: true
			}
		},
		messages: {
			uploadFilemyfile: {
				required: "导入文件不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/*导入*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    } 
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/knowledge/knomsds/tableImport',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.parent.parent.toast(json.msg);
				$('#myfile').empty();
				showUploadFile('myfile','xls');//显示文件上传控件
				$('#knomsdsform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}



