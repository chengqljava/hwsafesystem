$(document).ready(function() {
	//加载复查人员树
	 loadPatrollerTree();

	 $("#contendiv div[id^=myfile]").each(function(index, element) {
		 showUploadFile($(this).attr('id'),'file',true);//显示文件上传控件
	 });
	 $("#contendiv div[id^=fileselect]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	 $("#contendiv div[id^=fileshow]").each(function(index, element) {
		 $(this).css({"width":"90%"});
	 });
	
	//手机号码验证
	jQuery.validator.addMethod("mobile", function(value, element) { 
		 return this.optional(element) || /^\d{11}$/.test(value);     
		}, "手机号码格式错误"); 
	
	
	$("#govreviewform").validate({
		rules: {
			reviewdate: {
				required: true
			},
			reviewresults: {
				required: true
			},
			filemyfile: {
				required: true
			},
			isabarbeitung: {
				required: true
			},
			affirmperson: {
				required: true
			},
			affirmtel: {
				required: true,
				mobile: true
			}
		},
		messages: {
			reviewdate: {
				required: "复查日期不能为空"
			},
			reviewresults: {
				required: "请选择复查结果!"
			},
			filemyfile: {
				required: "复查附件不能为空"
			},
			isabarbeitung:{
				required: "请选择隐患是否整改!"
			},
			affirmperson:{
				required: "整改确认人不能为空!"
			},
			affirmtel: {
				required: "确认人联系电话不能为空",
				mobile: "手机号码格式错误"
			}
		},
		errorPlacement: function (error, element) { //指定错误信息位置
	       if (element.is(':file') || element.is(':radio')) { 
		         var eid = element.attr('name'); //获取元素的name属性
		         error.appendTo($('.'+eid+'Div')); //将错误信息添加当前元素的父结点后面
		       } else {
		    	   error.insertAfter(element);
		     }
		},
		submitHandler:function(form){
			save();
	    }   
	});
});

/**复查人员树*/
function loadPatrollerTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			
		},
		check: {
	        enable: true
		}
	};	

	$.ajax({
		type :'post',
		url : BASE_URL+'/hiddendanger/hdipatroller/patrolTree', 
		cache : false,
		dataType : 'json',
		data : {
			patrollertype : 1 //巡查登记人员
		},
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#patrollertree"), setting, tree_map);
			var zTree = $.fn.zTree.getZTreeObj("patrollertree");
			var nodes = zTree.getNodes();
			for (var i=0;i < nodes.length; i++) {
				zTree.setChkDisabled(nodes[i],true);//禁用根节点
			}
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		var icon="";
		if (map != null && map.length > 0) {
			t_map.push(new Node("-1", "", "复查人员", true, icon, false));
			for ( var i = 0; i < map.length; i++) {
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name, false, icon, false));
			}
		} else {
			t_map = null;
		}
		JSON.stringify(t_map);
		return t_map;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon, checked) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
		this.checked = checked;
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
	
	var treeObj=$.fn.zTree.getZTreeObj("patrollertree");
    var nodes = treeObj.getCheckedNodes(true);
    var patrollerids = '';
    for(var i=0; i<nodes.length; i++){
 		if (patrollerids != ''){ 
 			patrollerids += ',';
 		}
 		patrollerids += nodes[i].id;
 	}
   $('#patrollerids').val(patrollerids);

	
	$.ajaxFileUpload({
		type : 'post',
		url : BASE_URL+'/hiddendanger/hdigovreview/save',
		secureuri:false,
		files : arrId,
		cache : false,
		dataType : 'json',
		data : $("#govreviewform").serializeArray(),
		global : false,
		success : function(json) {
			if(json.success==true){
				parent.toast(json.msg);//弹出提示信息
				parent.getActiveIFrame().reloadGrid();//重新加载
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
				$('#myfile').empty();
				showUploadFile('myfile','image');//显示文件上传控件
				$('#govreviewform').data('formValidation').disableSubmitButtons(false);//设置提交按钮disable为false
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
	  $(id).remove();
}  
