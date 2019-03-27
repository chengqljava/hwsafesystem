$(document).ready(function() {
	
	$("#contendiv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });
	 $("#contendiv div[id^=fileselect]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 $("#contendiv div[id^=fileshow]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	
	
	checkDate();
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
		$("#username2 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	$("#username2").change(function(){
		var selected_value = $(this).val();//被选中的值
		$("#username1 option").each(function(){
			$(this).show();
			var txt = $(this).val();
			if(txt==selected_value){
				 $(this).hide();
			}
		});
	});
	
	$("#lawcheckrecordform").validate({
		rules: {
			/*entname: {
				required: true,
			},
			unitaddress: {
				required: true
			},
			legalperson: {
				required: true
			},
			tel: {
				required: true,
				isTelephone: true
			},
			site: {
				required: true
			},*/
			starttimeweb: {
				required: true
			},
			endtimeweb: {
				required: true
			},
			/*exadep: {
				required: true
			},*/
			exacondition: {
				required: true,
				rangelength:[1,1000]
			},
			/*unitprin: {
				required: true
			},
			exaperson1: {
				required: true
			},
			exaperson2: {
				required: true
			},*/
			indate: {
				required: true
			},
			username1: {
				required: true
			},
			username2: {
				required: true
			}
		},
		messages: {
			/*entname: {
				required: "检查单位不能为空"
			},
			unitaddress: {
				required: "地址不能为空"
			},
			legalperson: {
				required: "法定代表人不能为空"
			},
			tel: {
				required: "电话不能为空"
			},
			site: {
				required: "检查场所不能为空"
			},*/
			starttimeweb: {
				required: "检查开始时间不能为空"
			},
			endtimeweb: {
				required: "检查结束时间不能为空"
			},
			/*exadep: {
				required: "检查部门不能为空"
			},*/
			exacondition: {
				required: "检查情况不能为空",
				rangelength: "请输入1-1000个字符"
			},
			/*unitprin: {
				required: "被检查单位现场负责人不能为空"
			},
			exaperson1: {
				required: "检查人员1不能为空"
			},
			exaperson2: {
				required: "检查人员2不能为空"
			},*/
			indate: {
				required: "检查时间不能为空"
			},
			username1: {
				required: "执法人员1不能为空"
			},
			username2: {
				required: "执法人员2不能为空"
			}
		},
		submitHandler:function(form){
			$('#lawuserid1').val($("#username1 option:selected").val());
			$('#lawuserid2').val($("#username2 option:selected").val());
			//2017-5-22 QYS 增加检查时间判断机制
			if(checkDate()){
				save();
			}else{
				parent.toast("检查时间：开始日期大于结束日期，请重新输入！");
			}
//		   	save();
	    }
	});
});

function checkDate(){
	var startDate=new Date($("#starttimeweb").val().replace('年','-').replace('月','-').replace('日','').replace('时',':').replace('分',''));
	var endDate=new Date(startDate.getFullYear()+"-"+(startDate.getMonth()+1)+"-"+$("#endtimeweb").val().replace('日','').replace('时',':').replace('分',''));
		if(startDate>=endDate){
			return false;
		}
		else{
			return true;
		}
}

/*保存(新增或编辑)*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    } 
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/law/lawcheckrecord/save',
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#lawcheckrecordform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcheckrecord/"+$('#menupagetype').val()+"/"+$('#checkinfoid').val()+"/"+$('#doccode').val()+"/"+$('#doctype').val());
				parent.$('#checkrecordid').val(json.data);
			}else{
				parent.toast(json.msg);
				$('#myfile').empty();
				showUploadFile('myfile','image');//显示文件上传控件
				$('#hdientregistraform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 执法检查
 */
/*function checkpage(){
	parent.openWin(BASE_URL + '/law/lawcheckrecord/checkpage', '检查信息','90%','95%');
}*/

/**
 * 返回

$("#backBtn").bind("click",function(){
	var menupagetype = $('#menupagetype').val();
	var checkinfoid = $('#checkinfoid').val();
	var doccode = $('#doccode').val();
	parent.$("#contentIframe").attr("src",BASE_URL+"/law/lawcheckrecord/"+menupagetype+"/"+checkinfoid+"/"+doccode);
}); */

