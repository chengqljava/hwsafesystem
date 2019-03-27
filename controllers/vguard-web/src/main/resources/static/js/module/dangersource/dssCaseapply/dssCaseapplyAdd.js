$(document).ready(function() {
	
	//行政区域(市)下拉框
	SelectOption.loadDistrict("city",{"districtlevel":"0"}); //0:市级
	
	// 备案申请类型
	SelectOption.loadCaseapplytype("caseapplytype");
	
	//危险化学品单位类型
	SelectOption.loadDangerchemcomptype("dangerchemcomptype");
	
	//经济类型
	SelectOption.loadEconomytype("economytype");
	
	$("#dssCaseApplyForm").validate({
		rules: {
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
			employeenumber: {
				required: true,
				digits : true
			},
			companyarea: {
				required:true,
				number:true,
				range : [0, 9999999999.99]
			},
			caseapplytype: {
				required: true
			},
			dangerchemcomptype: {
				required: true
			},
			industry: {
				required: true
			},
			economytype: {
				required: true
			}
		},
		messages: {
			resppername: {
				required: "填报单位负责人不能为空"
			},
			tel: {
				required: "电话不能为空"
			},
			inputuser: {
				required: "填报人姓名不能为空"
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
			employeenumber: {
				required: "单位从业人员数量不能为空",
				digits : "只能填写整数",
			},
			companyarea: {
				required: "占地面积不能为空",
				number : "只能填写数字",
				range : "超出最大范围:9999999999.99"
			},
			caseapplytype: {
				required: "备案申请类型不能为空"
			},
			dangerchemcomptype: {
				required: "危险化学品单位类型不能为空"
			},
			industry: {
				required: "所在行业不能为空"
			},
			economytype: {
				required: "经济类型不能为空"
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
		url : BASE_URL+'/dangersource/dssCaseApply/save',
		cache : false,
		dataType : 'json',
		data : $("#dssCaseApplyForm").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				parent.parent.getActiveIFrame().reloadGrid();//刷新列表
				if(json.dataId != null)
					$("#applyid").val(json.dataId);
				
//				parent.parent.closeWin();// 关闭弹出框
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.toast("保存失败");
		}
	});
}

