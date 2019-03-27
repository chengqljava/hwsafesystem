$(document).ready(function() {

	if($(window).width() < 700) {
		$('.divClick').css({"display":"block"});
		$('.treeLeft').css({"display":"none"});
		$('.table-line').css({"padding":"0px"});
		$('.treeRight').css({"width":"100%"});
	}else {
		$('.divClick').css({"display":"none"});
		$('.treeLeft').css({"display":"block"});
	}
	
	SelectTree.loadHdiCheckitemSelect("entinfomenu", {
		"businessinfoid":$('#businessinfoid').val(),
		"industrytype" : $('#industrytype').val(),
		"inspectionid" : $('#inspectionid').val(),
		"param" : $('#itemnum').val()},null,
			function(treeNode){
				if(treeNode.children == null){
					var itemid = treeNode.id;
					$("#itemid").attr('value',itemid);
					reloadGrid();
					
				}
	});
	
	
	//加载排查项树
	loadCheckTree();
	var colname = ['编号','排查项编号','隐患信息id','检查内容','备注说明','检查选项','检查结果'];
	var colmodel = [
	    {name:'STANDARDID',index:'STANDARDID',align:'center',hidden: true},
	    {name:'ITEMID',index:'ITEMID',align:'center',hidden: true},
	    {name:'REGISTRAID',index:'REGISTRAID',align:'center',hidden: true},
	    {name:'CHECKCONTENT',index:'CHECKCONTENT',align:'left',width:'30%',
	    	formatter : function(cellvalue, options, obj) {
	    		return obj.CHECKCONTENT + '<img src= '+BASE_URL+'/images/tree/zgbm.png /><img src= '+BASE_URL+'/images/tree/flfg.png />';
	    	}
	    },
	    {name:'CHECKMETHOD',index:'CHECKMETHOD',align:'left',width:'30%'},
		{name:'COMMANDS',index:'COMMANDS',sortable:false,align:'center',width:'15%',
	    	formatter : function(cellvalue, options, obj) {
	    		return '<a href="javascript:void(0);" onclick="checkno(\''+ obj.STANDARDID + '\',\''+ obj.RESTATE + '\')">无隐患</a><br>'+
	    		'<a href="javascript:void(0);" onclick="checkyes(\''+ obj.STANDARDID + '\',\''+ obj.RESTATE + '\')">有隐患</a>';
	    	}},
	    {name:'RESTATE',index:'RESTATE',align:'left',width:'25%',
	    	formatter : function(cellvalue, options, obj) {
	    		if(obj.RESTATE == '0'){
	    			//无隐患
	    			return '<img src= '+BASE_URL+'/images/tree/yes.png />无隐患('+getFormatDateByLong(obj.CHECKTIME,"MM-dd")+')&nbsp;<image onclick="del(\''+obj.REGISTRAID+'\')" alt=删除 src= '+BASE_URL+'/images/tree/xpc.png />';
	    		}else if(obj.RESTATE == '1'){
	    			//有隐患
	    			return '<img src= '+BASE_URL+'/images/tree/no.png />有隐患('+getFormatDateByLong(obj.CHECKTIME,"MM-dd")+')&nbsp;<image onclick="del(\''+obj.REGISTRAID+'\')" alt=删除 src= '+BASE_URL+'/images/tree/xpc.png />';
	    		}else{
	    			return '';
	    		}
	    	}
	    }
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid('setGridWidth', $('.treeRight').width()*0.99);
    })
    
    $("#grid-table").jqGrid({
    	height: 450,
    	url : BASE_URL+"/hiddendanger/hdientregistra/ent/check",
		datatype: "json",
		cache : false,
		mtype : 'POST',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$('#businessinfoid').val(),
			itemid:$('#itemid').val(),
			industrytype:$('#industrytype').val(),
			inspectionid:$('#inspectionid').val(),
			itemnum: $('#itemnum').val()
		},
		sortname : 'CHECKCONTENT',
		viewrecords : true,
		pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:10,
		rowList:[10,20,30],
		altRows: true,
		autowidth: true,
		loadComplete : function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
			//返回当前grid里所有数据的id 
			var ids = $("#grid-table").jqGrid("getDataIDs");
			for(var i=0; i<ids.length; i++){
				var id = ids[i]; 
				//返回指定id行的数据 
				var rowdatas = $("#grid-table").jqGrid('getRowData',id);
				//返回所在行数据的主键
				var standardid = rowdatas!=null?rowdatas.standardid:"";
				var itemid = rowdatas!=null?rowdatas.itemid:"";
				//返回所在行数据的状态
				var restate = rowdatas.restate;
				var commandshtml = "<button onclick='hdclick(false,"+standardid+","+itemid+")'>无隐患</button>&nbsp;&nbsp;" +
					"<button onclick='hdclick(true,"+standardid+","+itemid+")'>有隐患</button>";
	
				//设置自定义按钮
				$("#grid-table").jqGrid('setRowData',ids[i],{ commands: commandshtml}); 

			}
			//分页图片
			//updatePagerIcons(this);
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			itemid:$('#itemid').val(),
			businessinfoid:$('#businessinfoid').val(),
			industrytype:$('#industrytype').val(),
			inspectionid:$('#inspectionid').val(),
			itemnum: $('#itemnum').val()
		}
	}).trigger("reloadGrid");
}

