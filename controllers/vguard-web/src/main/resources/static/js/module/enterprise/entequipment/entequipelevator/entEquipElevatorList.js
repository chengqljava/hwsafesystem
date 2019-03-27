$(document).ready(function() {
	
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['电梯id','设备编号','设备名称','电梯类别','额定载重量（kg）','投用日期','检验日期','下次检验日期','检验结论']; 
	var colmodel = [
		{name:'elevatorid',index:'elevatorid', width:'5%',hidden: true},
		{name:'equipcode',index:'equipcode',width:'10%',align:'left'},
		{name:'equipname',index:'equipname',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.elevatorid+'\')">'+obj.equipname+'</a>';
			}
		},
		{name:'elevatortype',index:'elevatortype',width:'10%',align:'left'},
		{name:'loadweight',index:'loadweight',width:'15%',align:'left'},
		{name:'usedate',index:'usedate',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.usedate) {
					return getSmpFormatDateByLong(obj.usedate, false);
				} else {
					return "--";
				}
			}
		},
		{name:'inspectdate',index:'inspectdate',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.inspectdate) {
					return getSmpFormatDateByLong(obj.inspectdate, false);
				} else {
					return "--";
				}
			}
		},
		{name:'nextinspectdate',index:'nextinspectdate',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.nextinspectdate) {
					return getSmpFormatDateByLong(obj.nextinspectdate, false);
				} else {
					return "--";
				}
			}
		},
		{name:'inspectresult',index:'inspectresult',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.inspectresult) {
					return SelectOption.loadTestResultData(obj.inspectresult);
				} else {
					return "--";
				}
			}
		}
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190 - 33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 - 33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipelevator/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'usedate',
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
		caption: "电梯列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	var entid = $("#entid").val();
    	parent.parent.openWin(BASE_URL+"/enterprise/entequipelevator/add/"+entid,'添加','65%','65%');
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
    	var elevatorid = rowdata.elevatorid;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entequipelevator/edit/'+elevatorid,'编辑','65%','65%');
    });
    
    /*批量删除*/
    $("#delBtn").on("click", function () {
    	//返回当前grid中复选框所选择的数据的id 
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length==0){
    		// 弹出提示信息
    		parent.parent.toast("请选择需要删除的数据！");
    		return;
    	}

    	var elevatorids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		elevatorids[i]= rowdatas.elevatorid;
    	}
    	var parmJson = elevatorids.toString();
    	var entid = $("#entid").val();
    	var param = {"ids":parmJson,"entid":entid};
    	del(param);
    });
    /*搜索查询*/
    $("#searchbtn").bind("click",function(){
        reloadGrid();
    });
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{entid:$("#entid").val(),
            devicename:$("#devicename").val(),
            specmodel:$("#specmodel").val(),}
	}).trigger("reloadGrid");
}



/*详细查询*/
function display(elevatorid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipelevator/display/"+elevatorid,'详细','65%','65%');
}


/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entequipelevator/delete",
		  		type:'post',
		  		dataType:'json',
		  		data:param,
		  		success: function(json){
		  			if(json.success==true){
		  				parent.parent.toast(json.msg);
		  				reloadGrid();//刷新列表
		  				refreshTree(json.exists); // 刷新左侧安全信息树
		  			}else{
		  				parent.parent.toast(json.msg);
		  			}
		  		}
			 });
		})
}

//刷新左侧安全信息树
function refreshTree(flag){
	if(flag){
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safestandard').val("true");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}else{
		var index = parent.parent.getSelfIndex();
		parent.parent.frames["layui-layer-iframe"+index].$('#ent_safestandard').val("false");
		parent.parent.frames["layui-layer-iframe"+index].loadSafemenutree();
	}
}

 

