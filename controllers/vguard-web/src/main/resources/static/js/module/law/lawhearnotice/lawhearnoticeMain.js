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
	
	$("#myform").validate({
		rules: {
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
			entname: {
				required: true
			},
			hearingdate: {
				required: true
			},
			hearingaddr: {
				required: true
			},
			isopen: {
				required: true
			},
			emcee: {
				required: true
			},
			hear1: {
				required: true
			},
//			hear2: {
//				required: true
//			},
			clerk: {
				required: true
			},
			docdate: {
				required: true
			},
			safetyaddr: {
				required: true
			},
//			safetyzip: {
//				required: true
//			},
//			safetyperson: {
//				required: true
//			},
//			safetytel: {
//				required: true,
//				isTel:true
//			}
		},
		messages: {
			docarea: {
				required: "请输入内容"
			},
			docyear: {
				required: "请输入内容",
				isDigits:"请输入数字",
				minlength:"请输入4位数字"
			},
			docnum: {
				required: "请输入内容",
				isDigits: "请输入数字"
			},
			entname: {
				required: "请输入内容"
			},
			casename:{
				required: "请输入内容"
			},
			hearingdate: {
				required: "请输入日期"
			},
			hearingaddr: {
				required: "请输入内容"
			},
			isopen: {
				required: "请输入内容"
			},
			emcee: {
				required: "请输入内容"
			},
			hear1: {
				required: "请输入内容"
			},
//			hear2: {
//				required: "请输入内容"
//			},
			clerk: {
				required: "请输入内容"
			},
			docdate: {
				required: "请输入日期",
			},
			safetyaddr: {
				required: "请输入内容"
			},
//			safetyzip: {
//				required: "请输入内容"
//			},
//			safetyperson: {
//				required: "请输入内容"
//			},
//			safetytel: {
//				required: "请输入内容",
//				isTel:"联系电话格式错误"
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
        "docid": $("#noticeid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_hearnotice"
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
		url : BASE_URL+'/law/lawhearnotice/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#noticeid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#noticeid").val(json.docid);
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