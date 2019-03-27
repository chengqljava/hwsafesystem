var isDocSubmit=false;
var isSaved=false;


$(document).ready(function() {
	
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
			}
		},
		messages: {
			docarea: {
				required: "请输入内容"
			},
			docyear: {
				required: "请输入内容",
				isDigits:"请输入数字",
				minlength:"请输入4位数字"
			},
			docnum: {
				required: "请输入内容",
				isDigits: "请输入数字"
			},
			casename: {
				required: "请输入内容"
			},
			entname: {
				required: "请输入内容"
			}
		},
		submitHandler:function(form){
		   	save();
	    }
	});
	
	$('#addBtn').on("click",function(){
		tb_row
	});
});

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}else {
			o[this.name] = this.value || '';
			}
	});
	 return o;
};
	

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
        "docid": $("#receiptid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_receipt"
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
		url : BASE_URL+'/law/lawreceipt/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#receiptid").val(json.docid);
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


