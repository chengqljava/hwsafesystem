$(document).ready(function() {

	showUploadFile('attachname','image');
	
	SelectOption.loadTureFalse("israndom");
	SelectOption.loadSex("sex");
	SelectOption.loadEducation("education");
	SelectTree.loadSelfDistrictSelect("districtname");
	SelectOption.loadExecType("exectype");
	SelectOption.loadCaseScope("casescope");
	SelectOption.loadTureFalse("isonpost");
	SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawuser/lawdeptselect","deptid");	
    SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawuser/lawgroupselect","groupid",{"deptid":$("#olddeptid").val()});
	
	
	$("#userform").validate({
		rules: {
			districtname: {
				required: true
			},
			exectype: {
				required: true
			},
			execcode: {
				required: true
			},
			casescope: {
				required: true
			},
			isonpost: {
				required: true
			},
			phone: {
				required: true,
				isPhone:true
			},
			deptid: {
				required: true
			},
			tel: {
				isTelephone: true
			},
			email:{
				isEmail: true
			},
			idcard:{
				isIdCard: true
			}
		},
		messages: {
			districtname: {
				required: "行政区域不能为空"
			},
			exectype: {
				required: "身份属性不能为空"
			},
			execcode: {
				required: "执法证号不能为空"
			},
			casescope: {
				required: "查看案件范围不能为空"
			},
			isonpost: {
				required: "是否在岗不能为空"
			},
			phone: {
				required: "手机号码不能为空"
			},
			deptid: {
				required: "所属部门不能为空"
			}
		},
		submitHandler:function(form){
	    	save();
	    }   
	});
});


//选择执法部门
function selectDept(){
	var deptid = $("#deptid").val();
	$("#groupid").val("");
	$("#groupid").empty();
	if(deptid!=''){
		SelectOption.loadBaseCodeFromDB(BASE_URL+"/law/lawuser/lawgroupselect","groupid",{"deptid":deptid});
	}
}

/**保存*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    } 
	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/law/lawuser/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#userform").serializeArray(),
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

/**
 * 删除附件
 * @param id
 */
function deleteAttach(id){
	$('#'+id).remove();
	$('#attachname').show();
}

function resize_img(pic){
	if(pic.width>300){pic.resized=true;pic.style.width=300;}
}