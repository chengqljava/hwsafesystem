$(document).ready(function() {
		var colname = ['主键id','类型名称','类型编号','备注',"操作"];
		var colmodel = [
		    {name:'typeid',index:'TYPEID', width:'10%',hidden:true},
			{name:'typename',index:'TYPENAME',width:'20%',align:'left'},
			{name:'typenum',index:'TYPENUM', width:'10%'},
			{name:'note',index:'NOTE', width:'10%'},
			{name:'operator',index:'operator',width:'20%',align:'center',
				formatter:function(cellvalue, options, obj) { 
					   if(obj.parent==-1||obj.typenum=="D01"||obj.typenum=="D02"){
						   return "--";
					   }else{
						   return '<a href="javascript:void(0);" onclick="operator(\''+obj.typeid+'\')">人员分配</a>';
					   }
				}
			}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 190;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.86 );
		});

	    $("#grid-table").jqGrid({
	    	treeGrid:true,//启用树型Grid功能
	    	treeGridModel:'adjacency',//表示返回数据的读取类型，分为两种：nested和adjacency
	    	ExpandColumn:"typename",//树形结构显示字段
	    	height: tableHeight,
	    	url : BASE_URL + "/system/sysremindtype/treelist",
	    	datatype: "json",
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			pager: "#grid-pager",
            jsonReader: {    
               root: "results",    
               repeatitems : false    
            },    
            treeReader : {    
               level_field: "level",    
               parent_id_field: "parent",    
               leaf_field: "isLeaf",    
               expanded_field: "expanded"
            },  
            sortname: 'parent', 
            sortorder: "desc",  
            rowNum : "-1",  
			caption: "提醒人员管理",
			autowidth: true
		});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{typename:$('#typename').val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#typename").val('');
});

//授权
$("#userBtn").bind("click",function(){
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要分配的的人员数据！");
		return;
	}
	if(ids.length>1){
		// 弹出提示信息
		parent.toast("一次只能给一个消息类型分配人员，请重新选择！");
		return;
	}
	//返回指定id行的数据 
	var rowdatas = $("#grid-table").jqGrid('getRowData',ids[0]);
	var typenum = rowdatas.typenum;
	parent.openWin(BASE_URL+"/system/sysremindconfig/userPriv/"+typenum,'人员分配','60%','50%');	
});


/* 人员分配 */
function operator(typenum) {
	parent.openWin(BASE_URL + '/system/sysremindconfig/userPriv/'+typenum, '人员分配',
			"50%", "45%");
}
