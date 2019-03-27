$(document).ready(function() {
	SelectOption.loadEmsPlanType("templatetype");
	SelectOption.loadExpertLevel("templatelevel");
	
	var colname = ['主键','编号','名称','类型','适用级别','发布时间','最近更新时间','模板元素']; 
	var colmodel = [
					{name:'TEMPLATEID',index:'TEMPLATEID', width:'5%',hidden:true},
					{name:'TEMPLATENUM',index:'TEMPLATENUM', width:'5%'},
					{name:'TEMPLATENAME',index:'TEMPLATENAME', width:'10%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.TEMPLATEID+'\')">'+obj.TEMPLATENAME+'</a>';
                        }
					},
					{name:'TEMPLATETYPE',index:'TEMPLATETYPE', width:'5%', align:'center', 
						formatter : function(cellvalue, options, obj) {
							return obj.TEMPLATETYPE != null ? SelectOption.getEmsPlanType(obj.TEMPLATETYPE) : "";
						}
					},
					{name:'TEMPLATELEVEL',index:'TEMPLATELEVEL', width:'5%', align:'center', 
						formatter : function(cellvalue, options, obj) {
							return obj.TEMPLATELEVEL != null ? SelectOption.getExpertLevel(obj.TEMPLATELEVEL) : "";
						}
					},
					{name : 'RELEASETIME',index : 'RELEASETIME',width : '8%',align : 'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.RELEASETIME,
									"yyyy-MM-dd");
						}
					},
					{name : 'UPDATETIME',index : 'UPDATETIME',width : '8%',align : 'center',
						formatter : function(cellvalue, options, obj) {
							return getFormatDateByLong(obj.UPDATETIME,
									"yyyy-MM-dd hh:mm:ss");
						}
					},
					{name:'ELEMENT',index:'ELEMENT', width:'5%',align:'center',sortable : false,
						formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="elementpage(\''+obj.TEMPLATEID+'\',\''+obj.TEMPLATENAME+'\')">查看</a>';
                        }
					}
			     ];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsplatemplate/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			templatename:$("#templatename").val(),
			templatetype:$("#templatetype").val(),
			templatelevel:$("#templatelevel").val()
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
		caption: "预案模板列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			templatename:$("#templatename").val(),
			templatetype:$("#templatetype").val(),
			templatelevel:$("#templatelevel").val()
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
	});
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/ems/emsplatemplate/add",'添加','55%','45%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var templateid = rowdata.TEMPLATEID;
	parent.openWin(BASE_URL+'/ems/emsplatemplate/edit/'+templateid,'编辑','55%','45%');
});

/*详细查询*/
function display(templateid){
	parent.openWin(BASE_URL+"/ems/emsplatemplate/display/"+templateid,'详细','55%','45%');
}

/*模板元素*/
function elementpage(templateid,templatename){
	parent.openWin(BASE_URL+"/ems/emsplaelement/"+templateid,templatename,'65%','90%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var templateids=[];
	var state = "";
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		templateids[i]= rowdatas.TEMPLATEID;
	}
	var parmJson = templateids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/**
 * 只选择一条记录
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
	// 查询是否有关联引用(预案元素信息等)
	$.ajax({
		url : BASE_URL + "/ems/emsplatemplate/loadelementbyid",
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
				  		url: BASE_URL+"/ems/emsplatemplate/delete",
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
  				});
			}
		}
	});
}




