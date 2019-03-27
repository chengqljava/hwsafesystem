var isDocSubmit=false;
var isSaved=false;
$(document).ready(function() {
	//初始化时间格式字段
//	setDateVal("starttime");
//	setDateVal("endtime");
	
	var menupagetype=$('#menupagetype').val();
	if(menupagetype=='menuDisplay'){//查看界面
		$('#saveBtn').hide();
		$('#reportBtn').hide();
		$('#backBtn').show();
		initDisplayPage();
	}
	else{
		$('#backBtn').hide();
	}
	
	$("#myform").validate({
		rules: {
			casename:{
				required: true
			},
			starttime: {
				required: true
			},
			endtime: {
				required: true
			},
//			hearingaddr:{
//				required: true
//			},
			emcee:{
				required: true
			},
//			reportperson:{
//				required: true
//			},
//			recordperson:{
//				required: true
//			},
//			attendperson:{
//				required: true,
//				maxlength:1000
//			},
			content:{
				required: true
			},
			record:{
				required: true
			},
			advice:{
				required: true
			}
//			,
//			attendsign:{
//				required: true,
//				maxlength:150
//			}
		},
		messages: {
			casename:{
				required: "请输入内容"
			},
			starttime: {
				required: "请输入日期"
			},
			endtime: {
				required: "请输入日期",
			},
//			hearingaddr:{
//				required: "请输入数字"
//			},
			emcee:{
				required: "请输入内容"
			},
//			reportperson:{
//				required: "请输入内容"
//			},
//			recordperson:{
//				required: "请输入内容"
//			},
//			attendperson:{
//				required: "请输入内容",
//				maxlength:"不能超过1000个字"
//			},
			content:{
				required: "请输入内容"
			},
			record:{
				required: "请输入内容"
			},
			advice:{
				required: "请输入内容"
			}
//			,
//			attendsign:{
//				required: "请输入内容",
//				maxlength:"不能超过150个字"
//			}
		},
		submitHandler:function(form){
		   	save();
	    }
	});
});

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#myform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#discussid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_heardiscuss"
    },
    global: false,
    async: true,
    success: function (json) {
		if(json.success==true){
			parent.toast(json.msg);//弹出提示信息
			$("#reportBtn").hide();
			$("#saveBtn").hide();
			
	        $("#printBtn").show();
	        $("#backBtn").show();
		}else{
			parent.toast(json.msg);
		}
    },
    error: function () {
     parent.parent.toast("网络异常");
    }
});
}

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawheardiscuss/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#discussid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					window.location=BASE_URL +"/law/lawheardiscuss/"+$('#menupagetype').val()+"/"+$("#checkinfoid").val()+"/"+$("#doccode").val();
					parent.toast(json.msg);//弹出提示信息
				}
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 格式化日期字段
 */
//var setDateVal = function(dateStrEleId){
//	var docDateStr = $("#" + dateStrEleId).val();
//	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
//		var docDate = new Date(docDateStr);
//		$("#" + dateStrEleId).val(docDate.getFullYear() + "-" + (docDate.getMonth() + 1) + "-" + docDate.getDate() +
//					" " + docDate.getHours() + ":" +  docDate.getMinutes()  + ":" + docDate.getSeconds());
//	}
//}