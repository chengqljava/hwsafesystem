$(document).ready(function() {
	//加载机构树
	loadOrgTree("orgtree");
//	SelectOption.loadVideoModelStyle("type");
	initSeachInput();
	var colname = ['主键id','所属品牌','上级菜单','型号名称','型号编码','主机/摄像头','备注']; 
	var colmodel = [
					{name:'BRANDTYPEID',index:'BRANDTYPEID',align:'left',hidden:true},
					{name:'BRANDNAME',index:'BRANDNAME',align:'left'},
					{name:'PARENTID',index:'PARENTID',align:'left',hidden:true},
					{name:'BRANDTYPENAME',index:'BRANDTYPENAME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<a href='javascript:void(0)' onclick='display(\""+obj.BRANDTYPEID+"\")'>"+obj.BRANDTYPENAME+"</a>";
						}
					},
					{name:'BRANDTYPENUM',index:'BRANDTYPENUM',align:'left'},
					{name:'TYPE',index:'TYPE',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return SelectOption.getVideoModelStyle(obj.TYPE);
						}
					},
					{name:'NOTES',index:'NOTES',align:'left'}
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height()  - 245;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 245 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99-$(".treecolor").width());
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/macvideobrandtype/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			brandtypeName:$("#brandtypeName").val(),
			brandtypeNum:$("#brandtypeNum").val(),
			type:$("#type").val(),
			brandid:$("#brandid").val(),
			parentid:$("#parentid").val()
		},
		sortname : 'UPDATETIME',
		sortorder : "desc",
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
		multiselect: true,
		caption: "型号列表",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	var type = $("#type").val();
	if (type == '主机') {
		type='1';
	}else if(type == '摄像头'){
		type='2';
	}else if(type == '主机和摄像头'){
		type='3';
	}
	
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			brandtypeName:$("#brandtypeName").val(),
			brandtypeNum:$("#brandtypeNum").val(),
			type:type,
			brandid:$("#brandid").val(),
			parentid:$("#parentid").val()
		}
	}).trigger("reloadGrid");
}
/**
 * 刷新树
 */
function refreshTree(){
	refreshNode("orgtree");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

/*添加*/
$("#addBtn").on("click", function () {
	var brand = $("#brandid").val();
	if( brand == "" || brand=="-1" ){
		parent.toast("请选择品牌！");
		return;
	}
	parent.openWin(BASE_URL+"/monitor/macvideobrandtype/add?parentid="+$("#parentid").val()+"&brandid="+brand,'添加','45%','50%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var brandtypeid = rowdata.BRANDTYPEID;
	parent.openWin(BASE_URL+'/monitor/macvideobrandtype/edit/'+brandtypeid+"?parentid="+$("#parentid").val()+"&brandid="+$("#brandid").val(),'编辑','45%','50%');
});

/*详细查询*/
function display(brandtypeid){
	parent.openWin(BASE_URL+"/monitor/macvideobrandtype/display/"+brandtypeid,'详细','45%','50%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var dangerids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		dangerids[i]= rowdatas.BRANDTYPEID;
	}
	var parmJson = dangerids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/monitor/macvideobrandtype/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  				refreshParentNode("orgtree");//刷新树
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}