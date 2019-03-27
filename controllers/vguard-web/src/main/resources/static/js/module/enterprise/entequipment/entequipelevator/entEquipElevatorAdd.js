$(document).ready(function() {

	//初始化下拉框
	SelectOption.loadTestResult("inspectresult"); //检验结果
	
	$("#entequipelevatorform").validate({
		rules: {
			equipname: {
				required: true
			},
			equipcode: {
				required: true
			},
			elevatortype: {
				required: true
			},
			elevatormodel: {
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
			elevation: {
				wRessureCheck: true
			},
			loadspeed: {
				dRessureCheck: true
			},
			loadweight: {
				digits: true
			},
			floornum: {
				digits: true
			},
			stepwidth: {
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
			elevatortype: {
				required: "电梯类别不能为空"
			},
			elevatormodel: {
				required: "电梯型号不能为空"
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
			elevation: {
				wRessureCheck: "只能输入三位整数，精确两位小数"
			},
			loadspeed: {
				dRessureCheck: "只能输入两位整数，精确两位小数"
			},
			loadweight: {
				digits: "只能输入整数"
			},
			floornum: {
				digits: "只能输入整数"
			},
			stepwidth: {
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
		url : BASE_URL+'/enterprise/entequipelevator/save',
		cache : false,
		dataType : 'json',
		data : $("#entequipelevatorform").serializeArray(),
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
