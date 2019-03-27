$(document).ready(function() {
	var colname = ['主键id','名称','排序','备注','更新时间']; 
	
	var colmodel = [
					{name:'brandid',index:'brandid',hidden:true},
					{name:'brandname',index:'brandname',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<a href='javascript:void(0)' onclick='display(\""+obj.brandid+"\")'>"+obj.brandname+"</a>";
						}
					},
					{name:'sort',index:'sort',align:'left'},
					{name:'notes',index:'notes',align:'left'},
					{name:'updatetime',index:'updatetime',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return getSmpFormatDateByLong(obj.updatetime,true);
						}
					},
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "//monitor/macvideobrand/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			brandname:$("#brandname").val()
		},
		sortname : 'SORT',
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
		multiselect: true,
		caption: "品牌管理",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			brandname:$("#brandname").val()
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
	parent.openWin(BASE_URL+"//monitor/macvideobrand/add",'添加','50%','45%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var brandid = rowdata.brandid;
	parent.openWin(BASE_URL+'//monitor/macvideobrand/edit/'+brandid,'编辑','50%','45%');
});

/*详细查询*/
function display(brandid){
	parent.openWin(BASE_URL+"//monitor/macvideobrand/display/"+brandid,'详细','50%','45%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var randids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		randids[i]= rowdatas.brandid;
	}
	var parmJson = randids.toString();
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
	$.ajax({ 
  		url: BASE_URL+"//monitor/macvideobrandtype/haveBrandType",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
	  			//弹出提示框
	  			parent.confirm('确认删除吗?',function(){
	  				$.ajax({ 
	  			  		url: BASE_URL+"//monitor/macvideobrand/delete",
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
	  			  		},
		  			  	error:function(){
		  		  			parent.toast("网络异常");
		  		  		}
	  				 });
	  			})
  			}else{
  				parent.toast(json.msg);
  			}
  		},
  		error:function(){
  			parent.toast("网络异常");
  		}
	 });
}
