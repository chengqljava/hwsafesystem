$(document).ready(function() {
	SelectOption.loadProbeDeviceType("type");
	// 字符验证       
	jQuery.validator.addMethod("stringCheck", function(value, element) {       
	    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);       
	}, "只能包括字母、数字、点和下划线");
	$("#macProbeBrandtypeform").validate({
		rules: {
			brandtypename:{
				required: true
			},
			brandtypenum:{
				required: true,
				stringCheck:true,
				remote:{
				    url: BASE_URL+"/monitor/macprobebrandtype/existsProbeBrandTypeNum",     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	probeBrandTypeId : function(){
							return $("#brandtypeid").val();
						},
						probeBrandTypeNum : function(){
							return $("#brandtypenum").val();
						}
				    }
				}
			},
			type:{
				required: true
			}
		},
		messages: {
			brandtypename:{
				required: "型号名称不能为空"
			},
			brandtypenum:{
				required : "型号编码不能为空",
				stringCheck : "只能包括字母、数字、点和下划线",
				remote : "编号已存在"
			},
			type:{
				required: "主机/探头不能为空"
			}
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
		url : BASE_URL+'/monitor/macprobebrandtype/save',
		cache : false,
		dataType : 'json',
		data : $("#macProbeBrandtypeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().refreshTree();//刷新树
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