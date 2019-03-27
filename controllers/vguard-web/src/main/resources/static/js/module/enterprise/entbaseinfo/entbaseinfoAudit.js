$(document).ready(function() {
	$("#entauditform").validate({
		rules: {
			orgname: {
				required: true
			},
			audittime: {
				required: true
			},
			auditstatus: {
				required: true
			},
			auditidea: {
				required: true
			}
		},
		messages: {
			orgname: {
				required: "审核部门不能为空"
			},
			audittime: {
				required: "审核日期不能为空"
			},
			auditstatus: {
				required: "请选择审核结果"
			},
			auditidea: {
				required: "审核意见不能为空"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
	         var eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       } else {
	    	   error.insertAfter(element);
	       }
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entaudit/save',
		cache : false,
		dataType : 'json',
		data : $("#entauditform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
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
