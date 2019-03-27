$(document).ready(function() {

	//初始化用户列表
	var groupid = $("#groupid").val();
	if(groupid==''){
		SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","grouphead",{"orgid":$("#orgid").val(),"usertype":"lawuser"});	
	}else{
		SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","grouphead",{"orgid":$("#orgid").val(),"usertype":""});
	}
	SelectTree.loadSelfDistrictSelect("districtname");
	
	$("#groupform").validate({
		rules: {
			groupname: {
				required: true
			},
			districtname: {
				required: true
			},
			grouphead: {
				required: true
			}
		},
		messages: {
			groupname: {
				required: "执法组名称不能为空"
			},
			districtname: {
				required: "行政区域不能为空"
			},
			grouphead: {
				required: "负责人不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

//选择下拉用户
function selectUser(){
	//var userid = $("#grouphead").val();
	//setUserValue(userid);
}

//新增用户
function addNewUser(){
	parent.openWin(BASE_URL+"/law/lawdept/addNewUser",'新增用户','60%','55%');
}

//初始化用户列表
function reloadOrgUser(userid){
	$("#grouphead").empty();
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","grouphead",{"orgid":$("#orgid").val(),"usertype":"lawuser"});	
	setUserValue(userid);
}

//设置选中用户的其他默认值
function setUserValue(userid){
	$("#grouphead").val(userid);
}


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawgroup/save',
		cache : false,
		dataType : 'json',
		data : $("#groupform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新父列表（执法组列表）
				parent.getActiveIFrame().reloadGrid();//刷新页面列表（执法部门列表）
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

