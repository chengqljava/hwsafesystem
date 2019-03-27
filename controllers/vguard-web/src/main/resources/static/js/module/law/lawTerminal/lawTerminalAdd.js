$(function() {
	//初始化执法终端状态下拉框
	SelectOption.loadLawTerStat("state");

	// 字符验证       
	//jQuery.validator.addMethod("stringCheck", function(value, element) {
	//    return this.optional(element) || /^[a-zA-Z0-9_\.]+$/.test(value);
	//}, "只能包括字母、数字、点和下划线");

	$("#lawTermform").validate({
		rules: {
			equipnum: {
				required: true,
				rangelength:[1, 32]
			},
			equipname: {
				required: true,
				rangelength:[1, 100]
			},
			state: {
            	required: true
            },
			usetime: {
            	required: true
            },
			manuf: {
            	required: true,
				rangelength:[1, 100]
            },
			model: {
            	required: true,
				rangelength:[1, 50]
            }
		},
		messages: {
			equipnum: {
				required: "编号不能为空",
				rangelength: "请输入1-32个字符"
			},
			equipname: {
				required: "名称不能为空",
				rangelength: "请输入1-100个字符"
			},
			state: {
				required: "状态不能为空"
			},
			usetime: {
				required: "投入使用时间不能为空"
			},
			manuf: {
				required: "厂家不能为空",
				rangelength: "请输入1-100个字符"
			},
			model: {
				required: "型号不能为空",
				rangelength: "请输入1-50个字符"
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
		type: "post",
		url: BASE_URL + "/law/lawTerminal/save",
		cache: false,
		dataType: "json",
		data: $("#lawTermform").serializeArray(),
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