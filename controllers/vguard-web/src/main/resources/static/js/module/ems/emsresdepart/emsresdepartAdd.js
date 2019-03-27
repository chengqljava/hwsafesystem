$(document).ready(function() {

	$("#deptform").validate({
		rules: {
			departno: {
				required: true,
				remote:{
				    url: BASE_URL+'/ems/emsresdepart/existsDeptno',     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	departid: function() {
				            return $("#departid").val();
				        },
				        departno: function() {
				            return $("#departno").val();
				        }
				    }
				}
			},
			departname: {
				required: true
			}
		},
		messages: {
			departno: {
				required: "部门编号不能为空",
				remote: "部门编号已存在!"
			},
			departname: {
				required: "部门名称不能为空"
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
		url : BASE_URL+'/ems/emsresdepart/save',
		cache : false,
		dataType : 'json',
		data : $("#deptform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新父列表（应急部门列表）
				parent.getActiveIFrame().reloadGrid();//刷新页面列表（应急机构列表）
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

