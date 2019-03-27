$(document).ready(function() {
	 //初始化特种作业岗位下拉树
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/knowledge/knochemicalcatal/chemicaltypeselect","chemicaltypeid",{"parent":"-1"});	
	var oldparent = $("#oldchemicaltypeid").val();
	if(oldparent){
		$('#itemnum').attr("disabled",false);
		SelectOption.loadBaseCodeFromDB(BASE_URL+"/knowledge/knochemicalcatal/chemicaltypeselect","itemnum",{"parent":oldparent});
	}
	
	//初始化下拉框
	SelectOption.loadTureFalse("supervision");
	SelectOption.loadTureFalse("easypoison");
	SelectOption.loadTureFalse("easyexplosion");
	SelectOption.loadTureFalse("highlytoxic");
	SelectOption.loadTureFalse("inflammable");
	
	
	$("#knochemicalcatalform").validate({
		rules: {
			chemicaltypeid: {
				required: true
			},
			itemnum: {
				required: true
			},
			specifications: {
				number: true
			},
			chemcatalname: {
				required: true
			},
			alias: {
				required: true
			},
			cas: {
				required: true
			},
			un: {
				number: true
			},
			supervision: {
				required: true
			},
			easypoison: {
				required: true
			},
			easyexplosion: {
				required: true
			},
			highlytoxic: {
				required: true
			},
			inflammable:{
				required: true
			}
		},
		messages: {
			chemicaltypeid: {
				required: "危化品类别不能为空"
			},
			itemnum: {
				required: "危化品项目不能为空"
			},
			specifications: {
				number: "只能输入数字"
			},
			chemcatalname: {
				required: "危化品名不能为空"
			},
			alias: {
				required: "别名不能为空"
			},
			cas: {
				required: "CAS号不能为空"
			},
			un: {
				number: "只能输入数字"
			},
			supervision: {
				required: "是否是重点监管危险化学品不能为空"
			},
			easypoison: {
				required: "是否易制毒不能为空"
			},
			easyexplosion: {
				required: "是否易制爆不能为空"
			},
			highlytoxic: {
				required: "是否剧毒不能为空"
			},
			inflammable:{
				required: "易燃气体不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

function selectChemicalType(){
	var parent = $("#chemicaltypeid").val();
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
		url : BASE_URL+'/knowledge/knochemicalcatal/save',
		cache : false,
		dataType : 'json',
		data : $("#knochemicalcatalform").serializeArray(),
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

