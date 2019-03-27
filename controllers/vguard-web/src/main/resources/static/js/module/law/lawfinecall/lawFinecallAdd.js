var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	
	initializePage();
	$("#lawfinecallform").validate({
		rules: {
			docarea:{
				required: true,
				maxlength: 2
			},
			docyear:{
				required: true,
				maxlength: 4,
				isDigits:true
			},
			docnum:{
				required: true,
				maxlength: 3,
				stringCheck:true
			},
			docdate : {
				required : true
			}
		},
		messages: {
			docarea:{
				required: "文书区域不能为空",
				maxlength:"不能超过4个字"
			},
			docyear:{
				required: "文书年份不能为空",
				maxlength:"长度不能超过4",
				isDigits:"只能输入数字"
			},
			docnum:{
				required: "文书编号不能为空",
				stringCheck:"只能是字母数字下划线",
				maxlength:"长度不能超过4"
			},
			docdate : {
				required : "文书日期不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});

$("input[name=paytypeSel]").change(function(){
	$("#paytype").val($(this).val());
});


$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawfinecallform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#finecallid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_finecall"
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

/**保存*/
function save(){
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawfinecall/save',
		cache : false,
		dataType : 'json',
		data : $("#lawfinecallform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#finecallid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#finecallid").val(json.docid);
					}
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//刷新列表
					parent.closeWin();// 关闭弹出框
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

//初始化页面
function initializePage(){
	if($("#finecallid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
//		$("#docarea").val("乐五");
	}
	else {
		
		setDateVal("docdate");
	}
	
	// 缴费截止日期
	var payEndDate = new Date($("#punishdocdate").val());
	payEndDate.setDate(payEndDate.getDate() + 15);
	setDateValWithDate(payEndDate, "payenddate");
	// 决定书文书日期
	setDateVal("punishdocdate");

}

var setDateValWithDate = function(dateVal, dateStrEleId) {
	
	if(!isNaN(dateVal.getTime()))
		$("#" + dateStrEleId).val(dateVal.getFullYear() + "-" + (dateVal.getMonth() + 1) + "-" + dateVal.getDate() + "");	
}

var setDateVal = function(dateStrEleId){
	var docDateStr = $("#" + dateStrEleId).val();
	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
		var docDate = new Date(docDateStr);
		$("#" + dateStrEleId).val(docDate.getFullYear() + "-" + (docDate.getMonth() + 1) + "-" + docDate.getDate() + "");
	}
}

