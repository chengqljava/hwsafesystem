$(document).ready(function() {
	getValue();//初始化年份和季度
	
	$("#hdientinspectionform").validate({
		rules: {
			registrant: {
				required: true
			},
			recordtime: {
				required: true
			}
		},
		messages: {
			registrant: {
				required: "登记人不能为空"
			},
			recordtime: {
				required: "登记时间不能为空"
			}
		},
		submitHandler:function(form){
			$('#nowyear').removeAttr("disabled"); 
			$('#quarter').removeAttr("disabled"); 
			 save();
	    }   
	});
});

/*
 * 取当前日期
 */
function getValue(){
	
	var nowyear = $("#nowyear").val();
	var quarter = $("#quarter").val();
	var d = new Date();
	if(!nowyear){
		//当前年份
	    $("#nowyear").val(d.getFullYear());
	}
	if(!quarter){
		//当前季度
	    $("#quarter").val(Math.floor(((d.getMonth()+1) % 3 == 0 ? ((d.getMonth()+1) / 3 ) : ((d.getMonth()+1) / 3 + 1 ))));
	}
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdientinspection/save',
		cache : false,
		dataType : 'json',
		data : $("#hdientinspectionform").serializeArray(),
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
