$(document).ready(function() {
	//初始化下拉框
	SelectOption.loadUnitEntnat("propunitentnat");
	SelectOption.loadUnitEntnat("useunitentnat");
	SelectOption.loadUnitPernat("propunitpernat");
	SelectOption.loadUnitPernat("useunitpernat");
	SelectOption.loadRunStatus("runstatus");
	//行政区划 
	SelectTree.loadDistrictSelect("districtname");
	selectcheckbox("pavingmodes","pavingmode");//设置管道铺设方式选中
	
	 $("#contendiv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });
	 
	 $("#contendiv div[id^=fileselect]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 $("#contendiv div[id^=fileshow]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 
	// $("#fileselectmyfileA").css({"float":"left","width":"90%"});
	// $("#fileshowmyfileA").css({"float":"left","width":"90%"});
	 
	 $("#entrunningpipform").validate({
			rules: {
				runnpipname: {
					required: true,
					rangelength:[1,50]
				}
			},
			messages: {
				runnpipname: {
					required: "管道名称不能为空",
					rangelength: "请输入1-50个字符"
				}
			},
			submitHandler:function(form){
		    	save();
		    }   
		});
});

//设置check选中
function selectcheckbox(arrid,checkname){
	if($("#"+arrid).val()){
		var arr = $("#"+arrid).val().split(",");
		var hiddens = $("input[type='checkbox'][name="+checkname+"]");
		$.each(hiddens,function (){
			var val=$(this).val();
			if($.inArray(val, arr) != -1)
				this.checked="checked";
		});
	}
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
		url : BASE_URL+'/enterprise/entrunningpip/save',
		secureuri:false,
	    files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#entrunningpipform").serializeArray(),
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
				$('#entrunningpipform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}



var attachname = "";
var i=1;
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
  if(i>1){
    if(!removeInput(id))
        i=i+1;
  }
} 
  
function createInput(nm,fileid){   
	//var element = "<div id="+nm+"></div><input type='button' value='删除t'/>";
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


