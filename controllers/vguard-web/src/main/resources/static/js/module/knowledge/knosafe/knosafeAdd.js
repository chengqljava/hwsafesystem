$(document).ready(function() {
	
	showUploadFile("fileUploadDiv",'file',true);//显示文件上传控件
	
	var arrId = []; 
	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
	$("input[name^=file]").on('change',function(){
		//获取file的全部id  
	    var uplist = $("input[name^=file]");  
		 
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
	
	$("#knosafeform").validate({
		rules: {
			name:{
				required: true
			},
			registercode:{
				required: true
			},
			issueanency:{
				required: true
			}
		},
		messages: {
			name:{
				required: "标题不能为空"
			},
			registercode:{
				required: "文号不能为空"
			},
			issueanency:{
				required: "颁布机构不能为空"
			}
		},
		submitHandler:function(form){
	    	save(arrId);
	    }   
	});
});


/**保存*/
function save(arrId){
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/knowledge/knosafe/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#knosafeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
//				var index = parent.getParentIndex();
//				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
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