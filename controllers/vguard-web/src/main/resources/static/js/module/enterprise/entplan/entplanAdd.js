$(document).ready(function() {
	
	showUploadFile('attachname','image');
	
	// 给input type添加onchange事件 
	// 当附件为空时，显示提示；反之删除提示
	$("input[name^=file]").on('change',function(){
		var filename = $("input[name^=file]").val();
		var index = filename.lastIndexOf('.');
		$("#filetype").val(filename.substring(index+1));
		//获取file的全部id  
	    var uplist = $("input[name^=file]");  
		var arrId = []; 
		for (var i=0; i< uplist.length; i++){  
		    if(uplist[i].value){  
		        arrId[i] = uplist[i].id;  
		        arrName[i] = uplist[i].name;
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
	
	$("#planform").validate({
		rules: {
			planname: {
				required: true,
				rangelength:[1,25]
			},
			myfile:{
				required: true,
				imageverify: true
			}
		},
		messages: {
			planname: {
				required: "平面图名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			myfile:{
				required: "平面图不能为空",
				imageverify: "请上传图片"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
	
	
});




/**保存*/
function save(){
	var filetype = $("#filetype").val();
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
	}else if ( filetype != "jpg" && filetype != "png" && filetype != "bmp" && filetype != "jpeg") {
        console.log(filetype);
		parent.toast("文件格式上传错误");
		return;
	}else{
		$("#tips").remove();
		$.ajaxFileUpload({
			type : 'post',
			url : BASE_URL+'/enterprise/entplan/save',
			secureuri:false,
		    files : arrId,
			cache : false,
			dataType : 'json',
			data : $("#planform").serializeArray(),
			global : false,
			success : function(json) {
				if(json.success==true){
					parent.toast(json.msg);//弹出提示信息
					var index = parent.getParentIndex();
					parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
					parent.frames["layui-layer-iframe"+index].$('#ent_plan').val("true");
					parent.frames["layui-layer-iframe"+index].loadSafemenutree();
					//parent.frames["layui-layer-iframe"+index].location.reload();
					parent.closeWin();// 关闭弹出框
				}else{
					parent.toast(json.msg);
					$('#attachname').empty();
					showUploadFile('attachname','image');//显示文件上传控件
				}
			},
			error : function() {
				parent.toast("保存失败");
			}
		});
	}
}

