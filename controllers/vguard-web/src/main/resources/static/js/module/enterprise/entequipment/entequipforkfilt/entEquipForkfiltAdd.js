$(document).ready(function() {

	$("#equipforfiltform").validate({
		rules: {
			devicename: {
				required: true,
				rangelength:[1,25]
			},
			specmodel: {
				required: true,
				rangelength:[1,25]
			},
			registnumber: {
				required: true,
				rangelength:[1,25]
			},
			platenum: {
				required: true,
				rangelength:[1,25]
			},
			starttime: {
				required: true,
			},
			checktime: {
				required: true
			},
			nextchecktime: {
				required: true
			},
			registrationcode: {
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
			registnumber: {
				required: "证书编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			platenum: {
				required: "使用证号(车牌号)不能为空",
				rangelength: "请输入1-25个字符"
			},
			starttime: {
				required: "投用时间不能为空",
			},
			checktime: {
				required: "检验日期不能为空"
			},
			nextchecktime: {
				required: "下次检验日期不能为空"
			},
			registrationcode: {
				required: "注册代码不能为空",
				rangelength: "请输入1-25个字符"
			},
			instalposition: {
				required: "使用地点不能为空",
				rangelength: "请输入1-50个字符"
			},
			manufacturer: {
				required: "制造厂家不能为空",
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
		url : BASE_URL+'/enterprise/entequipforkfilt/save',
		cache : false,
		dataType : 'json',
		data : $("#equipforfiltform").serializeArray(),
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
