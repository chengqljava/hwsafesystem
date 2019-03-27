$(function () {
	console.log(GetQueryString("planid"));
	$("#planid").val(GetQueryString("planid"));
	$("a").attr("href",BASE_URL+"train/etstrnplanuser/template");
	showUploadFile("fileUploadDiv", 'file', true, true);// 显示文件上传控件
	//添加表单提交处理
	$("#saveContractImport").off("click").on("click",function(){
		save();
	});
	
	autoHeight();
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
	if (arrId.length == 0) {
		parent.toast("请添加计划培训人员附件！");
		return;
	}
	
	var formData = $("#trnRecordForm").serializeArray();
	formData.push({name:"planid",value:GetQueryString("planid")})
	console.log(formData);
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'train/etstrnplanuser/importPlanUser',
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : formData,
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
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

