$(document).ready(function() {
	     //级别
        SelectOption.loadDistrictLevel("districtlevel");
	    //父区域
		SelectTree.loadDistrictSelect("parentname");
	
		/**字符数字验证*/
		jQuery.validator.addMethod("chrnum", function(value, element) {
			var chrnum = /^([a-zA-Z0-9]+)$/;
			return this.optional(element) || (chrnum.test(value));
			}, "只能输入字符数字(字符A-Z, a-z, 0-9)");
		
		$("#districtform").validate({
			rules: {
				shortname: {
					required: true
				},
				parentname: {
					required: true
				},
				districtnum: {
					required: true,
					chrnum: true
				},
				districtlevel: {
					required: true
				}
			},
			messages: {
				shortname: {
					required: "名称(缩写)不能为空"
				},
				parentname: {
					required: "父区域不能为空"
				},
				districtnum: {
					required: "区域编码不能为空",
					chrnum : "只能输入字符数字(字符A-Z, a-z, 0-9)"
				},
				districtlevel: {
					required: "请选择区域级别!",
				}
			},
			submitHandler:function(form){
				 var parentname = $("#parentname").val();//父节点name值
			   	 var shortname = $("#shortname").val();//简写name值
			   	 var districtname = parentname + shortname;
			   	 $("#districtname").val(districtname);//全写
				 save();
		    }   
		});
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysdistrict/save',
		cache : false,
		dataType : 'json',
		data : $("#districtform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid("","");//刷新列表
				parent.getActiveIFrame().loadDistrictTree();//刷新树();
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
