$(document).ready(function() {
	
	initializePage();
	
	var caseState=$("#casestate", parent.document).val();
	if(caseState=='4'||caseState=='5'){
		$('#reportBtn').hide();
		$('#opinionBtn').hide();
		$('#endBtn').hide();
		$('#submitBtn').hide();
	}
	
	var menupagetype = $("#menupagetype").val();
	initPage(menupagetype);//初始化界面
	$("#lawdelaypayapplyform").validate({
		rules: getRules(menupagetype),
		messages: getMessage(menupagetype),
		submitHandler:function(form){
			removeAllDisabled();
	    	save();
			initPage(menupagetype);//初始化界面
	    }   
	});
	
	//结束流程
	$("#endBtn").click(function(){
		if(parent.confirm("是否确认结束流程？")){
			$.ajax({
				type : 'post',
				url : BASE_URL+'/law/lawcaseaudit/endProcess?processId='+$("#processId").val(),
				cache : false,
				dataType : 'json',
				global : false,
				success : function(json) {
					if(json.success==true){
						parent.parent.toast(json.msg);//弹出提示信息
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					}else{
						parent.toast(json.msg);
					}
				},
				error : function() {
					parent.toast("流程结束失败");
				}
			});
		}
	});
	
	//流程意见查看
	$("#opinionBtn").click(function(){
		parent.openWin(BASE_URL + '/law/lawtodo/opinionList?processId='+$("#processId").val(), '流程查看',null,"80%","70%");
	});
	
	
});

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});


/**保存*/
function save(){	
	var menupagetype = $("#menupagetype").val();
	var doccode = $("#doccode").val();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawdelaypayapply/save',
		cache : false,
		dataType : 'json',
		data : $("#lawdelaypayapplyform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				if(json.audittype==true){//如果是提交，跳转到选领导页面
					var auditid = json.auditid;
					parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%",null,
							function(){
						parent.$("#contentIframe").attr("src",BASE_URL +"/law/lawdelaypayapply/edit/"+menupagetype+"/"+$("#checkinfoid").val()+"/"+doccode);
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					});
//					parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%");
				}else{//保存页面
					window.location=BASE_URL +"/law/lawdelaypayapply/"+$('#menupagetype').val()+"/"+$("#checkinfoid").val()+"/"+$("#doccode").val();
					parent.parent.toast(json.msg);//弹出提示信息
					parent.parent.getActiveIFrame().reloadGrid();//重新加载
					parent.parent.closeWin();// 关闭弹出框
					
				}
				$("#reportBtn").hide();
				$("#saveBtn").hide();
				$("#submitBtn").hide();
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
	if($("#delaypayapplyid").val() == ""){
//		$("#docyear").val(new Date().getFullYear());
	}
	else {
		
		setDateVal("handletime");
		setDateVal("auditdate");
		setDateVal("approvaldate");
	}
	
}

var setDateVal = function(dateStrEleId){
	var docDateStr = $("#" + dateStrEleId).val();
	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
		var docDate = new Date(docDateStr);
		$("#" + dateStrEleId).val(docDate.getFullYear() + "年" + (docDate.getMonth() + 1) + "月" + docDate.getDate() + "日");
	}
}


function initPage(menupagetype){
    if(menupagetype=='menuEdit'){
    	
        $('#auditdescription').attr("disabled",true);
        $('#auditperson').attr("disabled",true);
        $('#auditdate').attr("disabled",true);
        
        $('#approvaldescription').attr("disabled",true);
        $('#approvalperson').attr("disabled",true);
        $('#approvaldate').attr("disabled",true);
    }else if(menupagetype=='menuAduit'){
        initDisplayPage();
        $('#auditdescription').removeAttr("disabled");
        $('#auditperson').removeAttr("disabled");
        $('#auditdate').removeAttr("disabled");
    }else if(menupagetype=='menuApproval'){
        initDisplayPage();
        $('#approvaldescription').removeAttr("disabled");
        $('#approvalperson').removeAttr("disabled");
        $('#approvaldate').removeAttr("disabled");
    }else{
        $('#saveBtn').hide();
//        initDisplayPage();
    }
}

var getRules = function getRules(menupagetype){
	if(menupagetype == 'menuEdit'){
		return {
			applydescription : {
				required : true,
				maxlength : 250
			},
			responseperson : {
				required : true,
				maxlength : 16
			},
			handletime : {
				required : true
			},
			handledescription : {
				required : true,
				maxlength : 500
			}
		}
	}else if(menupagetype == 'menuAduit'){
		return {
			auditdescription : {
				required : true,
				maxlength : 250
			},
			auditperson : {
				required : true,
				maxlength : 16
			},
			auditdate : {
				required : true
			}
		}
	}else if(menupagetype=='menuApproval'){
		return {
			approvaldescription : {
				required : true,
				maxlength : 250
			},
			approvalperson : {
				required : true,
				maxlength : 16
			},
			approvaldate : {
				required : true
			}
		}
	}
};

var getMessage = function getMessage(menupagetype){
	if(menupagetype=='menuEdit'){
		return {
			applydescription : {
				required : "申请说明不能为空",
				maxlength : "长度不能超过250"
			},
			responseperson : {
				required : "承办人不能为空",
				maxlength : "长度不能超过16"
			},
			handletime : {
				required : "受理时间不能为空"
			},
			handledescription : {
				required : "受理说明不能为空",
				maxlength : "长度不能超过250"
			}
		}
	}else if(menupagetype=='menuAduit'){
		return {
			auditdescription : {
				required : "审核意见不能为空",
				maxlength : "长度不能超过250"
			},
			auditperson : {
				required : "审核人不能为空",
				maxlength : "长度不能超过16"
			},
			auditdate : {
				required : "审核时间不能为空"
			}
		}
	}else if(menupagetype=='menuApproval'){
		return {
			approvaldescription : {
				required : "审批意见不能为空",
				maxlength : "长度不能超过250"
			},
			approvalperson : {
				required : "审批人不能为空",
				maxlength : "长度不能超过16"
			},
			approvaldate : {
				required : "审批时间不能为空"
			}
		}
	}
}


$("#reportBtn").click(function(){
	//立案审批id
	var auditid = $("#delaypayapplyid").val();
	var menupagetype = $("#menupagetype").val();
	//给casetype赋值
	$("#casetype").val("submitcase");
	var doccode = $("#doccode").val();
	if(auditid==null||auditid==""){
		$("#lawdelaypayapplyform").submit();
	}else{
		$("#reportBtn").hide();
		parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%",null,
				function(){
			$("#reportBtn").show();
		});
//		parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%");
	}
});

//退回到发起人后再次提交页面lawDelaypayapplyNoDisplay.vm提交控制
$("#submitBtn").click(function(){
	//给casetype赋值
	$("#casetype").val("submitcase");
});

