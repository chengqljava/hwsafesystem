$(document).ready(function() {
//	var deptid = $("#deptid").val();
	
	//主办安监员
	SelectOption.loadSysUser("safer", {"jobtype": null,"usertype": "GOV"});
//	SelectOption.loadSysUser("safer", {"deptid": deptid, "jobtype": "2", "isSiblingsUser": "1"});
	//协办安监员
	SelectOption.loadSysUser("safer2", {"jobtype": null,"usertype": "GOV"});
//	SelectOption.loadSysUser("safer2", {"deptid": deptid, "jobtype": "2", "isSiblingsUser": "1"});
	
	SelectOption.loadLawSuitStatus("auditstatus");//审核状态
	
	//去除主办与协办重复人员
	$("#safer").change(function(){
		$('#safernum').val($("#safer option:selected").attr('attr'));//加载证件号
		var selected_value = $(this).val();//被选中的值
		$("#safer2 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	$("#safer2").change(function(){
		$('#safenum2').val($("#safer2 option:selected").attr('attr'));//加载证件号
		
		var selected_value = $(this).val();//被选中的值
		$("#safer option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	
	
	$("#myform").validate({
		rules: {
			entname: {
				required: true
			},
			casename: {
				required: true
			},
			digest: {
				required: true,
				maxlength:150
			},
			emcee: {
				required: true,
				maxlength:150
			},
			headadv: {
				required: true,
				maxlength:150
			},
			safer: {
				required: true
			},
			safer2: {
				required: true
			},
			applyadv: {
				required: true,
				maxlength:150
			},
			auditstatus: {
				required: true
			}
		},
		messages: {
			entname: {
				required:"被查企业不能为空"
			},
			casename: {
				required: "案件名称不能为空"
			},
			digest: {
				required: "复议基本情况摘要不能为空",
				maxlength:"复议基本情况摘要不能大于150个字"
			},
			emcee: {
				required: "复议主持人意见不能为空",
				maxlength:"复议主持人不能大于150个字"
			},
			headadv: {
				required: "负责人审批意见不能为空",
				maxlength:"负责人审批意见不能大于150个字"
			},
			safer: {
				required: "执法人员不能为空"
			},
			safer2: {
				required: "执法人员不能为空"
			},
			applyadv: {
				required: "申请人意见不能为空",
				maxlength:"申请人意见不能大于150个字"
			},
			auditstatus: {
				required: "审批状态不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawrec/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
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

/**
 * 企业信息
 */
function openEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(data) {
		$('#businessinfoid').val(data.BUSINESSINFOID);
		$('#entname').val(data.ENTNAME);
		$('#entname').blur();
	});
	parent.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid=null",' 企业信息','65%','70%');
}



