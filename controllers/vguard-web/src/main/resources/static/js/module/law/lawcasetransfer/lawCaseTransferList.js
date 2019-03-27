$(document).ready(function() {
	SelectOption.loadDangerSourceState("state");//状态
	SelectOption.loadisDangSou("isDangSou");//是否重大危险源
	SelectOption.loaddangSouLevel("dangSouLevel");//重大危险源级别
	var colname = ['主键id','检查信息id','文书区域','文书年份','文书编号','立案调查调查时间','案件名称','移送原因','法律规定','案件材料','材料份数','材料页数','文书日期','更新时间','备注', ]; 
	
	var colmodel = [
					{name:'casetransferid',index:'casetransferid', width:'5%'},
					{name:'checkinfoid',index:'checkinfoid', width:'5%'},
					{name:'docarea',index:'docarea', width:'5%'},
					{name:'docyear',index:'docyear', width:'5%'},
					{name:'docnum',index:'docnum', width:'5%'},
					{name:'casetime',index:'casetime', width:'5%'},
					{name:'casename',index:'casename', width:'5%'},
					{name:'reason',index:'reason', width:'5%'},
					{name:'lawcontent',index:'lawcontent', width:'5%'},
					{name:'casefile',index:'casefile', width:'5%'},
					{name:'casefilecount',index:'casefilecount', width:'5%'},
					{name:'casefilepage',index:'casefilepage', width:'5%'},
					{name:'createtime',index:'createtime', width:'5%'},
					{name:'updatetime',index:'updatetime', width:'5%'},
					{name:'note',index:'note', width:'5%'},
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/law/lawcasetransfer/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			dangSouName:$("#dangSouName").val(),
			state:$("#state").val(),
			isDangSou:$("#isDangSou").val(),
			dangSouLevel:$("#dangSouLevel").val()
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
		caption: "重大危险源列表",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			dangSouName:$("#dangSouName").val(),
			state:$("#state").val(),
			isDangSou:$("#isDangSou").val(),
			dangSouLevel:$("#dangSouLevel").val()
		}
	}).trigger("reloadGrid");
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
	parent.openWin(BASE_URL+"/law/lawcasetransfer/add",'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var dangerid = rowdata.DANGERID;
	parent.openWin(BASE_URL+'/law/lawcasetransfer/edit/'+dangerid,'编辑','65%','75%');
});

/*详细查询*/
function display(dangerid){
	parent.openWin(BASE_URL+"/law/lawcasetransfer/pageTab/"+dangerid,'详细','65%','75%');
}
/**
 * 查询危险化学品列表
 * @param dangerid
 */
function display_chem(dangerid){
	parent.openWin(BASE_URL+"/law/lawcasetransfer/chemicalList/"+dangerid,'详细','80%','60%');
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
		dangerids[i]= rowdatas.DANGERID;
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
	  		url: BASE_URL+"/law/lawcasetransfer/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	})
}
