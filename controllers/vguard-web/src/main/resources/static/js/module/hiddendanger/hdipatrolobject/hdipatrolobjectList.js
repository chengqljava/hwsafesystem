$(document).ready(function() {
	
	/**
	 * 加载部门信息树
	 */
	if($(window).width() < 700 ) {
			$('.treecolor').hide();
			$('.pRight').css({'width':'100%'});
			$('.divClick').css({'display':'block'});
		}
	SelectTree.loadOrgByOrgidSelect("entinfomenu", {"orgid":$('#orgid').val()},null,
	function(treeNode){
		if(treeNode.id){
			var orgid = treeNode.id;
			if(orgid=='-1'){
				orgid = '';
			}
			$("#orgid").val(orgid);
			reloadGrid();
		}
	});
	
	//加载机构树
	loadOrgTree("orgtree");
	//是否三小场所
	SelectOption.loadTureFalse("islittle");
	//行业主管分类
	SelectOption.loadIndustryType("directortypeid");
	
	var colname = ['巡查对象名称','通讯地址','主要负责人','负责人电话','属地区域','行业主管分类']; 
	var colmodel = [
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ADDRESS',index:'ADDRESS', width:'20%',align:'left'},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'center'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'center'},
		{name:'DISTRICT',index:'DISTRICT',width:'15%',align:'left'},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'15%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
	});
		
    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdipatrolobject/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entname:$("#entname").val(),
			islittle:$("#islittle").val(),
			orgid:$("#orgid").val(),
			directortypeid:$("#directortypeid").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'BUSINESSINFOID',
		sortorder : "asc",
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
		multiselect: false,
		caption: "巡查对象列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$("#grid-table").jqGrid( 'setGridHeight', 500 );
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载行政区域*/
function searchDistrict(districtid){
	$("#districtid").val(districtid);
	reloadGrid();
}


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			entname:$("#entname").val(),
			islittle:$("#islittle").val(),
			orgid:$("#orgid").val(),
			directortypeid:$("#directortypeid").val(),
			districtid:$("#districtid").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#entname").val();
	$("#islittle").val();
	$("#directortypeid").val();
	$("#districtid").val();
});


/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/*导出*/
$("#exportBtn").on("click", function () {
	var entname = $("#entname").val();
	var islittle = $("#islittle").val();
	var directortypeid = $("#directortypeid").val();
	var orgid = $("#orgid").val();
	var districtid = $("#districtid").val();
	window.location.href = 	BASE_URL+"/hiddendanger/hdipatrolobject/export?entname="+entname+"&islittle="+islittle+"&directortypeid="+directortypeid+"&orgid="+orgid+"&districtid="+districtid;
});
 

/**机构树*/
function loadOrgTree(){
	var setting = {
		data : {
			simpleData : {
				enable : true
			}
		},
		callback: {
			onClick: treeClick
		}
	};	
	
	$.ajax({
		type :'post',
		url : BASE_URL+'/system/sysorg/orgtreeByOrgid',
		data : {"orgid" : $("#orgid").val()},
		cache : false,
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			var tree_map = initTreeMap(map);
			$.fn.zTree.init($("#orgtree"), setting, tree_map);
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
			//t_map.push(new Node("-1","","组织机构",true,BASE_URL+"/images/tree/org.png"));//根节点
			for ( var i = 0; i < map.length; i++) {
				var icon = "";
				if(map[i].id != -1 ){
					icon = BASE_URL+"/images/tree/d_icon_tree1.png";
					var orgid = map[i].id;
					open = true;
				}	
				t_map.push(new Node(map[i].id, map[i].pId, map[i].name,
						open,icon));
			}
		} else {
			t_map = null;
		}
		return t_map;
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


/**点击权限树节点*/
function treeClick(event, treeId, treeNode, clickFlag){
	var orgid = treeNode.id;
	if(orgid=='-1'){
		orgid = '';
	}
	$("#orgid").val(orgid);
	reloadGrid();
}
