$(document).ready(function() {
	    //权限级别
	    SelectOption.loadPrivLevel("privlevel");
	    //授权人类型
	    SelectOption.loadUserType("usertype");
	    
	    var usertype = $('#usertype').val();
	    
	    //父权限
		SelectTree.loadPrivIdSelect("parentname",{"usertype":usertype});
	  
		/**字符下划线验证*/
		jQuery.validator.addMethod("chr", function(value, element) {
			var chrnum = /^([a-zA-Z_]+)$/;
			return this.optional(element) || (chrnum.test(value));
			}, "只能输入字符(字符A-Z, a-z,_)");
		
		//数字验证
		jQuery.validator.addMethod("num", function(value, element) { 
			var num =  /^[0-9]+$/;
			return this.optional(element) || (num.test(value)); 
			}, "请输入数字");
		
		$("#privform").validate({
			rules: {
				privname: {
					required: true,
					rangelength:[2,25]
				},
				privcode: {
					required: true,
					chr: true,
					remote:{
					    url: BASE_URL+'/system/syspriv/existsPrivCode', //后台处理程序
					    type: "post",               
					    dataType: "json",         
					    data: {  
					    	//要传递的数据 
					    	privid: function() {
					            return $("#privid").val();
					        },
					    	privcode: function() {
					            return $("#privcode").val();
					        }
					    }
					}
				},
				privlevel: {
					required: true
				},
				parentname: {
					required: true
				},
				privimg: {
					chr: true
				},
				ordernum: {
					num: true
				}
			},
			messages: {
				privname: {
					required: "权限名称不能为空",
					rangelength: "请输入2-25个字符"
				},
				privcode: {
					required: "权限编码不能为空",
					chr : "只能输入字符(字符A-Z, a-z, _)",
					remote: "权限编码已存在!"
				},
				privlevel: {
					required: "请选择权限级别!",
				},
				parentname: {
					required: "父权限不能为空"
				},
				privimg: {
					chr: "只能输入字符(字符A-Z, a-z)"
				},
				ordernum: {
					num: "请输入数字"
				}
			},
			submitHandler:function(form){
				$('#usertype').attr("disabled",false);
				save();
		    }   
		});
});

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/syspriv/save',
		cache : false,
		dataType : 'json',
		data : $("#privform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid("","");//刷新列表
				parent.getActiveIFrame().loadPrivTree();//刷新树();
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
