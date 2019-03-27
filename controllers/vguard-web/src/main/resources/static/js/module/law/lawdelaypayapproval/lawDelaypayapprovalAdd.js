var isDocSubmit=false;
var isSaved=false;



$(document).ready(function() {
	
	initializePage();
    
    //延期缴纳日期不能为空
    jQuery.validator.addMethod("delaydateNotNull", function(value, element) {  
        var checkflag = false;
        if($("input[name='approvaltype']:checked").val()=="0"){//延期
           if($("#delaydate").val()){//不为空字符串
               checkflag = true;//验证通过
           }else{
                checkflag = false;
           }
        }else{
            checkflag = true;
        }
        return checkflag;    
    }, "延期缴纳日期不能为空");
    
    // 期数不能为空
    jQuery.validator.addMethod("dividenumNotNull", function(value, element) {  
        var checkflag = false;
        if($("input[name='approvaltype']:checked").val()=="1"){//分期
           if($("#dividenum").val()){//不为空字符串
               checkflag = true;//验证通过
           }else{
                checkflag = false;
           }
        }else{
            checkflag = true;
        }
        return checkflag;    
    }, "期数不能为空");
    
    // 分期日期不能为空
    jQuery.validator.addMethod("dividedateNotNull", function(value, element) {  
        var checkflag = false;
        if($("input[name='approvaltype']:checked").val()=="1"){//分期
           if($("#dividedate").val()){//不为空字符串
               checkflag = true;//验证通过
           }else{
               checkflag = false;
           }
        }else{
            checkflag = true;
        }
        return checkflag;    
    }, "分期日期不能为空");
    
    
    // 罚款金额为空
    jQuery.validator.addMethod("finesNotNull", function(value, element) {  
        var checkflag = false;
        if($("input[name='approvaltype']:checked").val()=="1"){//分期
           if($("#fines").val()){//不为空字符串
               checkflag = true;//验证通过
           }else{
               checkflag = false;
           }
        }else{
            checkflag = true;
        }
        return checkflag;    
    }, "罚款金额为空");
    
    // 剩余罚款金额为空
    jQuery.validator.addMethod("remainfinesNotNull", function(value, element) {  
        var checkflag = false;
        if($("input[name='approvaltype']:checked").val()=="1"){//分期
           if($("#remainfines").val()){//不为空字符串
               checkflag = true;//验证通过
           }else{
               checkflag = false;
           }
        }else{
            checkflag = true;
        }
        return checkflag;    
    }, "剩余罚款金额为空");
    
    
	$("#lawdelaypayapprovalform").validate({
		rules: {
			docarea : {
				required: true,
				maxlength: 2
			},
			docyear:{
				required: true,
				maxlength: 4,
				isDigits:true
			},
			docnum:{
				required: true,
				maxlength: 3,
				isDigits:true
			},
			delaydate : {
				delaydateNotNull : true
			},
			docdate : {
				required : true
			},
			dividenum:{
			    dividenumNotNull:true,
			    isDigits:true
			},
			dividedate:{
			    dividedateNotNull:true
			},
			fines:{
			    finesNotNull:true
			},
			remainfines:{
			    remainfinesNotNull:true
			}
		},
		messages: {
			docarea:{
				required : "区域不能为空"
			},
			docyear:{
				required : "年份不能为空"
			},
			docnum:{
				required : "编号不能为空"
			},
			docdate : {
				required : "文书日期不能为空",
				isDigits:"只能输入整数"
			},
			dividenum:{
			    dividenumNotNull:"期数不能为空",
			    isDigits:"只能输入整数"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

function change(object){
   if($(object).val() == 1){
       //分期 将延期值 都置空
       $("#delaydate").val("");
   }else{
       //延期 将分期值都置空
       $("#dividenum").val("");
       $("#dividedate").val("");
       $("#fines").val("");
       $("#remainfines").val("");
   }
};

$("#backBtn").bind("click",function(){
	parent.parent.closeWin();// 关闭弹出框
});


$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawdelaypayapprovalform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#delaypayapprovalid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_delaypayapproval"
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

/**保存*/
function save(){
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawdelaypayapproval/save',
		cache : false,
		dataType : 'json',
		data : $("#lawdelaypayapprovalform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#delaypayapprovalid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#delaypayapprovalid").val(json.docid);
					}
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//刷新列表
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

//初始化页面
function initializePage(){
	
	if($("#delaypayapprovalid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
//		$("#docarea").val("乐五");
	}
	else {
		setDateVal("docdate");
		setDateVal("delaydate");
		setDateVal("dividedate");
	}
	setDateVal("punishdocdate");
}

var setDateVal = function(dateStrEleId){
	var docDateStr = $("#" + dateStrEleId).val();
	if(docDateStr != null && docDateStr != "" && docDateStr != undefined) {
		var docDate = new Date(docDateStr);
		$("#" + dateStrEleId).val(docDate.getFullYear() + "年" + (docDate.getMonth() + 1) + "月" + docDate.getDate() + "日");
	};
};

