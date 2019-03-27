var isDocSubmit=false;
var isSaved=false;


$(document).ready(function() {
	$("#lawcoerceform").validate({
		rules: {
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
			entname: {
				required: true
			},
			dangerinfo: {
				required: true
			},
			legislation: {
				required: true
			},
			measures: {
				required: true
			},
			indate: {
				required: true
			}
		},
		messages: {
			docarea: {
				required: "区域不能为空"
			},
			docyear: {
				required: "年份不能为空"
			},
			docnum: {
				required: "编号不能为空"
			},
			entname: {
				required: "检查单位不能为空"
			},
			dangerinfo: {
				required: "问题信息不能为空"
			},
			legislation: {
				required: "执法依据不能为空"
			},
			measures: {
				required: "强制措施不能为空"
			},
			indate: {
				required: "文书日期不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }
	});
});



$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawcoerceform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#coerceid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_coerce"
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
		url : BASE_URL+'/law/lawcoerce/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcoerceform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#coerceid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
				parent.toast(json.msg);//弹出提示信息
//				parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcoerce/"+$('#menupagetype').val()+"/"+$('#checkinfoid').val()+"/"+$('#doccode').val());
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

/**
 * 返回
 */
$("#backBtn").bind("click",function(){
	var menupagetype = $('#menupagetype').val();
	var checkinfoid = $('#checkinfoid').val();
	var doccode = $('#doccode').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcoerce/"+menupagetype+"/"+checkinfoid+"/"+doccode);
});

