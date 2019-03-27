$(function () {
	$("a").attr("href",BASE_URL+"publics/publicenterapply/template");
	showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
	//添加表单提交处理
	$("#saveContractImport").off("click").on("click",function(){
		save();
	});
});



/*保存(新增)*/
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
		url : BASE_URL+'publics/publicenterapply/importEnterApply',
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : {},
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


