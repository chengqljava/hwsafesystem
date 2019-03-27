$(document).ready(function() {
	 $("#contendiv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });
	 
	
	$("#hdientregistraform").validate({
		rules: {
			retime: {
				required: true
			},
			regrading: {
				required: true
			},
			reinfo: {
				required: true
			},
			remea: {
				required: true
			},
			endtime: {
				required: true
			},
			filemyfile: {
				required: true,
				imageverify: true
			}
		},
		messages: {
			retime: {
				required: "隐患发生时间不能为空"
			},
			regrading: {
				required: "隐患分级不能为空"
			},
			reinfo: {
				required: "隐患基本情况不能为空"
			},
			remea: {
				required: "整改措施不能为空"
			},
			endtime: {
				required: "隐患整改期限不能为空"
			},
			filemyfile: {
				required: "整改图片上传不能为空"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
		       if(element.is(':file') || element.is(':radio')){//文件上传
		    	 eid = element.attr('name'); //获取元素的name属性
		         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
		       }else {
		         error.insertAfter(element);
		       }
			},
		submitHandler:function(form){
			$('#rummager').removeAttr("disabled"); 
			$('#checktime').removeAttr("disabled"); 
			save();
	    }   
	});
	
});

/*保存隐患信息*/
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
		url : BASE_URL+'/hiddendanger/hdientregistra/save',
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#hdientregistraform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe"+index].reloadGrid();//刷新列表
				parent.getActiveIFrame().reloadGrid();//重新加载统计信息
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#myfile').empty();
				showUploadFile('myfile','image');//显示文件上传控件
				$('#hdientregistraform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}


var attachname = "";
var i = 1;
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
  
  
  /**
   * 附件下载
   * @param id
   */   
 function downloadFile(id){
      	$.ajax({
      		type : 'post',
      		url : BASE_URL+'/hiddendanger/hdientcheckimage/download/'+id,
      		cache : false,
      		dataType : 'json',
      		success : function(data) {
      		  if(data.success==true){
      		  	window.location.href= BASE_URL+'/hiddendanger/hdientcheckimage/download/'+id;	  
      		  }else{
      			  parent.toast(data.msg);
      		  }
      		},
      		error : function() {
      			parent.toast("网络异常");
      		}
      	});
    }