var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	initializePage();
	$("#lawevidencedecideform").validate({
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
				stringCheck:true,
				maxlength:8
			},
			handlerresult:{
				required: true,
				maxlength:200
			},
			/*govname:{
				required: true,
				maxlength:21
			},
			reviewgov:{
				required: true,
				maxlength:21
			},
			courtname:{
				required: true,
				maxlength:21
			},*/
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
				isDigits:"只能输入数字",
				maxlength:"文书年份长度不能超过4"
			},
			docnum:{
				required: "文书编号不能为空",
				stringCheck:"只能是字母数字下划线",
				maxlength:"文书编号长度不能超过8"
			},
			handlerresult:{
				required: "处理结果不能为空",
				maxlength:"处理结果长度不能超过200"
			},
			/*govname:{
				required: "地区不能为空",
				maxlength:"地区长度不能超过21"
			},
			reviewgov:{
				required: "复议机构不能为空",
				maxlength:"复议机构长度不能超过21"
			},
			courtname:{
				required: "法院名称不能为空",
				maxlength:"法院名称长度不能超过21"
			},*/
			createtime:{
				required: "文书发布时间不能为空"
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


/**
 * 替换页面元素
 */
function initializePage(){
	if($("#decideid").val() == ""){
		$("#docyear").val(new Date().getFullYear());
	}
	
	//询问时间
	$("#handlerTimeDiv").html(
			"<input class='underline' readonly type='text' id='handlertime' name='handlertime' style='width:200px'/>");
	var handlertime_hidden = $("#handlertime_hidden").val();
	if(handlertime_hidden)
		$("#handlertime").val(formatCSTDate(handlertime_hidden,"yyyy-MM-dd"));
		
	//给替换的元素赋值
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
	$("#lawevidencedecideform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#decideid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_evidence_decide"
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
		url : BASE_URL+'/law/lawevidencedecide/save',
		cache : false,
		dataType : 'json',
		data : $("#lawevidencedecideform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#decideid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);//弹出提示信息
//				parent.getActiveIFrame().reloadGrid();//刷新列表
//				parent.closeWin();// 关闭弹出框
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