$(document).ready(function() {
	
	//初始化下拉框
	SelectOption.loadSex("sex");
	SelectOption.loadPatrollerType("patrollertype");
	
	
	$("#patrollerform").validate({
		rules: {
			nickname: {
				required: true
			},
			sex: {
				required: true
			},
			patrollertype: {
				required: true
			},
			job: {
				required: true
			},
			telephone: {
				required: true,
				isTelephone: true
			},
			phone: {
				required: true,
				isPhone: true
			},
			hometel: {
				isTelephone: true
			}
		},
		messages: {
			nickname: {
				required: "巡查人员不能为空"
			},
			sex: {
				required: "性别不能为空"
			},
			patrollertype: {
				required: "人员身份不能为空"
			},
			job: {
				required: "职务/职称不能为空"
			},
			telephone: {
				required: "办公室电话不能为空"
			},
			phone: {
				required: "手机不能为空"
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
		url : BASE_URL+'/hiddendanger/hdipatroller/save',
		cache : false,
		dataType : 'json',
		data : $("#patrollerform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				//parent.toast(json.msg);
				parent.layer.alert(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

