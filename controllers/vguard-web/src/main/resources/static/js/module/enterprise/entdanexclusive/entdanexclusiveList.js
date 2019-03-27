$(document).ready(function() {
	//页面加载时设置checkbox选中
	selectcheckbox("cheprocessarr","cheprocess");
	
	/*$("#filediv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });*/
	if ($("#menupagetype").val() != "menuDisplay") {
		showUploadFile('myfile1','file',true);//显示文件上传控件
		showUploadFile('myfile2','file',true);//显示文件上传控件
		showUploadFile('myfile3','file',true);//显示文件上传控件
	}

	$("#entDanexclusiveform").validate({
		rules: {
			cheinstallations: {
				required: true
			},
			storagemedium: {
				required: true
			},
			three: {
				required: true
			},
			pipage: {
				required: true
			},
			mainfacility: {
				required: true
			},
			cheprocess: {
				required: true
			},
			emeequipment: {
				required: true
			},
			"chelicence[0].certificatenum": {
				required: true
			},
			"chelicence[0].licenceissuing": {
				required: true
			},
			"chelicence[0].opendate": {
				required: true
			},
			"chelicence[0].expirydate": {
				required: true
			},
			"chelicence[0].tolrange": {
				required: true
			},
			filemyfile1: {
				required: true,
				imageverify: true
			}
		},
		messages: {
			cheinstallations: {
				required: "是否存在化工装置不能为空"
			},
			storagemedium: {
				required: "危化品储存介质不能为空"
			},
			three: {
				required: "是否涉及建设项目安全设施'三同时'不能为空"
			},
			pipage: {
				required: "是否涉及危化品管道输送不能为空"
			},
			mainfacility: {
				required: "主要设备(装备)、设施不能为空"
			},
			cheprocess: {
				required: "涉及的危险化工工艺不能为空"
			},
			emeequipment: {
				required: "主要应急救援器材、设备设施不能为空"
			},
			"chelicence[0].certificatenum": {
				required: "证书编号不能为空"
			},
			"chelicence[0].licenceissuing": {
				required: "发证机关不能为空"
			},
			"chelicence[0].opendate": {
				required: "发证日期不能为空"
			},
			"chelicence[0].expirydate": {
				required: "证书有效期不能为空"
			},
			"chelicence[0].tolrange": {
				required: "许可范围不能为空"
			},
			filemyfile1: {
				required: "证照不能为空"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
	         var eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       }else if(element.is(':file')){
	    	 eid = element.attr('name'); //获取元素的name属性
	         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
	       }else {
	         error.insertAfter(element);
	       }
	    },
		submitHandler:function(form){
			save();
	    }   
	});
});

function selectcheckbox(arrid,checkname){
	 var arr = $("#"+arrid).val().split(",");
	 var hiddens = $("input[type='checkbox'][name="+checkname+"]");
	 $.each(hiddens,function (){
		 var val=$(this).val();
		 if($.inArray(val, arr) != -1)
		 	this.checked="checked";
	 });
}

/*保存(新增或编辑)*/
function save(){
	//获取file的全部id  
    var uplist = $("input[name^=file]");  
	var arrId = [];  
	for (var i=0; i< uplist.length; i++){  
	    if(uplist[i].value){  
	        arrId[i] = uplist[i].id;  
	    }  
    }  
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/enterprise/entdanexclusive/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#entDanexclusiveform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.parent.$('#ent_danexclusive').val("true");	//父页面 		
				parent.parent.loadSafemenutree();
				parent.parent.parent.toast(json.msg);//弹出提示信息
				
				parent.reloadLabel($("#menupagetype").val(),$("#businessinfoid").val());//刷新当前label
				
				/*var index = parent.getSelfIndex();
				parent.frames["layui-layer-iframe"+index].loadSafemenutree();*/
			}else{
				parent.parent.parent.toast(json.msg);
			}
		},
		error : function() {
			parent.parent.parent.toast("保存失败");
		}
	});
}

/** 
* 删除多附件删除框 
*/  
function removeInput(evt, parentId){  
   var el = evt.target == null ? evt.srcElement : evt.target;  
   var div = el.parentNode;  
   var cont = document.getElementById(parentId);         
   if(cont.removeChild(div) == null){  
    return false;  
   }  
   return true;  
}  


