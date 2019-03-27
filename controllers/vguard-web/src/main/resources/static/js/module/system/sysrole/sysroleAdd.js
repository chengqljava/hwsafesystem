
$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadUserType("usertype");//用户类型

	$("#roleform").validate({
		rules: {
			rolename: {
				required: true,
				rangelength:[2,25],
				remote:{
				    url: BASE_URL+'/system/sysrole/existsRole',     //后台处理程序
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
			}
		},
		submitHandler:function(form){
			addRole();
	    }   
	});
		
	
	/*
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
	                        url: BASE_URL+'/system/sysrole/existsRole',
	                        message: '角色已存在!',
	                 		dataType:'json',
	                  		data:{"roleid": $("#roleid").val(),"rolename": $("#rolename").val()}
	                    }
	                }
	            },
	            usertype: {
	        		message: '角色类型不能为空',
	                validators: {
	                    notEmpty: {},
	                    remote: {
	                        type: 'post',
	                        url: BASE_URL+'/system/sysrole/loadRolePrivLinkById',
	                        message: '角色有非目标角色类型的权限，不能修改角色类型！',
	                 		dataType:'json',
	                  		data:{"roleid": $("#roleid").val(),"oldusertype": $("#oldusertype").val(),"usertype": $("#usertype").val()}
	                    }
	                }
	            }
	        }
	    })
	    .on('success.form.fv', function(e) {
	    	 e.preventDefault();
	    	 addRole();
	    	 //checkUserType();
	    });*/
	});

function checkUserType(){
	var roleid = $("#roleid").val();
	//编辑
	if(roleid){
		var oldusertype = $("#oldusertype").val();
		var newusertype = $("#usertype").val();
		if(oldusertype==newusertype){
			addRole();
		}else{
			var param = {"roleid":roleid,"usertype":newusertype};
			//查询角色是否有非目标角色类型的权限，有则不可以改变角色的类型	
			$.ajax({ 
			  		url: BASE_URL+"/system/sysrole/loadRolePrivLinkById",
			  		type:'post',
			  		dataType:'json',
			  		data:param,
			  		success: function(json){
			  			if(json.success==false){
			  				//有关联引用
			  				parent.toast(json.msg);
			  				$("#usertype").val(oldusertype);
			  			}else{
			  				addRole();
			  			}
			  		}
			});
		}
	}else{
		addRole();
	}
}

function addRole(){
	    $.ajax({
			type : 'post',
			url : BASE_URL+'/system/sysrole/save',
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
