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
	$("#lawcasetransauditform").validate({
		rules : getRules(menupagetype),
		messages : getMessage(menupagetype),
		submitHandler:function(form){
			removeAllDisabled();
	    	save();
			initPage(menupagetype);//初始化界面
	    }   
	});
	
	
	//结束流程
	$("#endBtn").click(function(){
		parent.confirm("是否确认结束流程？",function(){
			$.ajax({
				type : 'post',
				url : BASE_URL+'/law/lawcaseaudit/endProcess?processId='+$("#processId").val(),
				cache : false,
				dataType : 'json',
				global : false,
				success : function(json) {
					if(json.success==true){
						parent.parent.toast(json.msg);//弹出提示信息
						$("#endBtn").hide();//隐藏结束流程按钮
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					}else{
						parent.toast(json.msg);
					}
				},
				error : function() {
					parent.toast("流程结束失败");
				}
			});
		});
			
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
	//立案审批id
//	var auditid = $("#auditid").val();
	var menupagetype = $("#menupagetype").val();
	var doccode = $("#doccode").val();
	var test = $("#lawcasetransauditform").serializeArray();
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawcasetransaudit/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcasetransauditform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				if(json.audittype==true){//如果是提交，跳转到选领导页面
					var auditid = json.auditid;
					$('#reportBtn').hide();
					$('#saveBtn').hide();
					
					
					parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%",
							null,function(){
						parent.$("#contentIframe").attr("src",BASE_URL+'/law/lawcasetransaudit/edit/'+$('#menupagetype').val()+'/'+$('#checkinfoid').val()+'/'+$('#doccode').val());
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					});
				}else{//保存页面
					parent.parent.toast(json.msg);//弹出提示信息
					parent.parent.getActiveIFrame().reloadGrid();//重新加载
					//parent.parent.closeWin();// 关闭弹出框
					
				}
				
				$('#auditid').val(json.auditid);
				/*$("#reportBtn").hide();
				$("#saveBtn").hide();
				$("#submitBtn").hide();*/
			}
			else{
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
	if($("#punishid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	} else {
		setDateVal("handledate");
		setDateVal("audittime");
		setDateVal("approvaldate");
		
		// 缴费方式: 0-现场 1-15日内缴费
		if($.trim($("#paytype").val()) != "" || $("#paytype").val() != undefined || $("#paytype").val() != null){
			$("input[name=paytypeSel], input[value="+ $("#paytype").val() +"]").attr("checked", true);
		}
	}
}

var setDateVal = function(dateStrEleId){
	var docDateStr = $("#" + dateStrEleId).val();
	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
		var docDate = new Date(docDateStr);
		$("#" + dateStrEleId).val(docDate.getFullYear() + "-" + (docDate.getMonth() + 1) + "-" + docDate.getDate());
	}
}

var getRules = function getRules(menupagetype){
	if(menupagetype=='menuEdit'){
		return {
			casename : {
				required : true,
				maxlength : 50
			},
			party : {
				required : true,
				maxlength : 16
			},
//			address : {
//				required : true,
//				maxlength : 100
//			},
			transferorgan : {
				required : true,
				maxlength : 50
			},
			casedescription : {
				required : true,
				maxlength : 250
			},
			transferreason : {
				required : true,
				maxlength : 250
			},
			handleperson : {
				required : true,
				maxlength : 16
			},
			handledescription : {
				required : true,
				maxlength : 250
			},
			handledate : {
				required : true
			}
		}
	}else if(menupagetype=='menuAduit'){
		return {
			departmentmanager : {
				required : true,
				maxlength : 16
			},
			auditdescription : {
				required : true,
				maxlength : 250
			},
			audittime : {
				required : true
			}
		}
	}else if(menupagetype=='menuApproval'){
		return {
			organresponseperson : {
				required : true,
				maxlength : 16
			},
			approvaldescription : {
				required : true,
				maxlength : 250
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
			casename : {
				required : "案件名称不能为空",
				maxlength : "长度不能超过"
			},
			party : {
				required : "当事人不能为空",
				maxlength : "长度不能超过16"
			},
			address : {
				required : "地址不能为空",
				maxlength : "长度不能超过100"
			},
			transferorgan : {
				required : "移送机关不能为空",
				maxlength : "长度不能超过50"
			},
			casedescription : {
				required : "不能为空",
				maxlength : "案情简介长度不能超过250"
			},
			transferreason : {
				required : "不能为空",
				maxlength : "长度不能超过250"
			},
			handleperson : {
				required : "承办人不能为空",
				maxlength : "长度不能超过16"
			},
			handledescription : {
				required : "承办意见不能为空",
				maxlength : "长度不能超过250"
			},
			handledate : {
				required : "承办时间不能为空"
			}
		}
	}else if(menupagetype=='menuAduit'){
		return {
			departmentmanager : {
				required : "部门负责人不能为空",
				maxlength : "长度不能超过16"
			},
			auditdescription : {
				required : "审核意见不能为空",
				maxlength : "长度不能超过250"
			},
			audittime : {
				required : "审核时间不能为空"
			}
		}
	}else if(menupagetype=='menuApproval'){
		return {
			organresponseperson : {
				required : "机关负责人不能为空",
				maxlength : "长度不能超过16"
			},
			approvaldescription : {
				required : "审批意见不能为空",
				maxlength : "长度不能超过250"
			},
			approvaldate : {
				required : "审批时间不能为空"
			}
		}
	}
}

function initPage(menupagetype){
    if(menupagetype=='menuEdit'){
    	
        $('#departmentmanager').attr("disabled",true);
        $('#auditdescription').attr("disabled",true);
        $('#audittime').attr("disabled",true);
        
        $('#organresponseperson').attr("disabled",true);
        $('#approvaldescription').attr("disabled",true);
        $('#approvaldate').attr("disabled",true);
    }else if(menupagetype=='menuAduit'){
        initDisplayPage();
        $('#organresponseperson').removeAttr("disabled");
        $('#approvaldescription').removeAttr("disabled");
        $('#approvaldate').removeAttr("disabled");
    }else if(menupagetype=='menuApproval'){
        initDisplayPage();
        $('#organresponseperson').removeAttr("disabled");
        $('#approvaldescription').removeAttr("disabled");
        $('#approvaldate').removeAttr("disabled");
    }else{
        $('#saveBtn').hide();
//        initDisplayPage();
    }
}


$("#reportBtn").click(function(){
	//立案审批id
	var auditid = $("#auditid").val();
	var menupagetype = $("#menupagetype").val();
	//给casetype赋值
	$("#casetype").val("submitcase");
	var doccode = $("#doccode").val();
	if(auditid==null||auditid==""){
		$("#lawcasetransauditform").submit();
	}else{
		save();
//		parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%");
	}
});

//退回到发起人后再次提交页面lawcaseauditNoDisplay.vm提交控制
$("#submitBtn").click(function(){
	//给casetype赋值
	$("#casetype").val("submitcase");
});


