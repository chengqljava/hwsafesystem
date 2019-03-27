$(document).ready(function() {
	    //行业类型
    	SelectOption.loadIndustryType("industrytype");
	    //三小类型
    	SelectOption.loadThreeType("threetype");
	    //监管分类
		SelectTree.loadManagerTypeSelect("managertypename");
	    //行业主管分类
		SelectTree.loadDirectorTypeSelect("parentname");

		$("#directortypeform").validate({
			rules: {
				directortypecode: {
					required: true,
					rangelength:[1,10],
					remote:{
					    url: BASE_URL+'/system/sysdirectortype/existsCode',     //后台处理程序
					    type: "post",               //数据发送方式
					    dataType: "json",           //接受数据格式   
					    data: {                     //要传递的数据
					    	directortypeid: function() {
					            return $("#directortypeid").val();
					        },
					        directortypecode: function() {
					            return $("#directortypecode").val();
					        }
					    }
					}
				},
				directortypename: {
					required: true,
					rangelength:[1,50]
				},
				industrytype: {
					required: true
				},
				managertypename: {
					required: true
				},
				parentname: {
					required: true
				}
			},
			messages: {
				directortypecode: {
					required: "编码不能为空",
					rangelength: "请输入1-10个字符",
					remote: "编码已存在!"
				},
				directortypename: {
					required: "名称不能为空",
					rangelength: "请输入1-50个字符"
				},
				industrytype: {
					required: "行业类型不能为空"
				},
				managertypename: {
					required: "监管分类不能为空"
				},
				parentname: {
					required: "父节点不能为空"
				}
			},
			submitHandler:function(form){
				save();
		    }   
		});
		
		
		/**
		$('#directortypeform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	directortypecode: {
	        		message: '编码不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 10
	                    },
	                    remote: {
	                        type: 'post',
	                        url: BASE_URL+'/system/sysdirectortype/existsCode',
	                        message: '编码已存在!',
	                 		dataType:'json',
	                  		data:{"directortypeid": $("#directortypeid").val(),"directortypecode": $("#directortypecode").val()}
	                    }
	                }
	            },
	            directortypename: {
	        		message: '名称不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 1,
	                        max: 25
	                    }
	                }
	            },
	            industrytype: {
	        		message: '行业类型不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            managertypename: {
	        		message: '监管分类不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            },
	            parentname: {
	        		message: '父节点不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            }
	        }
		}) 
		.on('success.form.fv', function(e) {
		   	 e.preventDefault();
		   	 save();
		});
		*/
});


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/system/sysdirectortype/save',
		cache : false,
		dataType : 'json',
		data : $("#directortypeform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.getActiveIFrame().loadDirectortypeTree();//刷新树();
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
