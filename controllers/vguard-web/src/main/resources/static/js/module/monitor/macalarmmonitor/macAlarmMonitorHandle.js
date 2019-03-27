$(document).ready(function() {
	var isRemind = $("#isRemind").val();
	$("#alermHandleForm").validate({
		rules: {
			handletime:{
				required: true
			},
			notes:{
				required: true
			}
		},
		messages: {
			handletime:{
				required: "处理时间不能为空"
			},
			notes:{
				required: "描述不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

/**保存*/
function save(){
	var isRemind = $("#isRemind").val();
	console.log(isRemind);
	var alermHandleJson = {};

	$.each($("#alermHandleForm").serializeArray(), function(){
		alermHandleJson[this.name] = this.value;
	});
	
	var url;
	if($("#monitorAlarmIds").val() != "")
		url = '/monitor/macalarmmonitor/batchHandleAlarm';
	else {
		url = '/monitor/macalarmmonitor/handleAlarm';
		delete alermHandleJson["monitorAlarmIds"];
	}

	var param = {"alermHandleJson" : JSON.stringify(alermHandleJson)
	};
	
	$.ajax({
		type : 'post',
		url : BASE_URL + url,
		cache : false,
		dataType : 'json',
		data : param,
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.parent.loadRemindCount();//刷新消息提醒数
				if(isRemind == 0){
					parent.closeAllWin();// 关闭弹出框
				}
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


