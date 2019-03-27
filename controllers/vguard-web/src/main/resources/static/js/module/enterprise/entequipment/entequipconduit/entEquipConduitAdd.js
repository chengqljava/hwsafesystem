$(document).ready(function() {
	
	$("#equipconduitform").validate({
		rules: {
			devicename: {
				required: true,
				rangelength:[1,25]
			},
			specmodel: {
				required: true,
				rangelength:[1,25]
			},
			devicecode: {
				required: true,
				rangelength:[1,25]
			},
			area: {
				required: true,
				rangelength:[1,50]
			},
			devicevariety: {
				required: true,
				rangelength:[1,25]
			},
			devicetype: {
				required: true,
				rangelength:[1,25]
			},
			workingpressure: {
				required: true,
				dRessureCheck:true
			},
			designtemp: {
				required: true,
				cRessureCheck:true
			},
			material: {
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
			}
		},
		messages: {
			devicename: {
				required: "设备名称不能为空",
				rangelength: "请输入1-25个字符"
			},
			specmodel: {
				required: "规格型号不能为空",
				rangelength: "请输入1-25个字符"
			},
			devicecode: {
				required: "管道编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			area: {
				required: "所在区县不能为空",
				rangelength: "请输入1-50个字符"
			},
			devicevariety: {
				required: "设备品种不能为空",
				rangelength: "请输入1-25个字符"
			},
			devicetype: {
				required: "设备类别不能为空",
				rangelength: "请输入1-25个字符"
			},
			workingpressure: {
				required: "使用压力不能为空",
				dRessureCheck: "只能输入两位整数,小数后精确2位"
			},
			designtemp: {
				required: "设计温度不能为空",
				cRessureCheck: "只能输入三位整数,小数后精确1位"
			},
			material: {
				required: "材质不能为空",
				rangelength: "请输入1-25个字符"
			},
			workingmedium: {
				required: "工作介质不能为空",
				rangelength: "请输入1-25个字符"
			},
			instalposition: {
				required: "安装位置不能为空",
				rangelength: "请输入1-50个字符"
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
		url : BASE_URL+'/enterprise/entequipconduit/save',
		cache : false,
		dataType : 'json',
		data : $("#equipconduitform").serializeArray(),
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
