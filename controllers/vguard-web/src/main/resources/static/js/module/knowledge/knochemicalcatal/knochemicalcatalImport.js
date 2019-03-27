$(document).ready(function() {
	
	showUploadFile('attachname','file',true);
	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
	$("input[name^=file]").on('change',function(){
		//获取file的全部id  
	    var uplist = $("input[name^=file]");  
		var arrId = [];  
		for (var i=0; i< uplist.length; i++){  
		    if(uplist[i].value){  
		        arrId[i] = uplist[i].id;  
		    }  
	    }

		if(arrId.length==0){
			if($("#tips").size()<=0){
				$("#tdattach").append("<div id='tips'><font color='red'>附件不能为空</font></div>");
			}
		}else{
			$("#tips").remove();
		}
	});
	
	$("#knochemicalcatalform").validate({
		rules: {
		},
		messages: {
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	
});




/**保存*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    } 
	
	if(arrId.length==0){
		if($("#tips").size()<=0){
			$("#tdattach").append("<div id='tips'><font color='red'>附件不能为空</font></div>");
		}
	}else{
		$("#tips").remove();
		$.ajaxFileUpload({
			type : 'post',
			url : BASE_URL+'/knowledge/knochemicalcatal/saveImport',
			secureuri:false,
		    files : arrId,
			cache : false,
			dataType : 'json',
			data : $("#knochemicalcatalform").serializeArray(),
			global : false,
			success : function(json) {
				if(json.success==true){
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//刷新列表
					parent.closeWin();// 关闭弹出框
				}else{
					parent.toast(json.msg);
					$('#attachname').empty();
					showUploadFile('attachname','file',true);//显示文件上传控件
				}
			},
			error : function() {
				parent.toast("保存失败");
			}
		});
	}
}

