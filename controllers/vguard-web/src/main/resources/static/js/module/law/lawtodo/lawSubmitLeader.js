$(document).ready(function() {
	var menupagetype=$('#menupagetype').val();
	if(menupagetype!="menuApproval"){
		$("#agree").click(function(){
			$("#selectUser").show();
			$("#handleuser").rules("remove");
			$("#handleuser").rules("add",{required:true,messages:{required:"请选择办理人员"}});
				
		});
		
		$("#noagree").click(function(){
			$("#selectUser").hide();
			$("#handleuser").rules("remove");
		});
	}
	
	//校验必填
	$("#lawcaseauditform").validate({
		ignore:"hidden",
		rules: getRules(menupagetype),
		messages: getMessages(menupagetype),	
		submitHandler:function(form){
		    save();
	    }   
	});
	
	if(menupagetype!="menuApproval"){
		//审批人员下拉框
		SelectOption.loadLeaderUser("handleuser",{"userid": $('#userid').val(),"jobtype":$('#jobtype').val()});
	}
	
	
	
	if($("#list").val()){
		//审批意见
		$("#agree").click(function(){
			$("#handleopinion").text("");
			$("#handleopinion").text("同意");
			$("#opinion").val("");
			$("#opinion").val("1");
		});
		
		$("#noagree").click(function(){
			$("#handleopinion").text("");
			$("#handleopinion").text("不同意");
			$("#opinion").val("");
			$("#opinion").val("0");
		});
		
	}
	
	
});

function getRules(menupagetype){
	if(menupagetype=='menuEdit'){
		 return {
			 handleuser: {
					required: true
				}
		 }
	}else if (menupagetype=='menuAduit'){//审核
		return {
			 handleuser: {
					required: true
				},
			 handleopinion:{
					required:true
			 }
		 }
		
	}else if (menupagetype=='menuApproval'){//审批
		return {
			 handleopinion:{
					required:true
				}
		 }
	}
	
	
}
	

function getMessages(menupagetype){
	if(menupagetype=='menuEdit'){
		return {
			handleuser: {
				required: "办理人员不能为空"
			}
		}
	}else if(menupagetype=='menuAduit'){
		return {
			handleuser: {
				required: "办理人员不能为空"
			},
			handleopinion:{
				required:"审核意见不能为空"
			}
		}
		
	}else if(menupagetype=='menuApproval'){
		return {
			handleopinion:{
				required:"审批意见不能为空"
			}
		}
	}
	}

/*保存(新增或编辑)*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/law/lawtodo/save',
		cache : false,
		dataType : 'json',
		data : $("#lawcaseauditform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.closeWin();
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}