var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	
	initializePage();
	var menupagetype=$('#menupagetype').val();
	initPage(menupagetype);//初始化界面
	
	$("#lawevidenceapprovalform").validate({
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),
		submitHandler:function(form){
		    removeAllDisabled();
            save();
            initPage(menupagetype);//初始化界面
	    }   
	});
});

function getRules(menupagetype){
    if(menupagetype=='menuEdit'){
        return {
            casename:{
                required: true,
                maxlength:42
            },
            //当事人及基本情况 
            clientinfo:{
                required: true
            },
            //案件基本情况
            caseinfo:{
                required: true
            },
            //证据名称及数量 	
           /* evidencename:{
                required: true,
                maxlength:150
            },
            //提请理由及依据 	
            reason:{
                required: true,
                maxlength:150
            },
            //保存方式
            savetype:{
                required: true,
                maxlength:21
            },*/
            //承办人意见： 
            directoradvice:{
                required: true,
                maxlength:85
            },
            //承办人 
            directorsign:{
                required: true,
                maxlength:5
            }
        };
    }else if(menupagetype=='menuAduit'){
        return {
        	//部门负责人意见
            depchargeadvice:{
                required: true,
                maxlength:85
            },
            //部门负责人签名
            depchargesign:{
                required: true,
                maxlength:5
            }
        };
    }else if(menupagetype=='menuApproval'){
        return {
            organschargeadvice:{
                required: true,
                maxlength:85
            },
            organschargesign:{
                required: true,
                maxlength:5
            }
        };
    }
}

function getMessages(menupagetype){
    if(menupagetype=='menuEdit'){
        return {
            casename:{
                required: "案件名称不能为空",
                maxlength:"案件名称长度不能超过42"
            },
            clientinfo:{
                required: "当事人及基本情况不能为空"
            },
            caseinfo:{
                required: "案件基本情况不能为空"
            },
            /*evidencename:{
                required: "证据名称及数量不能为空",
                maxlength:"证据名称及数量长度不能超过150"
            },
            reason:{
                required: "提请理由及依据不能为空",
                maxlength:"提请理由及依据长度不能超过150"
            },
            savetype:{
                required: "保存方式不能为空",
                maxlength:"保存方式长度不能超过21"
            },*/
            directoradvice:{
                required: "承办人意见不能为空",
                maxlength:"承办人意见长度不能超过85"
            },
            directorsign:{
                required: "承办人签名不能为空",
                maxlength:"承办人签名长度不能超过5"
            }
        };
    }else if(menupagetype=='menuAduit'){
         return { 
             depchargeadvice:{
                required: "部门负责人意见不能为空",
                maxlength:"部门负责人意见长度不能超过85"
            },
            depchargesign:{
                required: "负责人签名不能为空",
                maxlength:"负责人签名长度不能超过5"
            }
        };
    }else if(menupagetype=='menuApproval'){
        return {
            organschargeadvice:{
                required: "机关负责人意见不能为空",
                maxlength:"机关负责人意见长度不能超过85"
            },
            organschargesign:{
                required: "机关负责人签名不能为空",
                maxlength:"机关负责人签名长度不能超过5"
            }
        };
    }
}

//返回
$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});

function initPage(menupagetype){
    if(menupagetype=='menuEdit'){
        $('#depchargeadvice').attr("disabled",true);
        $('#depchargesign').attr("disabled",true);
        $('#depchargesigntime').attr("disabled",true);
        
        $('#organschargeadvice').attr("disabled",true);
        $('#organschargesign').attr("disabled",true);
        $('#organschargesigntime').attr("disabled",true);
    }else if(menupagetype=='menuAduit'){
        initDisplayPage();
        $('#depchargeadvice').removeAttr("disabled");
        $('#depchargesign').removeAttr("disabled");
        $('#depchargesigntime').removeAttr("disabled");
    }else if(menupagetype=='menuApproval'){
        initDisplayPage();
        $('#organschargeadvice').removeAttr("disabled");
        $('#organschargesign').removeAttr("disabled");
        $('#organschargesigntime').removeAttr("disabled");
    }else{
        $('#saveBtn').hide();
        initDisplayPage();
    }
}

/**
 * 替换页面元素
 */
function initializePage(){
	$("#directorsigntimediv").html(
			"<input class='underline' type='text' id='directorsigntime' name='directorsigntime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px' placeholder='   年   月  日'/>");
	$("#depchargesigntimediv").html(
			"<input class='underline' type='text' id='depchargesigntime' name='depchargesigntime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px' placeholder='   年   月  日'/>");
	$("#organschargesigntimediv").html(
			"<input class='underline' type='text' id='organschargesigntime' name='organschargesigntime' onfocus='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' class='underline' style='width:200px' placeholder='   年   月  日'/>");

	var directorsigntime_hidden = $("#directorsigntime_hidden").val();
	if(directorsigntime_hidden)
		$("#directorsigntime").val(formatCSTDate(directorsigntime_hidden,"yyyy-MM-dd"));
	
	var depchargesigntime_hidden = $("#depchargesigntime_hidden").val();
	if(depchargesigntime_hidden)
		$("#depchargesigntime").val(formatCSTDate(depchargesigntime_hidden,"yyyy-MM-dd"));
	
	var organschargesigntime_hidden = $("#organschargesigntime_hidden").val();
	if(organschargesigntime_hidden)
		$("#organschargesigntime").val(formatCSTDate(organschargesigntime_hidden,"yyyy-MM-dd"));
}

/** 保存 */
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawevidenceapproval/save',
		cache : false,
		dataType : 'json',
		data : $("#lawevidenceapprovalform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#approvalid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					window.location=BASE_URL +"/law/lawevidenceapproval/"+$('#menupagetype').val()+"/"+$("#checkinfoid").val()+"/"+$("#doccode").val();
				parent.toast(json.msg);// 弹出提示信息
//				parent.getActiveIFrame().reloadGrid();// 刷新列表
				parent.closeWin();// 关闭弹出框
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

$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawevidenceapprovalform").submit();
	}
});
function updateDocState(){
var doctype=($("#tabtype").val()=="0")?"law_evidence_approval0":"law_evidence_approval1";
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#approvalid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": doctype
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