/*有隐患(true)、无隐患(false)按钮事件*/
function hdclick(state,inid,itid){
	if(state){
		var ciid = $('#ciid').val();
		parent.win({
			'title':'隐患排查信息',
			'id':'dialogModal2',
			'url':BASE_URL+'/detection/rcssecrecord/add/'+inid+'/'+itid+'/'+ciid,
			'windowWidth':"55%",
			'windowHeight':500,
			'windowPositionLeft':440,
	       });
	}else{
		addhd(inid,$('#ciid').val(),itid);
	}
}

/*保存隐患信息*/
function addhd(inid,ciid,itid){
	$.ajax({
		type :'get',
		url : BASE_URL+'/detection/rcssecrecord/saverecord/'+inid+'/'+ciid,
		cache : false,
		global : false,
		async : false,
		success : function(map) {
			//$("#itid").attr('value',itid);
			//alert($('#itid').val());
			//$.fn.zTree.selectNode( $.fn.zTree.getNodeByParam( "id","114" ), true ); 
			//reloadGrid(itid);
		},
		error : function() {
			console.log("网络异常");
		}
	});
}

/**
 * 验证检查人、检查日期
 */
function verify(restate){
	if(restate == '0' || restate == '1'){
		parent.toast("当前项目已检查");
		return false;
	}
	var checktime = $('#checktime').val();
	var rummager = $('#rummager').val();
	if(checktime && rummager){
		return true;
	}else{
		parent.toast("检查人和检查日期不能为空");
		return false;
	}
}

/**
 * 有隐患
 * standardid 排查标准id
 */
function checkyes(standardid,restate){
	if(verify(restate))
		parent.openWin(BASE_URL + '/hiddendanger/hdientregistra/entadd/'+$('#inspectionid').val()+'/'+$('#itemid').val()+'/'+standardid+'/'+$('#rummager').val()+'/'+$('#checktime').val(), '隐患登记', '50%', '65%');
}

/**
 * 无隐患
 * standardid 排查标准id
 */
