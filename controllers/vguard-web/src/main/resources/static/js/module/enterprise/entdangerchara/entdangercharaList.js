$(document).ready(
	function() {
		// 加载机构树
		loadTree();
		//控制树选项
		changeDisabled();
		//页面加载时设置checkbox选中
		selectcheckbox("dangertypearr","dangertype");
		selectcheckbox("chemicaltypearr","chemicaltype");
		selectcheckbox("stivetypearr","stivetype");
		selectcheckbox("speequiptypearr","speequiptype");
		selectcheckbox("danequiptypearr","danequiptype");
		//控制checkbox是否可选择
		clickcheckbox("danger","dangertype");
		clickcheckbox("stive","stivetype");
		clickcheckbox("speequipment","speequiptype");
		clickcheckbox("danequipment","danequiptype");
		
		//危险化学品类型
		jQuery.validator.addMethod("ztreecheck", function(value, element) {  
			if($("input[name='chemical']:checked").val()=="1"){
				var treeObj=$.fn.zTree.getZTreeObj("chemistrytypetree");
			    var nodes=treeObj.getCheckedNodes(true);
			    if(nodes.length > 0){
			    	return true;
			    }else{
			    	return false;
			    }
			}
		    return true;    
		}, "危险化学品类型不能为空");
		
		// 粉尘类型
		jQuery.validator.addMethod("stivetype", function(value, element) {  
			var checkflag = false;
			if($("input[name='stive']:checked").val()=="1"){
				$("input[name='stivetype']").each(function(){
					if(this.checked == true)
						checkflag = true;
				});
			}else{
				checkflag = true;
			}
		    return checkflag;    
		}, "粉尘类型不能为空");
		// 特种设备种类
		jQuery.validator.addMethod("speequiptype", function(value, element) {  
			var checkflag = false;
			if($("input[name='speequipment']:checked").val()=="1"){
				$("input[name='speequiptype']").each(function(){
					if(this.checked == true)
						checkflag = true;
				});
			}else{
				checkflag = true;
			}
		    return checkflag;    
		}, "特种设备种类不能为空");
		// 危险设备类型
		jQuery.validator.addMethod("danequiptype", function(value, element) {  
			var checkflag = false;
			if($("input[name='danequipment']:checked").val()=="1"){
				$("input[name='danequiptype']").each(function(){
					if(this.checked == true)
						checkflag = true;
				});
			}else{
				checkflag = true;
			}
		    return checkflag;    
		}, "危险设备类型不能为空");
		
		// 重大危险源种类
		jQuery.validator.addMethod("dangertype", function(value, element) {  
			var checkflag = false;
			if($("input[name='danger']:checked").val()=="1"){
				$("input[name='dangertype']").each(function(){
					if(this.checked == true)
						checkflag = true;
				});
			}else{
				checkflag = true;
			}
		    return checkflag;    
		}, "重大危险源种类不能为空");
		
		
		$("#dangercharaform").validate({
			rules: {
				danger: {
					required: true
				},
				chemical: {
					required: true
					
				},
				treeimput: {
					ztreecheck: true
				},
				empchemical: {
					required: true
				},
				occdisease: {
					required: true
				},
				stive: {
					required: true
				},
				speequipment: {
					required: true
				},
				danequipment: {
					required: true
				},
				dryingroom: {
					required: true
				},
				plant: {
					required: true
				},
				warehouse: {
					required: true
				},
				workshop: {
					required: true
				},
				interspace: {
					required: true
				},
				mess: {
					required: true
				},
				stivetype: {
					stivetype: true
				},
				speequiptype: {
					speequiptype: true
				},
				danequiptype: {
					danequiptype: true
				},
				dangertype: {
					dangertype: true
				},
				gasbottle: {
					required: true
				},
				liquidrefrigeration: {
					required: true
				},
				personintensive: {
					required: true
				}
			},
			messages: {
				danger: {
					required: "是否重大危险源不能为空"
				},
				chemical: {
					required: "是否涉及危险化学品不能为空"
				},
				empchemical: {
					required: "是否涉及重点监管危险化学品不能为空"
				},
				occdisease: {
					required: "是否有职业病危害不能为空"
				},
				stive: {
					required: "生产作业过程中是否产生粉尘不能为空"
				},
				speequipment: {
					required: "是否使用特种设备不能为空"
				},
				danequipment: {
					required: "是否使用危险设备不能为空"
				},
				dryingroom: {
					required: "是否有涂层烘干室不能为空"
				},
				plant: {
					required: "是否有洁净厂房不能为空"
				},
				warehouse: {
					required: "是否有一般仓库不能为空"
				},
				workshop: {
					required: "是否有电镀车间不能为空"
				},
				interspace: {
					required: "是否存在有限空间不能为空"
				},
				mess: {
					required: "是否有食堂不能为空"
				},
				gasbottle: {
					required: "是否有气瓶使用及储存不能为空"
				},
				liquidrefrigeration: {
					required:"是否有液氨制冷不能为空"
				},
				personintensive: {
					required: "是否为人员密集场所不能为空"
				}
			},
			errorPlacement: function (error, element) { //指定错误信息位置
			       if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
			         var eid = element.attr('name'); //获取元素的name属性
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

function clickcheckbox(checkid,type){
	if($("input[name="+checkid+"]:checked ").val() == 1){
		//是
		selectDisabled(type,false);
	}else{
		//否
		selectDisabled(type,true)
	}
	$("input[name="+checkid+"]").click(function(){
    	if($(this).val() == 1){
    		//是
    		selectDisabled(type,false);
    	}else{
    		//否
    		selectDisabled(type,true)
    	}
    });
}

/**
 * 设置多选下拉框是否可选,
 * id为下拉框的id
 * disabled true 为不可点击
 *          false 可点击
 * @param disabled
 */
function selectDisabled(id,disabled){
	$("input[name="+id+"]").each(function(){
		$(this).attr("disabled",disabled);
		if(disabled){
			$(this).attr("checked",false);
		}
		$(this).attr("disabled",disabled);
	 });
}

/**
 * checkbox 关联父checkbox
 * @param secondItem
 */
function selectfirstItem(secondItem,checkid){
	$("input[name="+checkid+"]").each(function(){
		if($(this).val()==secondItem)
			this.checked="checked";
	})
}
/**
 * checkbox 关联子checkbox
 * @param secondItem
 */
function selectlaterItem(secondItem,checkid,checked){
	var arr = secondItem.split(",");
	$("input[name="+checkid+"]").each(function(){
		if($.inArray($(this).val(), arr) != -1){
			if(checked){
				this.checked="checked";
			}else{
				this.checked="";
			}
		}
	})
}

/*var flag;
*//**
 * 表单验证
 *//*
function checkform(){
	flag = true;
	if($("input[name='danger']:checked").val()==null){
		 parent.parent.toast("是否有重大危险源不能为空");//弹出提示信息
		 flag = false;
	}
	
	if($("input[name='chemical']:checked").val()==null){
		 parent.parent.toast("是否涉及危险化学品不能为空");//弹出提示信息
		 flag = false;
	}else if($("input[name='chemical']:checked").val()=="1"){
		var treeObj=$.fn.zTree.getZTreeObj("chemistrytypetree");
	    var nodes=treeObj.getCheckedNodes(true);
		if(nodes.length == 0){
			parent.parent.toast("危险化学品类型不能为空");//弹出提示信息
			flag = false;
		}
	}
	
	if($("input[name='empchemical']:checked").val()==null){
		 parent.parent.toast("是否有重点监管危险化学品不能为空");//弹出提示信息
		 flag = false;
	}
	if($("input[name='stive']:checked").val()==null){
		 parent.parent.toast("是否产生粉尘不能为空");//弹出提示信息
		 flag = false;
	}else if($("input[name='stive']:checked").val()=="1"){
		var checkflag = true;
		$("input[name='stivetype']").each(function(){
			if(this.checked == true)
				checkflag = false;
		});
		if(checkflag){
			parent.parent.toast("粉尘类型不能为空");//弹出提示信息
			flag = false;
		}
	}
		
	if($("input[name='occdisease']:checked").val()==null){
		 parent.parent.toast("是否职业病危害不能为空");//弹出提示信息
		 flag = false;
	}
	if($("input[name='speequipment']:checked").val()==null){
		 parent.parent.toast("是使用特种设备不能为空");//弹出提示信息
		 flag = false;
	}else if($("input[name='speequipment']:checked").val()=="1"){
		var checkflag = true;
		$("input[name='speequiptype']").each(function(){
			if(this.checked == true)
				checkflag = false;
		});
		if(checkflag){
			parent.parent.toast("特种设备种类不能为空");//弹出提示信息
			flag = false;
		}
	}
	
	if($("input[name='danequipment']:checked").val()==null){
		 parent.parent.toast("是使用危险设备不能为空");//弹出提示信息
		 flag = false;
	}else if($("input[name='danequipment']:checked").val()=="1"){
		var checkflag = true;
		$("input[name='danequiptype']").each(function(){
			if(this.checked == true)
				checkflag = false;
		});
		if(checkflag){
			parent.parent.toast("危险设备类型不能为空");//弹出提示信息
			flag = false;
		}
	}
	
	if($("input[name='dryingroom']:checked").val()==null){
		 parent.parent.toast("是否有涂层烘干室不能为空");//弹出提示信息
		 flag = false;
	}if($("input[name='plant']:checked").val()==null){
		 parent.parent.toast("是否有洁净厂房不能为空");//弹出提示信息
		 flag = false;
	}if($("input[name='warehouse']:checked").val()==null){
		 parent.parent.toast("是否有一般仓库不能为空");//弹出提示信息
		 flag = false;
	}
	if($("input[name='workshop']:checked").val()==null){
		 parent.parent.toast("是否有电镀车间不能为空");//弹出提示信息
		 flag = false;
	}if($("input[name='interspace']:checked").val()==null){
		 parent.parent.toast("是否存在有限空间不能为空");//弹出提示信息
		 flag = false;
	}if($("input[name='mess']:checked").val()==null){
		 parent.parent.toast("是否有食堂不能为空");//弹出提示信息
		 flag = false;
	}
	
}*/


/**
 * 新增
 */
function save(){
	var danger = $("input[name='danger']:checked").val();//是否危险源
	var dangertype = arrayString(document.getElementsByName("dangertype"));//危险源种类
	var chemical =  $("input[name='chemical']:checked").val();//是否危化品
	/*********z-Tree取值****************************/
	var treeObj=$.fn.zTree.getZTreeObj("chemistrytypetree");
    var nodes=treeObj.getCheckedNodes(true);
	var chemicaltype = '';
	for(var i=0; i<nodes.length; i++){
 		if (chemicaltype != ''){ 
 			chemicaltype += ',';
 		}
 		chemicaltype += nodes[i].id;
 	}
 	/***********************************/
	
	var empchemical = $("input[name='empchemical']:checked").val();//是否涉及重点监管危险化学品
	var occdisease = $("input[name='occdisease']:checked").val();//是否有职业病危害
	var stive = $("input[name='stive']:checked").val();//生产作业过程中是否产生粉尘
	var stivetype = arrayString(document.getElementsByName("stivetype"));//粉尘种类
	var speequipment = $("input[name='speequipment']:checked").val();//是否使用特种设备
	var speequiptype = arrayString(document.getElementsByName("speequiptype"));
	var danequipment = $("input[name='danequipment']:checked").val();//>是否使用危险设备
	var danequiptype = arrayString(document.getElementsByName("danequiptype"));//危险设备类型
	var dryingroom = $("input[name='dryingroom']:checked").val();//是否有涂层烘干室
	var plant = $("input[name='plant']:checked").val();//是否有洁净厂房
	var warehouse = $("input[name='warehouse']:checked").val();//是否有一般仓库
	var workshop = $("input[name='workshop']:checked").val();//是否有电镀车间
	var interspace = $("input[name='interspace']:checked").val();//是否存在有限空间
	var mess = $("input[name='mess']:checked").val();//是否有食堂
	var gasbottle = $("input[name='gasbottle']:checked").val();//是否有气瓶使用及储存
	var liquidrefrigeration = $("input[name='liquidrefrigeration']:checked").val();//是否有液氨制冷
	var personintensive = $("input[name='personintensive']:checked").val();//是否为人员密集场所

	console.log(gasbottle);	
	var data = {"danger":danger,"dangertype":dangertype,
				"chemical":chemical,"chemicaltype":chemicaltype.toString(),
				"empchemical":empchemical,"occdisease":occdisease,
				"stive":stive,"stivetype":stivetype,
				"speequipment":speequipment,"speequiptype":speequiptype,
				"danequipment":danequipment,"danequiptype":danequiptype,
				"dryingroom":dryingroom,"plant":plant,
				"warehouse":warehouse,"workshop":workshop,
				"interspace":interspace,"mess":mess,
				"gasbottle":gasbottle,"liquidrefrigeration":liquidrefrigeration,
				"personintensive":personintensive,
				"businessinfoid":$("#businessinfoid").val(),"charid":$("#charid").val(),
				"token":$("#token").val()
				};
	
    $.ajax({
		type : 'post',
		url : BASE_URL+'/enterprise/entdangerchara/save',
		cache : false,
		dataType : 'json',
		data :  data,
		global : false,
		success : function(json) {
		  if(json.success==true){
			  parent.$('#ent_dangerchara').val("true");	//父页面 		
			  parent.loadSafemenutree();
			  parent.parent.toast(json.msg);//弹出提示信息
			  window.location.reload();
		  }else{
			  parent.parent.toast(json.msg);//弹出提示信息
		  }   
		},
		error : function() {
			parent.parent.toast("网络出错");
		}
	});
}

/**
 * 取checkbox选中项id字符串
 * @param array checkbox对象
 * @returns {String}
 */
function arrayString(array){
	if(array == null){
		return "";
	}
	var str ='';
	for(var i=0;i<array.length;i++){
		if(array[i].checked){
			if (str != '')
				str += ',';
			str+=array[i].value;
		}
	}
	return str;
}

/**
 * 树节点是否可选择
 */
function changeDisabled(){
	if($("input[name='chemical']:checked").val()==1){
		treeDisabled(false);//设置树可点击
	}else{
		treeDisabled(true);//设置树不可点击
	} 
}

/**
 * z-tree设置不可点击
 * disabled true不可点击
 * disabled false可以点击
 */
function treeDisabled(disabled){
	var zTree = $.fn.zTree.getZTreeObj("chemistrytypetree");
	var nodes = zTree.getNodes();
	if(disabled)
		zTree.checkAllNodes(false);
	for (var i=0, l=nodes.length; i < l; i++) {
		zTree.setChkDisabled(nodes[i], disabled, true,true);
	}
}

/**
 * disabled true不可点击
 */
function treeDisableds(){
	var zTree = $.fn.zTree.getZTreeObj("chemistrytypetree");
	var nodes = zTree.getNodes();
	for (var i=0, l=nodes.length; i < l; i++) {
		zTree.setChkDisabled(nodes[i], true, true,true);
	}
}


/** 机构树 */
function loadTree() {
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		check: {
	        enable: true,
	        chkStyle: "checkbox"
		},
		view: {
			showIcon: false
		},
		callback : {
			onClick : treeClick,
			onCheck : treeCheck
		}
	};

	$.ajax({
		type : 'post',
		url : BASE_URL + '/enterprise/entchemicaltype/chemicaltypetree',
		data : {
			"businessinfoid" : $("#businessinfoid").val()
		},
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#chemistrytypetree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});

	// 树图标的初始化
	function initTreeMap(map) {
		//危险化学品类型数组
		var chemicaltype = $("#chemicaltypearr").val().split(",");
		var t_map = new Array();
		// 遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			for (var i = 0; i < map.length; i++) {
				if (map[i].id != -1) {
					var orgid = map[i].id;
					open = true;
				}
				if($.inArray(map[i].id, chemicaltype) == -1){
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, false));
				}else{
					t_map.push(new Node(map[i].id, map[i].pId, map[i].name, open, true));
				}
			}
		} else {
			t_map = null;
		}
		return t_map;
	}

	// 树节点对象
	function Node(id, pId, name, open, checked) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.checked = checked;
	}
	
	/** 点击树节点 */
	function treeClick(event, treeId, treeNode, clickFlag) {
		var id = treeNode.id;
		$("#treeimput").val(id);
		//去除 验证的错误信息
		var treeObj=$.fn.zTree.getZTreeObj("chemistrytypetree");
	    var nodes=treeObj.getCheckedNodes(true);
	    if(nodes.length > 0){
	    	$("#treeimput").attr("class","valid");
	    	$("#treeimput-error").css("display","none");
	    }
	}
	/**勾选权限树节点*/
	function treeCheck(event, treeId, treeNode, clickFlag){
		treeClick(event, treeId, treeNode, clickFlag);
	}
}
