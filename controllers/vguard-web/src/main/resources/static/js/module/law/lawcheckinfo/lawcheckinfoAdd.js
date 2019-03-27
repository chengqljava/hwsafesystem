$(document).ready(function() {
	initializeSelect();

	$("#lawcheckinfoform").validate({
		rules: {
			/*deptname: {
				required: true,
			},*/
			username1: {
				required: true
			},
			username2: {
				required: true
			},
			entname: {
				required: true
			},
			examinedate: {
				required: true
			}
		},
		messages: {
			/*deptname: {
				required: "执法部门不能为空"
			},*/
			username1: {
				required: "执法人员不能为空"
			},
			username2: {
				required: "执法人员不能为空"
			},
			entname: {
				required: "企业名称不能为空"
			},
			examinedate: {
				required: "检查日期不能为空"
			}
		},
		submitHandler:function(form){
			$('#userprincipal').val($("#username1 option:selected").val());
			$('#userassist').val($("#username2 option:selected").val());
			$('#deptid').val($("#deptname option:selected").val());
			$('#planid').val($("#plan option:selected").val());
		    save();
	    }   
	});
});

function initializeSelect(){
	//执法部门下拉框
	SelectOption.loadSysDepart("deptname",null);
	//主办安监员
	SelectOption.loadSysUser("username1",{"jobtype": null,"usertype": "GOV"});
	//协办安监员
	SelectOption.loadSysUser("username2",{"jobtype": null,"usertype": "GOV"});
	if($('#deptid').val()){
		//执法计划
		SelectOption.loadLawPlan("plan",{"deptid": $('#deptid').val()});
		//主办安监员
		SelectOption.loadSysUser("username1",{"deptid": $('#deptid').val()});
		//协办安监员
		SelectOption.loadSysUser("username2",{"deptid": $('#deptid').val()});
		
	}else{
		$('#plan').attr("disabled",true);
		//$('#username1').attr("disabled",true);
		//$('#username2').attr("disabled",true);
	}
	
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
		var optionP;
		var selected_value = $(this).val();//被选中的值
		$("#username2 option").each(function(){
//			$(this).show();
			optionP = $(this).parent("span"); 
			optionP.children().clone().replaceAll(optionP);
			var txt = $(this).val();
			if(txt==selected_value){
//				 $(this).hide();
				$(this).wrap("<span style='display:none'></span>");
			}
		});
	});
	$("#username2").change(function(){
		var optionP;
		var selected_value = $(this).val();//被选中的值
		$("#username1 option").each(function(){
//			$(this).show();
			optionP = $(this).parent("span"); 
			optionP.children().clone().replaceAll(optionP); 
			var txt = $(this).val();
			if(txt==selected_value){
//				 $(this).hide();
				$(this).wrap("<span style='display:none'></span>");
			}
		});
	});
}
$('#plan').change(function(){
	$("#entname").val("");
	$("#address").val("");
	$("#legalperson").val("");
	$("#phone").val("");
});

$('#deptname').change(function(){
	var deptid=$(this).children('option:selected').val();//这就是selected的值
	if(deptid!=''){
		$('#plan').removeAttr("disabled");
		$('#username1').removeAttr("disabled");
		$('#username2').removeAttr("disabled");
		$("#plan").html("");
		$("#username1").html("");
		$("#username2").html("");
		$("#plan").attr("selectvalue","");
		$("#username1").attr("selectvalue","");
		$("#username2").attr("selectvalue","");
		$("#entname").val("");
		$("#address").val("");
		$("#legalperson").val("");
		$("#phone").val("");
		//执法计划
		SelectOption.loadLawPlan("plan",{"deptid": deptid});
		//主办安监员
		//SelectOption.loadLawUser("username1",{"deptid": deptid});
		SelectOption.loadSysUser("username1",{"deptid": deptid});
		//协办安监员
		//SelectOption.loadLawUser("username2",{"deptid": deptid});
		SelectOption.loadSysUser("username2",{"deptid": deptid});
	}else{
		$("#plan").html("");
		$("#username1").html("");
		$("#username2").html("");
		$('#plan').attr("disabled",true);
		//$('#username1').attr("disabled",true);
		//$('#username2').attr("disabled",true);
		//主办安监员
		SelectOption.loadSysUser("username1",{"jobtype": null,"usertype": "GOV"});
		//协办安监员
		SelectOption.loadSysUser("username2",{"jobtype": null,"usertype": "GOV"});
	}
});


/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawcheckinfo/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcheckinfoform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				if($("#checkinfoid").val() || $("#taskid").val()){
					parent.toast(json.msg);//弹出提示信息
					parent.$('#checkinfoid').val(json.data);//给树页面的执法企业信息id赋值，用与文书
					parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcheckinfo/edit?id="+parent.$('#checkinfoid').val()+"&menupagetype="+$('#menupagetype').val()+"&taskid="+$('#taskid').val()+"&doctype="+parent.$('#doctype').val());
					parent.parent.getActiveIFrame().reloadGrid();//重新加载
				}else{
					parent.toast(json.msg);//弹出提示信息
					parent.getActiveIFrame().reloadGrid();//重新加载
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

/**
 * 企业信息
 */
function loadEnt(){
	/**
	 * 加载企业
	 */
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(rowdata) {
		$('#businessinfoid').val(rowdata.BUSINESSINFOID);
		$('#entname').val(rowdata.ENTNAME);
		$('#address').val(rowdata.ADDRESS);
		$('#legalperson').val(rowdata.LEGALPERSON);
		$('#phone').val(rowdata.PHONE);
		$('#entname').blur();
	});
	var planid = $("#plan option:selected").val();
	window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','65%','70%');
	/*if(planid){
		window.top.openWin(BASE_URL+"/law/lawcheckinfo/entinfo?planid="+planid,' 企业信息','65%','70%');
	}else{
		parent.toast("请选择执法计划");
	}*/
	
}

/**
 * 	企业新增入口
 */
$("#addEnt").bind("click",function(){
	parent.openWin(BASE_URL+"/enterprise/entbusinessinfo/add",'新增工商信息','','85%');
});

	
function selectUser(){
	//执法人员2下拉框
	SelectOption.loadSysUser("username2",{"lawuserid":$("#username1 option:selected").val() != null ? $("#username1 option:selected").val() : ""});
}