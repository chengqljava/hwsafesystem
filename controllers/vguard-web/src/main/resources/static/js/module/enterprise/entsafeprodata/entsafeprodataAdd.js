$(document).ready(function() {
	 //资料类型(大类)下拉框
	SelectOption.loadDataOneType("dataonetype");

	showUploadFile('myfile','file', true);//显示文件上传控件
	
	$("#safeprodataform").validate({
		rules: {
			dataonetype: {
				required: true
			},
			datatwotype: {
				required: true
			},
			enacttime: {
				required: true
			},
			filemyfile: {
				required: true
			}
		},
		messages: {
			dataonetype: {
				required: "请选择资料类型(大类)!"
			},
			datatwotype: {
				required: "请选择资料类型(小类)!"
			},
			enacttime: {
				required: "制定时间不能为空"
			},
			filemyfile: {
				required: "请上传附件!"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
		       if (element.is(':file')) { 
		         var eid = element.attr('name'); //获取元素的name属性
		         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
		       } else {
		    	   error.insertAfter(element);
		       }
		},
		submitHandler:function(form){
			 $('#datatwotype').attr("disabled",false);
			 save();
	    }   
	});
});

/**保存*/
function save(){
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/enterprise/entsafeprodata/save',
		secureuri:false,
	    files : ['myfile'],
		cache : false,
		dataType : 'json',
		data : $("#safeprodataform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].reloadGrid();//刷新列表
				parent.frames["layui-layer-iframe"+index].$('#ent_safeprodata').val("true");
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();
				parent.parent.closeWin();// 关闭弹出框
			}else{
				parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.toast("保存失败");
		}
	});
}

function selectOneType(){
	$('#datatwotype').empty();
	var dataonetype = $('#dataonetype').val();
	if(dataonetype!=undefined && dataonetype!=null && dataonetype!=""){
		$('#datatwotype').attr('disabled',false);
		  SelectOption.loadDataTwoType("datatwotype",dataonetype);
	}else{
		$('#datatwotype').attr('disabled',true);
	}
}