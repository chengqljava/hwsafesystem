$(document).ready(function() {
	
	/* 管道选择 */
	$("#conduitname").on("click", function () {
		var entid = $("#entid").val();
		console.log(entid);
		parent.openWin(BASE_URL+"/enterprise/entequipconduit/conduitlist/"+entid,'管道','60%','60%');
	});
	
	$("#equipsafevalveform").validate({
		rules: {
			specodel: {
				required: true,
				rangelength:[1,25]
			},
			conduitid: {
				required: true
			},
			testcode: {
				required: true,
				rangelength:[1,25]
			},
			setpressure: {
				required: true,
				bRessureCheck: true
			},
			approvalcode: {
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
			appraisaltime: {
				required: true
			},
			effectivetime: {
				required: true
			},
			state: {
				required: true,
				digits:true
			}
		},
		messages: {
			specodel: {
				required: "规格型号不能为空",
				rangelength: "请输入1-25个字符"
			},
			conduitid: {
				required: "管道不能为空"
			},
			testcode: {
				required: "检验编号不能为空",
				rangelength: "请输入1-25个字符"
			},
			setpressure: {
				required: "整定压力不能为空",
				bRessureCheck: "只能输入两位整数,小数后精确3位"
			},
			approvalcode: {
				required: "核准证号不能为空",
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
			appraisaltime: {
				required: "鉴定日期不能为空"
			},
			effectivetime: {
				required: "使用有效期不能为空"
			},
			state: {
				required: "公称通径不能为空",
				digits: "请输入正整数"
			}
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/**
 * 给所选择管道赋值
 * @param entInfoObj
 */
function setEntInfo(entInfoObj){
	$("#conduitid").val(entInfoObj.conduitid);
	$("#conduitname").val(entInfoObj.devicename);
}

/**保存*/
function save(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entequipsafevalve/save',
		cache : false,
		dataType : 'json',
		data : $("#equipsafevalveform").serializeArray(),
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
