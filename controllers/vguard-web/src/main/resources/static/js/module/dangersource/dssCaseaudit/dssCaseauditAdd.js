$(document).ready(function() {
	

	
	var auditSelectOptions = [
			{code:0,name:'不同意'},
			{code:1,name:'同意'}
	];
	
	SelectOption.loadTureFalseWithParam(auditSelectOptions, "result");
	
	initHandleTime();
	
	jQuery.validator.addMethod("greaterThan", 
			function(value, element, params) {

			    if (!/Invalid|NaN/.test(new Date(value))) {
			        return new Date(value) > new Date($(params).val());
			    }

			    return isNaN(value) && isNaN($(params).val()) 
			        || (Number(value) > Number($(params).val())); 
			},'Must be greater than {0}.');
	
	$("#dssCaseAuditForm").validate({
		rules: {
			

			caseeffedatestart: {
				required: true
			},
			caseeffedateend: {
				required: true,
				greaterThan : "#caseeffedatestart"
			},
			result: {
				required: true
			},
			notes : {
				required : true
			}
		},
		messages: {
			caseeffedatestart: {
				required: "备案有效期开始时间不能为空"
			},
			caseeffedateend: {
				required: "备案有效期结束时间不能为空",
				greaterThan : "备案有效期结束时间需大于备案有效期开始时间"
			},
			result : {
				required : "处理结果不能为空"
			},
			notes : {
				required : "意见不能为空"
			}
			
			
		}
//		submitHandler:function(form){
//	    	save();
//	    }
	});
	
	$("#submitBtn").click(function(){
		if($("#dssCaseAuditForm").valid())
			save();
	});
	
});

/**保存*/
function save(){
	
	var dssCaseauditJson = {};
	
	$('#caseeffedatestart').removeAttr('name');
	$('#caseeffedateend').removeAttr('name');
	
	$.each($("#dssCaseAuditForm").serializeArray(), function(){
		dssCaseauditJson[this.name] = this.value;
	});
	
	var param = {"dssCaseauditJson" : JSON.stringify(dssCaseauditJson)
	};	

	var dssDangerInfoJson = 
			{"caseeffedatestart" : $("#caseeffedatestart").val(),
			 "caseeffedateend" : $("#caseeffedateend").val()
			};
	param["dssDangerInfoJson"] = JSON.stringify(dssDangerInfoJson);
	param["token"] = $("#token").val();

	
	
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssCaseaudit/save',
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.toast("保存失败");
		}
	});
}

/**
 * 初始化处理日期
 */
function initHandleTime(){
	$("#handletime").val(getSmpFormatNowDate(false));
}

