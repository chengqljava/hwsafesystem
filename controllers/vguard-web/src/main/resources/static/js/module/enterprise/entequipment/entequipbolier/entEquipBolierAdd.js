$(document).ready(function() {

	$("#equipbolierform").validate({
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
			certificatenum: {
				required: true,
				rangelength:[1,25]
			},
			registnumber: {
				required: true,
				rangelength:[1,25]
			},
			testtime: {
				required: true
			},
			effectivetime: {
				required: true
			},
			workingmedium: {
				required: true,
				rangelength:[1,25]
			},
			instalposition: {
				required: true,
				rangelength:[1,25]
			},
			manufacturer: {
				required: true,
				rangelength:[1,25]
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
				required: "出厂编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			certificatenum: {
				required: "证书编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			registnumber: {
				required: "登记编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			testtime: {
				required: "检定日期不能为空"
			},
			effectivetime: {
				required: "有效期至不能为空"
			},
			workingmedium: {
				required: "工作介质不能为空",
				rangelength: "请输入1-25个字符"
			},
			instalposition: {
				required: "安装位置不能为空",
				rangelength: "请输入1-50个字符"
			},
			manufacturer: {
				required: "制造单位不能为空",
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
		url : BASE_URL+'/enterprise/entequipbolier/save',
		cache : false,
		dataType : 'json',
		data : $("#equipbolierform").serializeArray(),
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
