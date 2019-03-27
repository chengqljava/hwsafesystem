$(document).ready(function() {
	SelectOption.loadisDangSou("isDangSou");//是否重大危险源
	
	$("#dangerSourceform").validate({
		rules: {
			isDangSou: {
				required: true
			}
		},
		messages: {
			isDangSou: {
				required: "是否重大危险源没有选择"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});
/**
 * 辨识
 */
$("#discern").on("click",function(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssdangerinfo/zfdiscern',
		cache : false,
		dataType : 'json',
		data : {dangerId:$("#dangerid").val()},
		global : false,
		success : function(json) {
			if(json.success==true){
				if(json.rval >= 1){//是重大危险源
					$("#dangerYes").show();
				}else{
					$("#dangerNo").show();
				}
				parent.toast(json.msg);//弹出提示信息
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
})

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssdangerinfo/discernSave',
		cache : false,
		dataType : 'json',
		data : {dangerId:$("#dangerid").val(),isDangSou:$("#isDangSou").val()},
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

