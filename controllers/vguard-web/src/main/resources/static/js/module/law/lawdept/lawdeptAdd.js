$(document).ready(function() {

	SelectTree.loadLawDeptSelect("parentname");
	//初始化用户列表
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","depthead",{"orgid":$("#orgid").val(),"usertype":"lawuser"});	

	//SelectTree.loadSelfDistrictSelect("districtname");
	
	$("#deptform").validate({
		rules: {
			deptcode: {
				required: true,
				remote:{
				    url: BASE_URL+'/law/lawdept/existsDeptCode',     //后台处理程序
				    type: "post",               //数据发送方式
				    dataType: "json",           //接受数据格式   
				    data: {                     //要传递的数据
				    	deptid: function() {
				            return $("#deptid").val();
				        },
				        deptcode: function() {
				            return $("#deptcode").val();
				        }
				    }
				}
			},
			deptname: {
				required: true
			},
			districtname: {
				required: true
			},
			depthead: {
				required: true
			},
			title: {
				required: true
			}
		},
		messages: {
			deptcode: {
				required: "部门编号不能为空",
				remote: "部门编号已存在!"
			},
			deptname: {
				required: "部门名称不能为空"
			},
			districtname: {
				required: "所在区域不能为空"
			},
			depthead: {
				required: "负责人不能为空"
			},
			title: {
				required: "案件编头不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});

//选择下拉用户
function selectUser(){
	//var userid = $("#depthead").val();
	//setUserValue(userid);
}

//新增用户
function addNewUser(){
	parent.openWin(BASE_URL+"/law/lawdept/addNewUser",'新增用户','60%','55%');
}

//初始化用户列表
function reloadOrgUser(userid){
	$("#depthead").empty();
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/system/sysuser/orgotheruserselect","depthead",{"orgid":$("#orgid").val(),"usertype":"lawuser"});	
	setUserValue(userid);
}

//设置选中用户的其他默认值
function setUserValue(userid){
	$("#depthead").val(userid);
}


/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawdept/save',
		cache : false,
		dataType : 'json',
		data : $("#deptform").serializeArray(),
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

