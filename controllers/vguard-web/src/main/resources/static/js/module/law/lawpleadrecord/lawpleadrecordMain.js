var isDocSubmit=false;
var isSaved=false;

$(document).ready(function() {
	
	//替换页面元素
	$("#saferdiv1").html("<select id='safer1' name='safer1' selectvalue='" + $("#safer1_hidden").val() + "' class='underline' style='width: 135px;'></select>");
	$("#saferdiv2").html("<select id='safer2' name='safer2' selectvalue='" + $("#safer2_hidden").val() + "' class='underline' style='width: 135px;'></select>");
	
	var docdate_hidden = $("#docdate_hidden").val();
	if(docdate_hidden)
		$("#docdate").val(docdate_hidden);
	
	//执法人员1下拉框
	SelectOption.loadSysUser("safer1",{"jobtype": null,"usertype": "GOV"});
	//执法人员2下拉框
	SelectOption.loadSysUser("safer2",{"jobtype": null,"usertype": "GOV"});
	window.setTimeout(function(){
		$("#safernum1").val($("#safer1 option:selected").attr("attr"));
		$("#safernum2").val($("#safer2 option:selected").attr("attr"));
	},1000);
	$("#safer1").change(function(){
		$("#safernum1").val($("#safer1 option:selected").attr("attr"));
	});
	$("#safer2").change(function(){
		$("#safernum2").val($("#safer2 option:selected").attr("attr"));
	});
	
	//性别
	SelectOption.loadSex("pleadsex");
	
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
			//开始时间
			starttime: {
				required: true
			},
			//结束时间
			endtime: {
				required: true
			},
			//地点
			place:{
				required: true
			},
			//申辩人
			plead:{
				required: true
			},
			//申辩人公司
			pleadcompany:{
				required: true
			},
			//申辩人电话
			pleadtel:{
				required: true,
				isTelephone: true
			},
			/*
			pleadaddr:{
				required: true
			},*/
			//承办人
			undertake:{
				required: true
			},
			/*safety:{
				required: true
			},*/
			safer1:{
				required: true
			},
			safer2:{
				required: true
			},
			//案件名称
			casename:{
				required: true
			},
			//陈述申辩记录:
			pleadcontent:{
				required: true
			},
			pleadsign:{
				required: true
			},
			undertakesign:{
				required: true
			},
			recordsign:{
				required: true
			},
			docdate: {
				required: true
			}/*,
			zip: {
				isZipCode: true
			}*/
		},
		messages: {
			starttime: {
				required: "请输入日期"
			},
			endtime: {
				required: "请输入日期"
			},
			place:{
				required: "请输入地点"
			},
			plead:{
				required: "请输入职务"
			},
			pleadcompany:{
				required: "请输入工作单位"
			},
			pleadtel:{
				required: "请输入电话"
			},
			/*
			pleadaddr:{
				required: "请输入联系地址"
			},*/
			undertake:{
				required: "请输入承办人"
			},
			/*safety:{
				required: "请输入所属安监局"
			},*/
			safer1:{
				required: "请输入执法人员1"
			},
			safer2:{
				required: "请输入执法人员2"
			},
			casename:{
				required: "请输入案件名称"
			},
			pleadcontent:{
				required: "请输入申辩记录"
			},
			pleadsign:{
				required: "请输入陈述申辩人"
			},
			undertakesign:{
				required: "请输入承办人"
			},
			recordsign:{
				required: "请输入内容"
			},
			docdate: {
				required: "请输入日期"
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
        "docid": $("#recordid").val(),
        "checkinfoid": $("#checkinfoid").val(),
        "doctype": "law_pleadrecord"
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
		url : BASE_URL+'/law/lawpleadrecord/save',
		cache : false,
		dataType : 'json',
		data : $("#myform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				isSaved=true;
				if(isDocSubmit==true){
					if(json.docid!=""&&typeof(json.docid)!="undefined"){
						$("#recordid").val(json.docid);
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


