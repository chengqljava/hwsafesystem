$(function() {
	//初始化任务类别下拉框
	SelectOption.loadTaskType("tasktype");
	
	//主办安监员
	SelectOption.loadSysUser("master",{"jobtype": $('#jobtype').val()});
	//协办安监员
	SelectOption.loadSysUser("slavel",{"jobtype": $('#jobtype').val()});
	
	
	//选择企业 isSingle是否单选，编辑的时候只能选择一个企业
	$("#entName").off("click").on("click", function(){
		parent.openWin(BASE_URL + "/task/selchkenter?isSingle=true",
	            "选择检查企业", "70%", "65%");
	});
	
//	//选择主办执法人员
//	$("#masterName").off("click").on("click", function(){
//		parent.openWin(BASE_URL + "/task/sellawuser?flag=master",
//				"选择主办执法人员", "70%", "65%");
//	});
//	
//	//选择协办执法人员
//	$("#slavelName").off("click").on("click", function(){
//		parent.openWin(BASE_URL + "/task/sellawuser?flag=slave",
//				"选择协办执法人员", "70%", "65%");
//	});
	
	
	// 字符验证       
	//jQuery.validator.addMethod("stringCheck", function(value, element) {
	//    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);
	//}, "只能包括字母、数字、点和下划线");

	$("#taskEditForm").validate({
		rules: {
			taskname: {
				required: true,
				rangelength:[1, 64]
			},
			tasktype: {
				required: true
			},
			entName: {
				required: true
			},
			master: {
            	required: true
            },
//            slavelName: {
//            	required: true
//            },
            starttime: {
            	required: true
            },
            endtime: {
            	required: true
            }
		},
		messages: {
			taskname: {
				required: "任务名称不能为空",
				rangelength: "请输入1-64个字符"
			},
			tasktype: {
				required: "任务类型不能为空"
			},
			entName: {
				required: "被检查企业名称不能为空"
			},
			master: {
				required: "主办执法人不能为空"
			},
//			slavelName: {
//				required: "协办执法人不能为空"
//			},
			starttime: {
				required: "任务开始日期不能为空"
			},
			endtime: {
				required: "任务结束日期不能为空"
			}
		},
		submitHandler:function(form){
		   	save();
	    }   
	});
});

/*保存(编辑)*/
function save(){
	var startTime = $("#starttime").val(),
		endTime = $("#endtime").val();
	if (getNowFormatDate() > startTime) {
		parent.toast("任务开始日期不能小于当前日期");
		return;
	}
	if (startTime > endTime) {
		parent.toast("任务开始日期不能大于任务结束日期");
		return;
	}
	
	$.ajax({
		type: "post",
		url: BASE_URL + "/task/saveEditManaTask",
		cache: false,
		dataType: "json",
		data: $("#taskEditForm").serializeArray(),
		global: false,
		success: function(json) {
			if(json.success == true){
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
 * 给所选择企业赋值
 * @param entInfoObj
 */
function setEntInfo(entInfoObj){
	$("#businessinfoid").val(entInfoObj.curEntId);
	$("#entName").val(entInfoObj.curEntName);
	$("#entName-error").remove();
}

/**
 * 给所选择执法人员赋值
 * @param entInfoObj
 */
function setLawUserInfo(lawUserObj){
	if ("master" == lawUserObj.flag) {
		$("#master").val(lawUserObj.lawUserId);
		$("#masterName").val(lawUserObj.lawUserName);
		$("#masterName-error").remove();
	} else {
		$("#slavel").val(lawUserObj.lawUserId);
		$("#slavelName").val(lawUserObj.lawUserName);
	} 
}