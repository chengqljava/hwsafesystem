$(document).ready(function() {
	
	//初始化用户列表
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","userid",{"orgid":$("#orgid").val(),"usertype":"patroller"});	

	//初始化下拉框
	SelectOption.loadSex("sex");
	SelectOption.loadPatrollerType("patrollertype");
	
	
	$("#patrollerform").validate({
		rules: {
			userid: {
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
			userid: {
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

//选择下拉用户
function selectUser(){
	var userid = $("#userid").val();
	setUserValue(userid);
}

//新增用户
function addNewUser(){
	parent.openWin(BASE_URL+"/hiddendanger/hdipatroller/addNewUser",'新增用户','60%','55%');
}

//初始化用户列表
function reloadOrgUser(userid){
	$("#userid").empty();
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","userid",{"orgid":$("#orgid").val(),"usertype":"patroller"});	
	setUserValue(userid);
}

//设置选中用户的其他默认值
function setUserValue(userid){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdipatroller/loadUserById',
		cache : false,
		dataType : 'json',
		data : {"userid":userid},
		global : false,
		success : function(json) {
			if(json){
				$("#userid").val(userid);
				if(json.birthday){
					$("#birthday").val(getFormatDateByLong(json.birthday,"yyyy-MM-dd"));
				}
				$("#sex").val(json.sex);
				$("#address").val(json.address);
				$("#telephone").val(json.tel);
				$("#phone").val(json.phone);
				$("#hometel").val(json.hometel);
			}
		},
		error : function() {
			
		}
	});
}


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

