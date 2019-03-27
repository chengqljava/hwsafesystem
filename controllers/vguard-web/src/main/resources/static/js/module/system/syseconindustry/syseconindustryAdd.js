$(document).ready(function() {
	    //父节点
		SelectTree.loadEconindustrySelect("parentname");
	
		/**字符数字验证*/
		jQuery.validator.addMethod("chrnum", function(value, element) {
			var chrnum = /^([a-zA-Z0-9]+)$/;
			return this.optional(element) || (chrnum.test(value));
			}, "只能输入字符和数字(字符A-Z, a-z, 0-9)");
		
		$("#econindustryform").validate({
			rules: {
				code: {
					required: true,
					chrnum: true
				},
				type: {
					required: true
				},
				parentname: {
					required: true
				}
			},
			messages: {
				code: {
					required: "编码不能为空",
					chrnum: "只能输入字符和数字(字符A-Z, a-z, 0-9)"
				},
				type: {
					required: "类型不能为空"
				},
				parentname: {
					required: "上级节点不能为空"
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
		url : BASE_URL+'/system/syseconindustry/save',
		cache : false,
		dataType : 'json',
		data : $("#econindustryform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().loadEconindustryTree();//刷新树();
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
