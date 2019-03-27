$(document).ready(function() {
	
	$("#dssCasecanappForm").validate({
		rules: {
			legalpercomp: {
				required: true
			},
			resppername: {
				required: true
			},
			tel: {
				required: true,
				isTelephone: true
			},
			inputuser: {
				required: true
			},
			mobile: {
				required: true,
				isPhone: true
			},
			email: {
				required: true,
				isEmail: true
			},
			fax: {
				required: true
			},
			cancelapplyreason: {
				required: true
			}
		},
		messages: {
			legalpercomp: {
				required: "法人单位名称不能为空"
			},
			resppername: {
				required: "填报单位负责人不能为空"
			},
			tel: {
				required: "电话不能为空"
			},
			inputuser: {
				required: "填报人不能为空"
			},
			mobile: {
				required: "手机不能为空"
			},
			email: {
				required: "电子邮箱不能为空"
			},
			fax: {
				required: "传真不能为空"
			},
			cancelapplyreason: {
				required: "申请核销理由不能为空"
			}
		}
	});
	
	$("#saveBtn").click(function(){
		if($("#dssCasecanappForm").valid())
			save('/dangersource/dssCasecancelApply/save');
	});
	
	$("#submitBtn").click(function(){
		if($("#dssCasecanappForm").valid()) 
			save('/dangersource/dssCasecancelApply/submit');
	});
	
});

/**保存*/
function save(url){
	$.ajax({
		type : 'post',
		url : BASE_URL + url,
		cache : false,
		dataType : 'json',
		data : $("#dssCasecanappForm").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.parent.getActiveIFrame().reloadGrid();//刷新列表
//                parent.$('#ent_baseinfo').val("true");	//父页面 		
//				parent.loadSafemenutree();
				window.location.reload();
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.toast("保存失败");
		}
	});
}

