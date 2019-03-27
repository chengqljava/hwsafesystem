$(document).ready(function() {

	SelectOption.loadAcclevel("acclevel");
	SelectTree.loadEconindustrySelect("industrytypename");	
//	SelectTree.loadEventTypeAllTreeSelect("acctypename");
	
	
	$("#knocaseform").validate({
		rules: {
			accname: {
				required: true
			},
			keyword: {
				required: true
			},
			acctime: {
				required: true
			},
			accunit: {
				required: true
			},
			industrytype: {
				required: true
			},
			acclevel: {
				required: true
			},
			acctype: {
				required: true
			},
		},
		messages: {
			accname: {
				required: "事故标题不能为空"
			},
			keyword: {
				required: "主题词不能为空"
			},
			acctime: {
				required: "发生时间不能为空"
			},
			accunit: {
				required: "事故单位不能为空"
			},
			industrytype: {
				required: "行业类型不能为空"
			},
			acclevel: {
				required: "事故级别不能为空"
			},
			acctype: {
				required: "事故类型不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

function selectChemicalType(){
	var parent = $("#caseid").val();
	$('#itemnum').empty();
	if(parent){
		$('#itemnum').attr("disabled",false);
		SelectOption.loadBaseCodeFromDB(BASE_URL+"/knowledge/knochemicalcatal/chemicaltypeselect","itemnum",{"parent":parent});
	}else{
		$('#itemnum').attr("disabled",true);
	}
}


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/knowledge/knocase/save',
		cache : false,
		dataType : 'json',
		data : $("#knocaseform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

