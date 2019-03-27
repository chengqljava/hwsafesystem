
$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadUserType("usertype");//用户类型
	SelectOption.loadTureFalse("ismember");//是否成员单位

	$("#roleform").validate({
		rules: {
			rolename: {
				required: true,
				rangelength:[2,25],
				remote:{
				    url: BASE_URL+'/system/govrole/existsRole',     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
						roleid: function() {
				            return $("#roleid").val();
				        },
				        rolename: function() {
				            return $("#rolename").val();
				        }
				    }
				}
			},
			usertype: {
				required: true
			},
			ismember: {
				required: true
			}
		},
		messages: {
			rolename: {
				required: "角色名不能为空",
				rangelength: "请输入2-25个字符",
				remote: "角色已存在!"
			},
			usertype: {
				required: "用户类型不能为空"
			},
			ismember: {
				required: "是否成员单位不能为空"
			}
		},
		submitHandler:function(form){
			addRole();
	    }   
	});
	
	/**
	    $('#roleform').formValidation({
	        message: 'This value is not valid',
	        icon: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	rolename: {
	        		message: '角色名不能为空',
	                validators: {
	                    notEmpty: {},
	                    stringLength: {
	                        min: 2,
	                        max: 25
	                    },
	                    remote: {
	                        type: 'post',
	                        url: BASE_URL+'/system/govrole/existsRole',
	                        message: '角色已存在!',
	                 		dataType:'json',
	                  		data:{"roleid": $("#roleid").val(),"rolename": $("#rolename").val()}
	                    }
	                }
	            },
	            usertype: {
	        		message: '用户类型不能为空',
	                validators: {
	                    notEmpty: {}
	                }
	            },
	            orgname: {
	        		message: '机构不能为空',
	                validators: {
	                    notEmpty: {}
	                },
	                trigger:"focus"
	            }
	        }
	    })
	    .on('success.form.fv', function(e) {
	    	 e.preventDefault();
	    	 addRole();
	    });
*/
	});

function addRole(){
	    $.ajax({
			type : 'post',
			url : BASE_URL+'/system/govrole/save',
			cache : false,
			dataType : 'json',
			data : $("#roleform").serializeArray(),
			global : false,
			success : function(map) {
			  if(map.success==true){
				  parent.toast(map.msg);//弹出提示信息
				  parent.getActiveIFrame().reloadGrid();//重新加载
				  parent.closeWin();// 关闭弹出框
			  }else{
				  parent.toast(map.msg);
			  }
			},
			error : function() {
				parent.toast("保存失败");
			}
		});
	    
}
