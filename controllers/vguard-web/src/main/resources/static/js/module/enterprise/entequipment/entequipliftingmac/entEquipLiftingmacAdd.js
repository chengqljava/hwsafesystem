$(document).ready(function() {

	//初始化下拉框
	SelectOption.loadTestResult("inspectresult"); //检验结果
	
	$("#equipliftingmacform").validate({
		rules: {
			equipname: {
				required: true
			},
			equipcode: {
				required: true
			},
			equiptype: {
				required: true
			},
			equipmodel: {
				required: true
			},
			equiplevel: {
				required: true
			},
			registcode: {
				required: true
			},
			makeent: {
				required: true
			},
			makeenttele: {
				required: true
			},
			inspectdate: {
				required: true
			},
			nextinspectdate: {
				required: true
			},
			inspectresult: {
				required: true
			},
			usedate: {
				required: true
			},
			liftingspeed: {
				dRessureCheck: true
			},
			liftingheight: {
				dRessureCheck: true
			},
			liftingweight:{
				wRessureCheck: true
			},
			liftingtorque: {
				digits: true
			},
			workradius: {
				digits: true
			}
		},
		messages: {
			equipname: {
				required: "设备名称不能为空"
			},
			equipcode: {
				required: "设备编号不能为空"
			},
			equiptype: {
				required: "设备类别不能为空"
			},
			equipmodel: {
				required: "设备型号不能为空"
			},
			equiplevel: {
				required: "设备级别不能为空"
			},
			registcode: {
				required: "设备注册代码不能为空"
			},
			makeent: {
				required: "制造单位不能为空"
			},
			makeenttele: {
				required: "制造单位电话不能为空"
			},
			inspectdate: {
				required: "检验日期不能为空"
			},
			nextinspectdate: {
				required: "下次检验日期不能为空"
			},
			inspectresult: {
				required: "检验结论不能为空"
			},
			usedate: {
				required: "投用日期不能为空"
			},
			liftingspeed: {
				dRessureCheck: "只能输入两位整数，精确两位小数"
			},
			liftingheight: {
				dRessureCheck: "只能输入两位整数，精确两位小数"
			},
			liftingweight:{
				wRessureCheck: "只能输入三位整数，精确两位小数"
			},
			liftingtorque: {
				digits: "只能输入整数"
			},
			workradius: {
				digits: "只能输入整数"
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
		url : BASE_URL+'/enterprise/entequipliftingmac/save',
		cache : false,
		dataType : 'json',
		data : $("#equipliftingmacform").serializeArray(),
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
