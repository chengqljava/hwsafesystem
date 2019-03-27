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
			digest: {
				required: true
			},
			emceeadv: {
				required: true
			},
//			emceesign: {
//				required: true
//			},
//			emceedate: {
//				required: true
//			},
			dutyadv: {
				required: true
			}
//			,
//			dutysign: {
//				required: true
//			},
//			dutydate: {
//				required: true
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
			casename:{
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
			digest: {
				required: "请输入内容"
			},
			emceeadv: {
				required: "请输入内容"
			},
//			emceesign: {
//				required: "请输入内容"
//			},
//			emceedate: {
//				required: "请输入日期"
//			},
			dutyadv: {
				required: "请输入内容"
			}
//			,
//			dutysign: {
//				required: "请输入内容"
//			},
//			dutydate: {
//				required: "请输入日期"
//			},
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
        "docid": $("#reportid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_hearreport"
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
		url : BASE_URL+'/law/lawhearreport/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#reportid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#reportid").val(json.docid);
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