var isDocSubmit=false;
var isSaved=false;
$(document).ready(function() {
	//性别
	SelectOption.loadSex("legalsex");
	//性别
	SelectOption.loadSex("proxysex1");
	//性别
	SelectOption.loadSex("proxysex2");
	
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
			casename: {
				required: true
			},
			hearorg: {
				required: true
			},
//			hearingaddr: {
//				required: true
//			},
			starttimeyear: {
				required: true,
				isDigits:true,
				minlength:4
			},
			starttime: {
				required: true
			},
			endtime: {
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
			safer1: {
				required: true
			},
//			safer2: {
//				required: true
//			},
			legalperson: {
				required: true
			},
			recordcontent: {
				required: true
			},
			proxysign: {
				required: true
			},
//			emceesign: {
//				required: true
//			},
//			clerksign: {
//				required: true
//			},
			docdate: {
				required: true
			}
		},
		messages: {
			casename:{
				required: "请输入内容"
			},
			hearorg: {
				required: "请输入内容"
			},
//			hearingaddr: {
//				required: "请输入内容"
//			},
			starttime: {
				required: "请输入日期"
			},
			endtime: {
				required: "请输入日期"
			},
			emcee: {
				required:  "请输入内容"
			},
			hear1: {
				required:  "请输入内容"
			},
//			hear2: {
//				required:  "请输入内容"
//			},
			clerk: {
				required:  "请输入内容"
			},
			safer1: {
				required:  "请输入内容"
			},
//			safer2: {
//				required:  "请输入内容"
//			},
			legalperson: {
				required:  "请输入内容"
			},
			recordcontent: {
				required:  "请输入内容"
			},
			proxysign: {
				required:  "请输入内容"
			},
//			emceesign: {
//				required:  "请输入内容"
//			},
//			clerksign: {
//				required:  "请输入内容"
//			},
			docdate: {
				required: "请输入日期"
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
        "docid": $("#recordid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_hearrecord"
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
		url : BASE_URL+'/law/lawhearrecord/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#recordid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#recordid").val(json.docid);
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