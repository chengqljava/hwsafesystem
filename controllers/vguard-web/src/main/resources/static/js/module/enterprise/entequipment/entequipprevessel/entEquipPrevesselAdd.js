$(document).ready(function() {
	
	SelectOption.loadVesselType("vesseltype"); 
	SelectOption.loadSafetylevel("safetylevel"); 
	SelectOption.loadPrevesselState("state"); 
	SelectOption.loadTestResult("testresult"); 
	
	$("#equipprevesselform").validate({
		rules: {
			devicename: {
				required: true,
				rangelength:[1,25]
			},
			devicenum: {
				required: true,
				isDecimal:true
			},
			designpressure: {
				required: true,
				dRessureCheck:true
			},
			workingpressure: {
				required: true,
				dRessureCheck:true
			},
			volume: {
				required: true,
				wRessureCheck:true
			},
			devicecode: {
				required: true,
				rangelength:[1,25]
			},
			vesseltype: {
				required: true
			},
			productnum: {
				required: true,
				rangelength:[1,25]
			},
			registnumber: {
				required: true,
				rangelength:[1,25]
			},
			manufacturer: {
				required: true,
				rangelength:[1,25]
			},
			workingmedium: {
				required: true,
				rangelength:[1,25]
			},
			instalposition: {
				required: true,
				rangelength:[1,50]
			},
			safetylevel: {
				required: true
			},
			starttime: {
				required: true
			},
			effectivetime: {
				required: true
			},
			state: {
				required: true
			},
			testresult: {
				required: true
			}
		},
		messages: {
			devicename: {
				required: "压力容器名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			devicenum: {
				required: "数量不能为空",
				isDecimal: "请输入正确的数字格式"
			},
			designpressure: {
				required: "设计压力不能为空",
				dRessureCheck: "只能输入两位整数,小数后精确2位"
			},
			workingpressure: {
				required: "工作压力不能为空",
				dRessureCheck: "只能输入两位整数,小数后精确2位"
			},
			volume: {
				required: "容积不能为空",
				wRessureCheck: "只能输入三位整数,小数后精确2位"
			},
			devicecode: {
				required: "设备代码不能为空",
				rangelength: "请输入1-25个字符"
			},
			vesseltype: {
				required: "容器类型不能为空"
			},
			productnum: {
				required: "产品编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			registnumber: {
				required: "使用登记证编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			manufacturer: {
				required: "制造厂家不能为空",
				rangelength: "请输入1-25个字符"
			},
			workingmedium: {
				required: "工作介质不能为空",
				rangelength: "请输入1-25个字符"
			},
			instalposition: {
				required: "安装位置不能为空",
				rangelength: "请输入1-50个字符"
			},
			safetylevel: {
				required: "安全等级不能为空"
			},
			starttime: {
				required: "投用时间不能为空"
			},
			effectivetime: {
				required: "有效期至不能为空"
			},
			state: {
				required: "是否停用不能为空"
			},
			testresult: {
				required: "检定结论不能为空"
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
		url : BASE_URL+'/enterprise/entequipprevessel/save',
		cache : false,
		dataType : 'json',
		data : $("#equipprevesselform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
//				parent.toast(json.msg);//弹出提示信息
//				var index = parent.getParentIndex();
//				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
//				parent.frames["layui-layer-iframe"+index].$('#ent_safereward').val("true");
//				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
//				parent.closeWin();// 关闭弹出框
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//刷新列表
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
