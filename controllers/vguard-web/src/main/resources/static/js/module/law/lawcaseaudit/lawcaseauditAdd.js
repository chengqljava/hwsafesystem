$(document).ready(function() {
	initializePage();
	
	var caseState=$("#casestate", parent.document).val();
	if(caseState=='4'||caseState=='5'){
		$('#reportBtn').hide();
		$('#opinionBtn').hide();
		$('#endBtn').hide();
		$('#submitBtn').hide();
	}
	
	//执法人员1下拉框
	SelectOption.loadSysUser("username1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("username2",{"jobtype": null,"usertype": "GOV"});
	
	window.setTimeout(function(){
		$("#undercode1").val($("#username1 option:selected").attr("attr"));
		$("#undercode2").val($("#username2 option:selected").attr("attr"));
	},1000);
	$("#username1").change(function(){
		$("#undercode1").val($("#username1 option:selected").attr("attr"));
	});
	$("#username2").change(function(){
		$("#undercode2").val($("#username2 option:selected").attr("attr"));
	});
	//去除主办与协办重复人员，并级联加载协办安监员
	$("#username1").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username2 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	$("#username2").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username1 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	var menupagetype=$('#menupagetype').val();
	//立案审批id
	var auditid = $("auditid").val();
	var rules={};
	var messages={};
	initPage(menupagetype);//初始化界面
	
	
	$("#lawcaseauditform").validate({
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),
		submitHandler:function(form){
//			removeAllDisabled();
			$('#undertaker1').val($("#username1 option:selected").val());
			$('#undertaker2').val($("#username2 option:selected").val());
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
						$("#endBtn").hide();
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

function initPage(menupagetype){
	if(menupagetype=='menuEdit'){
		$('#checkopinion').attr("disabled",true);
		$('#auditopinion').attr("disabled",true);
		$('#checkname').attr("disabled",true);
		$('#auditname').attr("disabled",true);
		$('#checkdate').attr("disabled",true);
		$('#auditdate').attr("disabled",true);
	}else if(menupagetype=='menuAduit'){
		initDisplayPage();
		$('#checkopinion').removeAttr("disabled");
		$('#checkname').removeAttr("disabled");
		$('#checkdate').removeAttr("disabled");
	}else if(menupagetype=='menuApproval'){
		initDisplayPage();
		$('#auditopinion').removeAttr("disabled");
		$('#auditname').removeAttr("disabled");
		$('#auditdate').removeAttr("disabled");
	}else{
		$('#saveBtn').hide();
//		initDisplayPage();
	}
}

function getRules(menupagetype){
	if(menupagetype=='menuEdit'){
		 return {
			 casereason: {
					required: true,
				},
				casesource: {
					required: true
				},
				casedate: {
					required: true
				},
				casename: {
					required: true
				},
				/*party: {
					required: true
				},
				tel: {
					required: true,
					isTelephone: true
				},
				partycon: {
					required: true
				},
				partyaddress: {
					required: true
				},
				casecon: {
					required: true
				},
				underopinion: {
					required: true
				},*/
				username1: {
					required: true
				},
				username2: {
					required: true
				},
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
				underdate: {
					required: true
				},
				postcode: {
					isZipCode: true
				},
				casesource: {
					required: true
				}
		 }
		}else if(menupagetype=='menuAduit'){
			return {
				checkopinion: {
					required: true
				},
				checkname: {
					required: true
				},
				checkdate: {
					required: true
				}
			}
		}else if(menupagetype=='menuApproval'){
			return {
				auditopinion: {
					required: true
				},			
				auditname :{
					required: true
				},
				auditdate: {
					required: true
				}
			}
		}
}

function getMessages(menupagetype){
	if(menupagetype=='menuEdit'){
		 return {
			 casereason: {
					required: "案由不能为空"
				},
				casesource: {
					required: "案件来源不能为空"
				},
				casedate: {
					required: "时间不能为空"
				},
				casename: {
					required: "案件名称不能为空"
				},
				/*party: {
					required: "当事人不能为空"
				},
				tel: {
					required: "电话不能为空"
				},
				partycon: {
					required: "当事人基本情况不能为空"
				},
				partyaddress: {
					required: "当事人地址不能为空"
				},
				casecon: {
					required: "案件基本情况不能为空"
				},
				underopinion: {
					required: "承办人意见不能为空"
				},*/
				username1: {
					required: "主办承办人不能为空"
				},
				username2: {
					required: "协办承办人不能为空"
				},
				docarea: {
					required: "区域不能为空"
				},
				docyear: {
					required: "年份不能为空"
				},
				docnum: {
					required: "编号不能为空"
				},
				underdate: {
					required: "时间不能为空"
				},
				casesource: {
					required: "案件来源不能为空"
				},
				checkopinion: {
					required: "审核意见不能为空"
				},
				auditopinion: {
					required: "审批意见不能为空"
				},
				checkname: {
					required: "审核人不能为空"
				},
				auditname: {
					required: "审批人不能为空"
				},
				checkdate: {
					required: "审核时间不能为空"
				},
				auditdate: {
					required: "审批时间不能为空"
				}
			}
		}else if(menupagetype=='menuAduit'){
			return {
				checkopinion: {
					required: "审核意见不能为空"
				},
				checkname: {
					required: "审核人不能为空"
				},
				checkdate: {
					required: "审核时间不能为空"
				}
			}
		}else if(menupagetype=='menuApproval'){
			return {
				auditopinion: {
					required: "审批意见不能为空"
				},
				auditname: {
					required: "审批人不能为空"
				},
				auditdate: {
					required: "审批时间不能为空"
				}
			}
		}
}



/*保存(新增或编辑)*/
function save(){
	var paraArr = $("#lawcaseauditform").serializeArray(),
		caseId = $("#caseid", parent.document).val();
	if (paraArr && caseId) {
		paraArr.push({"name": "caseid", "value": caseId});
	}
	
//	var auditid = $("#auditid").val();
	var menupagetype = $("#menupagetype").val();
	var doccode = $("#doccode").val();
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawcaseaudit/save',
		cache : false,
		dataType : 'json',
		data : paraArr,
		global : false,
		success : function(json) {
			if(json.success==true){
				var auditid = json.auditid;
				$("#auditid").val(auditid);
				if(json.audittype==true){//如果是提交，跳转到选领导页面
					updateDocState();
					parent.openWinWithCloseCallback(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"30%","40%",null,
							function(){
						parent.$("#contentIframe").attr("src",BASE_URL+'/law/lawcaseaudit/'+$('#menupagetype').val()+'/'+$('#checkinfoid').val()+'/'+$('#doccode').val());
						parent.parent.getActiveIFrame().reloadGrid();//重新加载
					});
				}else{//保存页面
					parent.parent.toast(json.msg);//弹出提示信息
					parent.parent.getActiveIFrame().reloadGrid();//重新加载
					//parent.parent.closeWin();// 关闭弹出框
					
				}
				/*$("#reportBtn").hide();
				$("#saveBtn").hide();
				$("#submitBtn").hide();*/
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}


$("#reportBtn").click(function(){
	//立案审批id
	var auditid = $("#auditid").val();
	var menupagetype = $("#menupagetype").val();
	//给casetype赋值
	$("#casetype").val("submitcase");
	var doccode = $("#doccode").val();
	if(auditid==null||auditid==""){
		$("#lawcaseauditform").submit();
		
		
	}else{
		updateDocState();
		save();
//		parent.openWin(BASE_URL + '/law/lawtodo/findleader?auditid='+auditid+"&menupagetype="+menupagetype+"&doccode="+doccode, '文书提交',null,"60%","50%");
	}
});


//退回到发起人后再次提交页面lawcaseauditNoDisplay.vm提交控制
$("#submitBtn").click(function(){
	//给casetype赋值
	$("#casetype").val("submitcase");
});

function validateContent(menupagetype,auditid){
	$("#lawcaseauditform").validate({
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),
		submitHandler:function(form){
			removeAllDisabled();
			$('#undertaker1').val($("#username1 option:selected").val());
			$('#undertaker2').val($("#username2 option:selected").val());
			submit(auditid);
		   	initPage(menupagetype);//初始化界面
	    }
	});
}




/*提交*/
function submit(id){
	if(id==null||id==""){
		save();
	}else{
		parent.openWin(BASE_URL + '/law/lawtodo/findleader', '文书提交',null,"20%","30%");
	}
}



/**
 * 替换页面元素
 */
function initializePage(){
	//取value
	var casesource = $("#casesource").val();
	var casedate = $("#casedate").val();
	//替换页面元素
	$("#casesourceDiv").html("<select name='casesource' id='casesource' class='underline' style='width:420px'>" +
			"<option value=''>请选择</option>" +
		    "<option value='巡查检查'>巡查检查</option>" +
		    "<option value='上级督办'>上级督办</option>" +
		    "<option value='部门移送'>部门移送</option>" +
		    "<option value='事故案件'>事故案件</option>" +
		    "<option value='举报投诉'>举报投诉</option>" +
		    "<option value='媒体爆光'>媒体爆光</option>" +
		    "<option value='分局上报'>分局上报</option>" +
		    "<option value='其他'>其他</option>" +
				"</select>");
	//给替换的元素赋值
	if(casesource)
		$("#casesource option[value='"+casesource+"']").attr("selected", true);
	if(casedate)
		$("#casedate").val(formatCSTDate(casedate, "yyyy-MM-dd"));
}
$("#backBtn").bind("click",function(){
    parent.parent.closeWin();// 关闭弹出框
});

/**
 * 提交更新文书状态
 */
function updateDocState()
{
    $.ajax({
        type: 'post',
        url: BASE_URL + '/law/lawdocstate/updateDocState',
        cache: false,
        dataType: 'json',
        data: {
            "docid": $("#auditid").val(),
            "checkinfoid": $("#checkinfoid").val(),
            "doctype": "law_caseaudit"
        },
        global: false,
        async: true,
        success: function (json) {

        },
        error: function () {
          //  parent.parent.toast("网络异常");
        }
    });
}

/**
 * 文书提交
 * @param id
 */
/*function submitBtn(id){
	submit(id);
	if(id==null||id==""){
		openWin(BASE_URL + '/law/lawtodo/findleader', '文书提交',null,"20%","30%");
	}else{
		openWin(BASE_URL + '/law/lawtodo/findbyleader?auditid=' + id, '文书提交',null,"20%","30%");
	}
}*/
