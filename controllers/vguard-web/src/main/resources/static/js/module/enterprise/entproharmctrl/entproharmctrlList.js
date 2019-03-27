$(document).ready(function() {
	
	var colname = ['主键id','职业危害因素名称','工作场所名称','接触人数','其中女工接触人数','岗位','检测结果','检查日期']; 
	var colmodel = [
		{name:'PROHARMCTRLID',index:'PROHARMCTRLID', width:'5%',hidden: true},
		{name:'FACTORNAME',index:'FACTORNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.PROHARMCTRLID+'\')">'+obj.FACTORNAME+'</a>';
			}
		},
		{name:'WORKPLACE',index:'WORKPLACE',width:'10%',align:'left'},
		{name:'CONTACTQTY',index:'CONTACTQTY',width:'10%',align:'left'},
		{name:'WOMANQTY',index:'WOMANQTY',width:'10%',align:'left'},
		{name:'POST',index:'POST',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.getProharmPost(obj.POST);
			}
		},
		{name:'INSPECTRESULT',index:'INSPECTRESULT',width:'10%',align:'left'},
		{name:'INSPECTDATE',index:'INSPECTDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.INSPECTDATE) {
					return getSmpFormatDateByLong(obj.INSPECTDATE, false);
				} else {
					return "";
				}
			}
		}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entproharmctrl/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			proharmid:$("#proharmid").val()
		},
		sortname : 'UPDATETIME',
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
		caption: " ",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{proharmid:$("#proharmid").val()}
	}).trigger("reloadGrid");
}

/*添加*/
$("#addBtn").on("click", function () {
	var proharmid = $("#proharmid").val();
	parent.parent.openWin(BASE_URL+"/enterprise/entproharmctrl/add/"+proharmid,'添加','60%','50%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var proharmctrlid = rowdata.PROHARMCTRLID;
	
	parent.parent.openWin(BASE_URL+'/enterprise/entproharmctrl/edit/'+proharmctrlid,'编辑','60%','50%');
});

/*详细查询*/
function display(proharmctrlid){
	parent.parent.openWin(BASE_URL+"/enterprise/entproharmctrl/display/"+proharmctrlid,'详细','60%','50%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.parent.toast("请选择需要删除的数据！");
		return;
	}

	var proharmctrlids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		proharmctrlids[i]= rowdatas.PROHARMCTRLID;
	}
	var parmJson = proharmctrlids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entproharmctrl/delete",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==true){
		  				parent.parent.toast(json.msg);
		  				reloadGrid();//刷新列表
		  			}else{
		  				parent.parent.toast(json.msg);
		  			}
		  		}
			 });
		})
}

 

