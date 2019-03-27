var isDocSubmit=false;
var isSaved=false;


$(document).ready(function() {
    initializePage();
	$("#lawcasetransferform").validate({
		rules: {
				docarea:{
					required: true,
					maxlength:5
				},
				docyear:{
					required: true,
					maxlength:4,
					isDigits:true
				},
				docnum:{
					required: true,
					maxlength:8,
					isDigits:true
				},
				reason:{
					required: true,
					maxlength:200
				},
				lawcontent:{
					required: true
				},
				casefile:{
					required: true,
					maxlength:200
				},
				casefilecount:{
					required: true,
					maxlength:8,
					isDigits:true
				},
				casefilepage:{
					required: true,
					maxlength:8,
					isDigits:true
				},
				createtime:{
					required: true
				}
		},
		messages: {
			docarea:{
				required: "文书区域不能为空",
				maxlength:"文书区域长度不能超过5"
			},
			docyear:{
				required: "文书年份不能为空",
				maxlength:"文书年份长度不能超过4",
				isDigits:"只能输入数字"
			},
			docnum:{
				required: "文书编号不能为空",
				maxlength:"文书编号长度不能超过8",
				isDigits:"只能输入数字"
			},
			reason:{
				required: "移送原因不能为空",
				maxlength:"移送原因长度不能超过200"
			},
			lawcontent:{
				required: "法律规定不能为空"
			},
			casefile:{
				required: "案件材料不能为空",
				maxlength:"案件材料长度不能超过200"
			},
			casefilecount:{
				required: "材料份数不能为空",
				maxlength:"材料份数长度不能超过8",
				isDigits:"只能输入数字"
			},
			casefilepage:{
				required: "材料页数不能为空",
				maxlength:"材料页数长度不能超过8",
				isDigits:"只能输入数字"
			},
			createtime:{
				required: "文书日期不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});
/**
 *返回绑定方法 
 */
$("#backBtn").bind("click",function(){
    parent.parent.closeWin();// 关闭弹出框
});

/**
 * 替换页面元素
 */
function initializePage(){
    if($("#casetransferid").val() == ""){
        $("#docyear").val(new Date().getFullYear());
    }
    var casedate_hidden = $("#casedate_hidden").val();
    if(casedate_hidden!=""){
        $("#casedate").val(formatCSTDate(casedate_hidden,'yyyy-MM-dd'));
    }
    //填表时间
    $("#createTimeDiv").html("<input placeholder='   年   月  日' class='underline' readonly size='16' onclick='WdatePicker({dateFmt:\"yyyy-MM-dd\"})' id='createtime' name='createtime' type='text' style='width:160px'/>");
    var createtime_hidden = $("#createtime_hidden").val();
    if(createtime_hidden)
        $("#createtime").val(formatCSTDate(createtime_hidden,"yyyy-MM-dd"));
}


$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawcasetransferform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#casetransferid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_casetransfer"
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
		url : BASE_URL+'/law/lawcasetransfer/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcasetransferform").serializeArray(),
		global : false,
		success : function(json) {
			console.log(json);
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#casetransferid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#casetransferid").val(json.docid);
					}
					parent.toast(json.msg);//弹出提示信息
				//parent.getActiveIFrame().reloadGrid();//刷新列表
				//parent.closeWin();// 关闭弹出框
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