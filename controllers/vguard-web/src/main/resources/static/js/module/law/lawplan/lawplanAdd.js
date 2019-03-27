$(document).ready(function() {
	//计划类型
	SelectOption.loadPlanType("plantype");
	$("#planyear").hide();
	if($("#plantype").val()=="3"){
		$("#planyear").show();
		$("#plantime").hide();
	}
	$("#plantype").change(function(){
		//如果是年度计划，则年度月份只显示年，否则显示年月
		if($(this).val()=="3"){
			$("#plantime").rules("remove");
			$("#planyear").rules("add",{
	            required: true,
	            messages: {
	                required: "年度月份不能为空"
	            }
	        });
			//清空原有的值
			$("#planyear").val("");
			$("#plantime").val("");
			$("#planyear").show();
			$("#plantime").hide();
		}else{
			$("#planyear").rules("remove");
			$("#plantime").rules("add",{
	            required: true,
	            messages: {
	                required: "计划年度月份不能为空"
	            }
	        });
			
			$("#planyear").val("");
			$("#planyear").hide();
			$("#plantime").show();
		}
	});
	
	 //执法部门
	SelectTree.loadBaseSelect(BASE_URL+"/system/sysdepart/departtree","deptname");
	
	$("#planform").validate({
		rules: {
			deptname: {
				required: true
			},
			plantype: {
				required: true
			},
			planname: {
				required: true
			},
			plantime: {
				required: true
			},
			begindate: {
				required: true
			},
			enddate: {
				required: true
			},
			notes: {
				required: true
			}
		},
		messages: {
			deptname: {
				required: "执法部门不能为空"
			},
			plantype: {
				required: "计划类型不能为空"
			},
			planname: {
				required: "计划名称不能为空"
			},
			plantime: {
				required: "计划年度月份不能为空"
			},
			begindate: {
				required: "开始日期不能为空"
			},
			enddate: {
				required: "截止日期不能为空"
			},
			notes: {
				required: "工作任务说明不能为空"
			}
		},
		submitHandler:function(form){
			if(checkDate()){
				save();
			}else{
				parent.toast("截止日期应大于开始日期，请重新输入！");
			}
	    }   
	});
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawplan/save',
		cache : false,
		dataType : 'json',
		data : $("#planform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				//parent.toast(json.msg);
				parent.layer.alert(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 检查截止日期是否大于开始日期
 * @returns {Boolean}
 */
function checkDate(){
	var begindate = $("#begindate").val();
	var enddate = $("#enddate").val();
	if(begindate && enddate){
		if(begindate>=enddate){
			return false;
		}
	}
	return true;
}