function checkno(standardid,restate){
	if(verify(restate)){
		var inspectionid = $('#inspectionid').val();
		var rummager = $('#rummager').val();
		var checktime =  $('#checktime').val();
		var param = {"inspectionid":inspectionid,"standardid":standardid,"rummager":rummager,"checktime":checktime};
		$.ajax({ 
	  		url: BASE_URL + "/hiddendanger/hdientregistra/entnosave",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
		  			parent.toast(json.msg);
		  			reloadGrid();// 刷新列表
		  			parent.getActiveIFrame().reloadGrid();//重新加载统计信息
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	}
}

/**
 * 删除隐患信息
 * registraid 隐患信息id
 */
function del(registraid){
	var paramJson = registraid.toString();
	var param = {
		"registraid" : paramJson
	};
	// 查询是否有隐患整改信息
	$.ajax({
		url : BASE_URL + "/hiddendanger/hdientabarbeitung/loadByEntRegistraid",
		type : 'post',
		dataType : 'json',
		data : param,
		success : function(json) {
			if (json.success == false) {
				// 有关联引用
				parent.toast(json.msg);
			} else {
				//弹出提示框
  				parent.confirm('确认删除吗?',function(){
  					$.ajax({ 
  				  		url: BASE_URL + "/hiddendanger/hdientregistra/delete",
  				  		type:'post',
  				  		dataType:'json',
  				  		data:param,
  				  		success: function(json){
  				  			if(json.success==true){
	  				  			parent.toast(json.msg);
								reloadGrid();// 刷新列表
								//loadCheckTree();// 刷新树
								//parent.frames["mainIframe"].reloadGrid();//
								parent.getActiveIFrame().reloadGrid();//重新加载统计信息
  				  			}else{
  				  				parent.toast(json.msg);
  				  			}
  				  		}
  					 });
  				})
			}
		}
	});
}

/**
 * 自查配置表
 */
function config(){
	parent.openWin(BASE_URL + '/hiddendanger/hdientregistra/config/'+$('#businessinfoid').val(), '自查指引配置表', '50%', '60%');
}


/**
 * 其它检查项
 */
function otherpage(num){
	$('#itemnum').val(num);
	// 全部
	if(num == '1'){
		loadCheckTree();
	}
	// 已自查
	if(num == '2'){
		loadCheckTree();
	}
	// 未自查
	if(num == '3'){
		loadCheckTree();
	}
	// 其它
	if(num == '4'){
		parent.openWin(BASE_URL + '/hiddendanger/hdientregistra/otherpage/'+$('#inspectionid').val(), '其它检查信息', '50%', '60%');
	}
}

/***********************树结构************************/

/**
 * 排查项
 * @param divid
 */
function loadCheckTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			onClick: treeClick
		},
		view: {
			dblClickExpand: dblClickExpand
		}
	};	
	$.ajax({
		type :'post',
		url : BASE_URL+'/hiddendanger/hdicheckitem/checkitementtree',
		cache : false,
		dataType : 'json',
		data : {
			"businessinfoid" : $('#businessinfoid').val(),
			"industrytype" : $('#industrytype').val(),
			"inspectionid" : $('#inspectionid').val(),
			"param" : $('#itemnum').val()
		},
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#checktree"), setting, tree_map);
		},
		error : function() {
			console.log("网络异常");
		}
	});
	
	//树图标的初始化
	function initTreeMap(map) {
		var t_map = new Array();
		//遍历子节点
		if (map != null && map.length > 0) {
			var open = false;
			
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].pId == "-1"){//父节点
					open = false;
					//icon= BASE_URL+"/images/tree/d_icon_tree2.png";
					
				}else {//子节点
					open = false;
					//icon= BASE_URL+"/images/tree/d_icon_tree3.png";
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,open,icon));
			}
			
			
		} else {
			t_map = null;
		}
		return t_map;
	}
	
	function dblClickExpand(treeId, treeNode) {
		return treeNode.level > 0;
	}
	
	//树节点对象
	function Node(id, pId, name, open, icon) {
		this.id = id;
		this.pId = pId;
		this.name = name;
		this.open = open;
		this.icon = icon;
	}
}

function treeClick(event, treeId, treeNode, clickFlag){
	if(treeNode.children == null){
		var itemid = treeNode.id;
		$("#itemid").attr('value',itemid);
		reloadGrid();
		
	}
}

