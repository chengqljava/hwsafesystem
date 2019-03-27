var isDocSubmit=false;
var isSaved=false;
$(document).ready(function() {
	//日期格式字段转换
	setDateVal("docdate");
	
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
			behavior: {
				required: true
			},
			rule: {
				required: true
			},
			basis: {
				required: true
			},
			punish: {
				required: true
			},
			docdate: {
				required: true
			},
			safetyperson: {
				required: true
			},
			safetytel: {
				required: true,
				isTelephone:true
			},
			safetyzip: {
				isZipCode: true
			}
		},
		messages: {
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
			entname: {
				required: "请输入被处罚单位"
			},
			behavior: {
				required: "请输入违法行为"
			},
			rule: {
				required: "请输入违法规定"
			},
			basis: {
				required: "请输入法律依据"
			},
			punish: {
				required: "请输入行政处罚内容"
			},
			docdate: {
				required: "请输入文书日期"
			},
			safetyperson: {
				required: "请输入联系人"
			},
			safetytel: {
				required: "请输入联系电话"
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
        "docid": $("#noticeid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_punishnotice"
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
		url : BASE_URL+'/law/lawpunishnotice/save',
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
var setDateVal = function(dateStrEleId){
	var docDateStr = $("#" + dateStrEleId).val();
	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
		var docDate = new Date(docDateStr);
		$("#" + dateStrEleId).val(docDate.getFullYear() + "-" + (docDate.getMonth() + 1) + "-" + docDate.getDate());
	}
}