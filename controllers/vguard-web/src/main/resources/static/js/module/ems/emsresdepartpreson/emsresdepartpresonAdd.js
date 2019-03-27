$(document).ready(function() {
	
	//初始化用户列表
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/ems/emsresdepartpreson/emsdeptselect","deptid",{"orgid":$("#orgid").val()});	
	
	
	$("#userform").validate({
		rules: {
			name: {
				required: true
			},
			groupduty: {
				required: true
			},
			cellphone: {
				required: true,
				isPhone: true
			},
			officetel: {
				isTelephone: true
			},
			privatetel: {
				isTelephone: true
			},
			responsibility: {
				maxlength: 250
			}
		},
		messages: {
			name: {
				required: "姓名不能为空"
			},
			groupduty: {
				required: "职务不能为空"
			},
			cellphone: {
				required: "手机不能为空"
			},
			responsibility: {
				maxlength: "最多输入250字"
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
		url : BASE_URL+'/ems/emsresdepartpreson/save',
		cache : false,
		dataType : 'json',
		data : $("#userform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新父列表（应急人员列表）
				var tsdept = $("#tsdept").val();
				if(tsdept){
					var i = parent.getGrandIndex();
					parent.frames["layui-layer-iframe"+i].reloadGrid();//刷新祖父列表（应急部门列表）
				}
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

