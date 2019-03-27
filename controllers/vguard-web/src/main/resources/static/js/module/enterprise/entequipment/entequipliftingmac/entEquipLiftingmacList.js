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
	
	var colname = ['起重机械id','设备编号','设备名称','设备类别','额定起重量（t）','投用日期','检验日期','下次检验日期','检验结论']; 
	var colmodel = [
		{name:'LIFITINGID',index:'LIFITINGID', width:'5%',hidden: true},
		{name:'EQUIPCODE',index:'EQUIPCODE',width:'10%',align:'left'},
		{name:'EQUIPNAME',index:'EQUIPNAME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.LIFITINGID+'\')">'+obj.EQUIPNAME+'</a>';
			}
		},
		{name:'EQUIPTYPE',index:'EQUIPTYPE',width:'10%',align:'left'},
		{name:'LIFTINGWEIGHT',index:'LIFTINGWEIGHT',width:'15%',align:'left'},
		{name:'USEDATE',index:'USEDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.USEDATE) {
					return getSmpFormatDateByLong(obj.USEDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'INSPECTDATE',index:'INSPECTDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.INSPECTDATE) {
					return getSmpFormatDateByLong(obj.INSPECTDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'NEXTINSPECTDATE',index:'NEXTINSPECTDATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.NEXTINSPECTDATE) {
					return getSmpFormatDateByLong(obj.NEXTINSPECTDATE, false);
				} else {
					return "--";
				}
			}
		},
		{name:'INSPECTRESULT',index:'INSPECTRESULT',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.INSPECTRESULT) {
					return SelectOption.loadTestResultData(obj.INSPECTRESULT);
				} else {
					return "--";
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
    	url : BASE_URL + "/enterprise/entequipliftingmac/list",
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
		caption: "起重机械列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	var entid = $("#entid").val();
    	parent.parent.openWin(BASE_URL+"/enterprise/entequipliftingmac/add/"+entid,'添加','65%','65%');
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
    	var lifitingid = rowdata.LIFITINGID;
    	
    	parent.parent.openWin(BASE_URL+'/enterprise/entequipliftingmac/edit/'+lifitingid,'编辑','65%','65%');
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

    	var lifitingids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		lifitingids[i]= rowdatas.LIFITINGID;
    	}
    	var parmJson = lifitingids.toString();
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
function display(lifitingid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipliftingmac/display/"+lifitingid,'详细','65%','65%');
}


/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entequipliftingmac/delete",
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

 

