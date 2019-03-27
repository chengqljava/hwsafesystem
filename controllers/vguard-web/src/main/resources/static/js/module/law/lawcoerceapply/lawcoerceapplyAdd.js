var isDocSubmit=false;
var isSaved=false;


$(document).ready(function() {
	
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
	
	$("#lawcoerceapplyform").validate({
		rules: {
			docarea: {
				required: true,
				isChinese: true
			},
			docyear: {
				required: true,
				isDigits: true
			},
			docnum: {
				required: true,
				isDigits: true
			},
			entname: {
				required: true
			},
			courtname: {
				required: true
			},
			punishdate: {
				required: true
			},
			punishdec: {
				required: true
			},
			punishnum: {
				required: true
			},
			docdate: {
				required: true
			},
			contacts: {
				required: true
			},
			phone: {
				required: true,
				isTelephone: true
			}
		},
		messages: {
			docarea: {
				required: "区域不能为空"
			},
			docyear: {
				required: "年份不能为空"
			},
			docnum: {
				required: "编号不能为空"
			},
			entname: {
				required: "申请执法人不能为空"
			},
			courtname: {
				required: "法院名称不能为空"
			},
			punishdate: {
				required: "处罚时间不能为空"
			},
			punishdec: {
				required: "处罚决定不能为空"
			},
			punishnum: {
				required: "处罚文号不能为空"
			},
			docdate: {
				required: "文书录入时间不能为空"
			},
			contacts: {
				required: "联系人不能为空"
			},
			phone: {
				required: "联系电话不能为空"
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

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawcoerceapplyform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#applyid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_coerceapply"
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
		url : BASE_URL+'/law/lawcoerceapply/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcoerceapplyform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#applyid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#applyid").val(json.docid);
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


