$(document).ready(function() {
		//行政区域所有节点
		SelectTree.loadDistrictAllSelect("districtname");
		//上级机构
		SelectTree.loadIsMemberSelect("parentname", {ismember:'1'});
	
		/**字符下划线验证*/
		jQuery.validator.addMethod("chr", function(value, element) {
			var chrnum = /^([a-zA-Z_]+)$/;
			return this.optional(element) || (chrnum.test(value));
			}, "只能输入字符(字符A-Z, a-z,_)");
		
		//邮政编码
		jQuery.validator.addMethod("postcode", function(value, element) { 
			var length = value.length; 
			var postcode =  /^[0-9]{6}$/; 
			return this.optional(element) || (length == 6 && postcode.test(value)); 
			}, "邮政编码格式错误");
		
		//手机号码验证
		jQuery.validator.addMethod("mobile", function(value, element) { 
			var length = value.length; 
			var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/ 
			return this.optional(element) || (length == 11 && mobile.test(value)); 
			}, "手机号码格式错误");
		
		$("#orgform").validate({
			rules: {
				orgname: {
					required: true
				},
				orgcode: {
					required: true
				},
				parentname: {
					required: true
				},
				principal: {
					required: true
				},
				principalmtel: {
					required: true,
					mobile: true
				},
				districtname: {
					required: true
				},
				address: {
					required: true
				},
				postcode: {
					postcode: true
				}
			},
			messages: {
				orgname: {
					required: "机构名称不能为空"
				},
				orgcode: {
					required: "机构编码不能为空"
				},
				parentname: {
					required: "上级机构不能为空"
				},
				principal: {
					required: "负责人不能为空",
				},
				principalmtel: {
					required: "移动电话不能为空",
					mobile: "手机号码格式错误"
				},
				districtname: {
					required: "行政区域不能为空"
				},
				address: {
					required: "地址不能为空"
				},
				postcode: {
					postcode: "邮政编码格式错误"
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
		url : BASE_URL+'/system/sysorg/savemember',
		cache : false,
		dataType : 'json',
		data : $("#orgform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().loadOrgTree();//刷新树();
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
