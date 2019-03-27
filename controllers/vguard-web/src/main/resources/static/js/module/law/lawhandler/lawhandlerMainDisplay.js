$(document).ready(function() {
	//为日期字段赋值
	var undertaketime_hidden = $("#undertaketime_hidden").val();
	if(undertaketime_hidden) {
		$("#undertaketime").val(undertaketime_hidden);
	}
	var aduittime_hidden = $("#aduittime_hidden").val();
	if(aduittime_hidden) {
		$("#aduittime").val(aduittime_hidden);
	}
	var approvaltime_hidden = $("#approvaltime_hidden").val();
	if(approvaltime_hidden) {
		$("#approvaltime").val(approvaltime_hidden);
	}
	
	//性别
	SelectOption.loadSex("sex");
	var menupagetype=$('#menupagetype').val();
	var rules={};
	var messages={};
	initPage(menupagetype);//初始化界面
	
	var caseState=$("#casestate", parent.document).val();
	if(caseState=='4'||caseState=='5'){
		$('#reportBtn').hide();
		$('#opinionBtn').hide();
		$('#endBtn').hide();
		$('#submitBtn').hide();
	}
	
	$("#myform").validate({
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),
		submitHandler:function(form){
			removeAllDisabled();
		   	save(menupagetype);
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

function initPage(menupagetype){
	if(menupagetype=='menuEdit'){
		$('#aduitadv').attr("disabled",true);
		$('#aduit').attr("disabled",true);
		$('#aduittime').attr("disabled",true);
		$('#approvaladv').attr("disabled",true);
		$('#approval').attr("disabled",true);
		$('#approvaltime').attr("disabled",true);
	}else if(menupagetype=='menuAduit'){
		initDisplayPage();
		$('#aduitadv').removeAttr("disabled");
		$('#aduit').removeAttr("disabled");
		$('#aduittime').removeAttr("disabled");
	}else if(menupagetype=='menuApproval'){
		initDisplayPage();
		$('#approvaladv').removeAttr("disabled");
		$('#approval').removeAttr("disabled");
		$('#approvaltime').removeAttr("disabled");
	}else{
		$('#saveBtn').hide();
//		initDisplayPage();
	}
}

/*保存(新增或编辑)*/
function save(menupagetype){
//	var auditid = $("#handlerid").val();
	var menupagetype = $("#menupagetype").val();
	var doccode = $("#doccode").val();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawhandler/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			initPage(menupagetype);
			if(json.success==true){
				if(json.audittype==true){//如果是提交，跳转到选领导页面
					var auditid = json.auditid;
					parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%",null,
							function(){
						parent.$("#contentIframe").attr("src",BASE_URL +"/law/lawhandler/"+menupagetype+"/"+$("#checkinfoid").val()+"/"+doccode);
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					});
//					parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%");
//					$("#reportBtn").hide();
//					$("#saveBtn").hide();
//					$("#submitBtn").hide();
				}else{//保存页面
/*					parent.parent.toast(json.msg);//弹出提示信息
					parent.parent.getActiveIFrame().reloadGrid();//重新加载*/		
					window.location=BASE_URL +"/law/lawhandler/"+menupagetype+"/"+$("#checkinfoid").val()+"/"+doccode;
					parent.parent.toast(json.msg);//弹出提示信息
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
			entname: {
				required: true
			},
			entaddr: {
				required: true
			},
			legalperson: {
				required: true
			},
			topunish: {
				required: true
			},
			age: {
				isDigits:true
			},
			company: {
				required: true
			},
			companyaddr: {
				required: true
			},
			tel: {
				required: true,
				isTelephone:true
			},
			punishnotes: {
				required: true
			},
			pleadadv: {
				required: true
			},
			undertakeadv: {
				required: true
			},
			undertake1: {
				required: true
			},
			undertake2: {
				required: true
			},
			undertaketime: {
				required: true
			}
		 }
		}else if(menupagetype=='menuAduit'){
			return {
				aduitadv: {
					required: true
				},
				aduit: {
					required: true
				},
				aduittime: {
					required: true
				}
			}
		}else if(menupagetype=='menuApproval'){
			return {
				approvaladv: {
					required: true
				},
				approval: {
					required: true
				},
				approvaltime: {
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
				entname: {
					required: "请输入被处罚单位"
				},
				entaddr: {
					required: "请输入地址"
				},
				legalperson: {
					required: "请输入法人"
				},
				topunish: {
					required: "请输入被处罚人"
				},
				age: {
					isDigits:"请输入年龄"
				},
				company: {
					required: "请输入所在单位"
				},
				companyaddr: {
					required: "请输入单位地址"
				},
				tel: {
					required: "请输入联系电话"
				},
				punishnotes: {
					required: "请输入违法事实及处罚依据"
				},
				pleadadv: {
					required: "请输入当事人的申辩意见"
				},
				undertakeadv: {
					required: "请输入承办人意见"
				},
				undertake1: {
					required: "请输入承办人1"
				},
				undertake2: {
					required: "请输入承办人2"
				},
				undertaketime: {
					required: "请输入承办日期"
				}
			}
		}else if(menupagetype=='menuAduit'){
			return {
				aduitadv: {
					required: "请输入审核意见"
				},
				aduit: {
					required: "请输入审核人"
				},
				aduittime: {
					required: "请输入审核日期"
				}
			}
		}else if(menupagetype=='menuApproval'){
			return {
				approvaladv: {
					required: "请输入审批意见"
				},
				approval: {
					required: "请输入审批人"
				},
				approvaltime: {
					required: "请输入审批日期"
				}
			}
		}
}

$("#reportBtn").click(function(){
	//立案审批id
	var auditid = $("#handlerid").val();
	var menupagetype = $("#menupagetype").val();
	//给casetype赋值
	$("#casetype").val("submitcase");
	var doccode = $("#doccode").val();
	if(auditid==null||auditid==""){
		$("#myform").submit();
	}else{
		$("#reportBtn").hide();
		parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%",null,
				function(){
			$("#reportBtn").show();
		});
//		parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%");
	}
});

//退回到发起人后再次提交页面lawcaseauditNoDisplay.vm提交控制
$("#submitBtn").click(function(){
	//给casetype赋值
	$("#casetype").val("submitcase");
});


