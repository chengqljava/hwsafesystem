$(document).ready(function() {
	
	showUploadFile("fileUploadDiv",'file',true);//显示文件上传控件
	
	
	$('#test').click(function(){
		//alert(arrId.length==0);
	});
	
	$("#knosafeform").validate({
		rules: {
			lawname:{
				required: true
			},
			lawregcode:{
				required: true
			},
			lawisscy:{
				required: true
			}
		},
		messages: {
			lawname:{
				required: "标题不能为空"
			},
			lawregcode:{
				required: "文号不能为空"
			},
			lawisscy:{
				required: "颁布机构不能为空"
			}
		
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});


/**保存*/
function save(){

	var arrId = []; 
	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
		
		//获取file的全部id  
	    var uplist = $("input[name^=file]");  
		 
		for (var i=0; i< uplist.length; i++){  
		    if(uplist[i].value){  
		        arrId[i] = uplist[i].id;  
		    }  
	    }

	/*	if(arrId.length==0){
			if($("#tips").size()<=0){
				$("#attachname").append("<div id='tips'><font color='red'>附件不能为空</font></div>");
			}
		}else{
			$("#tips").remove();
		}*/
	
	//获取file的全部id  
 /*   var uplist = $("input[name^=file]");  
	 
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }

	if(arrId.length==0){
		if($("#tips").size()<=0){
			$(".zwUpload").append("<div id='tips'><font color='red'>附件不能为空</font></div>");
			return;
		}
	}else{
		$("#tips").remove();
	}*/
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/knowledge/knolaw/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#knosafeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#fileUploadDiv').empty();
				showUploadFile('fileUploadDiv','file');//显示文件上传控件
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}