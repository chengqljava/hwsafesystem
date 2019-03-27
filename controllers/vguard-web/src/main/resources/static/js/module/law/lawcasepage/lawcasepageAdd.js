var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	
	var menupagetype=$('#menupagetype').val();
	var rules={};
	var messages={};
	initPage(menupagetype);//初始化界面
	$("#myform").validate({
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),
		submitHandler:function(form){
			removeAllDisabled();
		   	save(menupagetype);
			initPage(menupagetype);//初始化界面
	    }
	});
});

function initPage(menupagetype){
	if(menupagetype=='menuDisplay'){//查看界面
		$('#saveBtn').hide();
		$('#reportBtn').hide();
		$('#backBtn').show();
		initDisplayPage();
	}
	else{
		$('#backBtn').hide();
	}
}


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
        "docid": $("#pageid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_casepage"
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
		url : BASE_URL+'/law/lawcasepage/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#pageid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#pageid").val(json.docid);
					}
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


function getRules(menupagetype){
	if(menupagetype=='menuEdit'){
		 return {
			 docarea: {
					required: true
				},
				docyear: {
					required: true,
					isDigits:true,
					minlength:4
				},
				docnum: {
					required: true,
					isDigits:true
				},
				casename: {
					required: true
				},
				punishnotes: {
					required: true
				},
				processresult: {
					required: true
				},
				
				casedate: {
					required: true
				},
				closedate: {
					required: true
				},
				
				undertake1: {
					required: true
				},
//				undertake2: {
//					required: true
//				},
				filedate: {
					required: true
				},
				filecode: {
					required: true
				},
				validterm: {
					required: true
				}
		 }
	}
}

function getMessages(menupagetype){
	if(menupagetype=='menuEdit'){
		 return {
				docarea: {
					required: "请输入文书区域"
				},
				docyear: {
					required: "请输入文书年份",
					isDigits:"请输入数字",
					minlength:"请输入4位数字"
				},
				docnum: {
					required: "请输入文书编号",
					isDigits: "请输入数字"
				},
				casename: {
					required: "请输入案件名称"
				},
				punishnotes: {
					required: "请输入案由"
				},
				processresult: {
					required: "请输入处理结果"
				},
				casedate: {
					required: "请输立案日期"
				},
				closedate: {
					required: "请输入结案日期"
				},
				
				undertake1: {
					required: "请输入承办人1"
				},
//				undertake2: {
//					required: "请输入承办人2"
//				},
				filedate: {
					required: "请输入归档日期"
				},
				filecode: {
					required: "请输入归档号"
				},
				validterm: {
					required: "请输入保存期限"
				}
			}
		}
}

