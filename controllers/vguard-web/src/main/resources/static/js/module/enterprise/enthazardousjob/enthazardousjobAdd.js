$(document).ready(function() {

	 $("#contendiv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });
	 $("#contendiv div[id^=fileselect]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 $("#contendiv div[id^=fileshow]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 
	$("#entHazardousjobform").validate({
		rules: {
			hazardjobname: {
				required: true,
				rangelength:[1,50],
			},
			risk: {
				required: true,
				rangelength:[1,50],
			},
			precaution: {
				required: true,
				rangelength:[1,100],
			},
			measure: {
				required: true,
				rangelength:[1,100],
			},
			filemyfile: {
				required: true
			}
		},
		messages: {
			hazardjobname: {
				required: "危险作业名称不能为空",
				rangelength: "请输入1-50个字符"
			},
			risk: {
				required: "存在的风险或可能引发的事故类型不能为空",
				rangelength: "请输入1-50个字符"
			},
			precaution: {
				required: "安全防范措施不能为空",
				rangelength: "请输入1-100个字符"
			},
			measure: {
				required: "应急救援措施不能为空",
				rangelength: "请输入1-100个字符"
			},
			filemyfile: {
				required: "制度管理与操作规程不能为空"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if(element.is(':file')){//文件上传
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
		url : BASE_URL+'/enterprise/enthazardousjob/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#entHazardousjobform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].frames["contentIframe"].frames["chemIframe"].reloadGrid();//刷新列表
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#myfile').empty();
				showUploadFile('myfile','image');//显示文件上传控件
				$('#entHazardousjobform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}



var attachname = "";
var i = $("#num").val() == "" ? 1 : $("#num").val();
function addInput(fileid){
	attachname = fileid;
    if(i>0){
          var attach = attachname + i ;
          createInput(attach,fileid);
          var div = document.getElementById("fileselect"+fileid+i);
          div.style.width = "90%";
          var ss = document.getElementById(attach);
          ss.style.float = "left";
          ss.style.width="100%";
          ss.style.paddingTop="6px";
          i=i+1;
    }
} 
function deleteInput(id){
  if(i>=1){
    if(!removeInput(id))
        i=i+1;
  }
} 
  
function createInput(nm,fileid){   
	var bElement=document.createElement("input");  
	bElement.type="button";
	bElement.onclick=Function("deleteInput("+nm+")");  
	bElement.value="删除行";
	bElement.style.float = "right";
	
     var  aElement=document.createElement("div");   
     aElement.id=nm;
     
   document.getElementById(fileid).appendChild(aElement);
   document.getElementById(nm).appendChild(bElement);

   showUploadFile(nm,'file',true);//显示文件上传控件

  }  

  function removeInput(id){
	  $(id).remove()
  }  




