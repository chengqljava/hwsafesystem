var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	//执法人员1下拉框
	SelectOption.loadSysUser("username1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("username2",{"jobtype": null,"usertype": "GOV"});
	
	window.setTimeout(function(){
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	},1000);
	$("#username1").change(function(){
		$("#execcode1").val($("#username1 option:selected").attr("attr"));
	});
	$("#username2").change(function(){
		$("#execcode2").val($("#username2 option:selected").attr("attr"));
	});
	
	//去除主办与协办重复人员，并级联加载协办安监员
	$("#username1").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username1 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	$("#username2").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username2 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	
	$("#lawscenedisposeform").validate({
		rules: {
			docarea: {
				required: true,
				isChinese: true
			},
			docyear: {
				required: true,
				isDecimal: true
			},
			docnum: {
				required: true,
				isDecimal: true
			},
			entname: {
				required: true
			},
			dangerinfo: {
				required: true
			},
			username1: {
				required: true
			},
			username2: {
				required: true
			},
			checkdate: {
				required: true
			},
			legislation: {
				required: true
			},
			method: {
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
				required: "隐患内容不能为空"
			},
			username1: {
				required: "主办安监员不能为空"
			},
			username2: {
				required: "协办安监员不能为空"
			},
			checkdate: {
				required: "检查时间不能为空"
			},
			legislation: {
				required: "执法依据不能为空"
			},
			method: {
				required: "处理决定不能为空"
			},
			indate: {
				required: "文书时间不能为空"
			}
		},
		submitHandler:function(form){
			$('#lawuserid1').val($("#username1 option:selected").val());
			$('#lawuserid2').val($("#username2 option:selected").val());
		   	save();
	    }
	});
});


$("#reportBtn").bind("click",function(){
	if(isSaved){
		 updateDocState();
	}else{
	isDocSubmit=true;
	$("#lawscenedisposeform").submit();
	}
});
function updateDocState(){
$.ajax({
    type: 'post',
    url: BASE_URL + '/law/lawdocstate/updateDocState',
    cache: false,
    dataType: 'json',
    data: {
        "docid": $("#sceneid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_scenedispose"
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
		url : BASE_URL+'/law/lawscenedispose/save',
		cache : false,
		dataType : 'json',
		data : $("#lawscenedisposeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#sceneid").val(json.docid);
					}
					updateDocState();
					isDocSubmit=false;
				}else{
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#sceneid").val(json.docid);
					}
					parent.toast(json.msg);//弹出提示信息
//				parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawscenedispose/"+$('#menupagetype').val()+"/"+$('#checkinfoid').val()+"/"+$('#doccode').val());
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
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawscenedispose/"+menupagetype+"/"+checkinfoid+"/"+doccode);
});


//执法依据
$("#basisBtn").click(
		function() {
			parent.openWin(BASE_URL + '/law/lawbasis/lawbasispage', '执法依据',
					'90%', '95%');
		});

function basisclick(divname){
	parent.openWin(BASE_URL + '/law/lawbasis/lawbasispage/'+divname, '执法依据',
			'90%', '95%');
}

$("#dangerinfo").change(function(){
	$("#dangerinfoStr").val($("#dangerinfo").val());
});

