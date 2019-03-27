$(document).ready(function() {
	
//	// 事故类型
//	var eventtypeidDataArr = [
//	                          {code : 1, name : '火灾'},
//	                          {code : 2, name : '爆炸'},
//	                          {code : 3, name : '毒气泄漏'},
//	                          {code : 4, name : '踩踏'},
//	                          {code : 5, name : '其他'}
//	                          ];
//	
//	SelectOption.loadBaseCode(eventtypeidDataArr, 'eventtypeid');
	SelectTree.loadEventTypeAllTreeSelect("eventtypename");
	
	
	$("#emsplaproaccform").validate({
		rules: {
			eventtypeid : {required : true, maxlength : 3},
			accidentname : {required : true, maxlength : 50},
			responseperson : {required : true, maxlength : 16},
			phone : {required : true, isPhone : true},
			probeconseq : {required : true, maxlength : 250},
			acchandes : {required : true, maxlength : 250}
		},
		messages: {
			eventtypeid : {required : "适用事故不能为空", maxlength : "长度不能超过3"},
			accidentname : {required : "事故名称不能为空", maxlength : "长度不能超过50"},
			responseperson : {required : "负责人不能为空", maxlength : "长度不能超过2"},
			phone : {required : "负责人电话不能为空", isPhone : "格式不正确"},
			probeconseq : {required : "可能后果不能为空", maxlength : "长度不能超过250"},
			acchandes : {required : "事故处置方式不能为空", maxlength : "长度不能超过250"},
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
		url : BASE_URL+'/ems/emsplaproacc/save',
		cache : false,
		dataType : 'json',
		data : $("#emsplaproaccform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success == true){
				parent.toast(json.msg);//弹出提示信息
				var frameLen = parent.parent.frames.length;
				parent.parent.frames[frameLen - 1].frames["chemIframe"].reloadGrid();
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

