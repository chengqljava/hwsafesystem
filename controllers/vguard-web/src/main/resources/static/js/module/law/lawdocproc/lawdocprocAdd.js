
$(document).ready(function() {	

	showUploadFile('attachname','file',true);
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawdocproc/docselect","docid");	

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
				$("#tdattach").append("<div id='tips'><font color='red'>流程文件不能为空</font></div>");
			}
		}else{
			$("#tips").remove();
		}
	});
	
	$("#procform").validate({
		rules: {
			docid: {
				required: true
			}
		},
		messages: {
			docid: {
				required: "执法文书不能为空"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
});

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
			$("#tdattach").append("<div id='tips'><font color='red'>流程文件不能为空</font></div>");
		}
	}else{
		$("#tips").remove();
		$.ajaxFileUpload({
			type : 'post',
			url : BASE_URL+'/law/lawdocproc/save',
			secureuri:false,
		    files : arrId,
			cache : false,
			dataType : 'json',
			data : $("#procform").serializeArray(),
			global : false,
			success : function(json) {
			  if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			  }else{
				//parent.toast(json.msg);
				parent.layer.alert(json.msg);
			  }
			},
			error : function() {
				//parent.toast("保存失败");
				parent.layer.alert("保存失败");
			}
		});
	}   
}
