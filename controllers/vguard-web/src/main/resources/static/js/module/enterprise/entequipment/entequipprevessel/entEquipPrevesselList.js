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
	
	var colname = ['压力容器id','设备名称','使用登记证编号','容积m3','容器类型','工作介质','安全等级','有效期至','是否停用','检定结论']; 
	var colmodel = [
		{name:'PREVESSELID',index:'PREVESSELID', width:'5%',hidden: true},
		{name:'DEVICENAME',index:'DEVICENAME',width:'15%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.PREVESSELID+'\')">'+obj.DEVICENAME+'</a>';
			}
		},
		{name:'REGISTNUMBER',index:'REGISTNUMBER',width:'10%',align:'left'},
		{name:'VOLUME',index:'VOLUME',width:'10%',align:'left'},
		{name:'VESSELTYPE',index:'VESSELTYPE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadVesselTypeData(obj.VESSELTYPE)
			}
		},
		{name:'WORKINGMEDIUM',index:'WORKINGMEDIUM',width:'10%',align:'left'},
		{name:'SAFETYLEVEL',index:'SAFETYLEVEL',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadSafetylevelData(obj.SAFETYLEVEL)
			}
		},
		{name:'EFFECTIVETIME',index:'EFFECTIVETIME',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				if (obj.EFFECTIVETIME) {
					return getSmpFormatDateByLong(obj.EFFECTIVETIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'STATE',index:'STATE',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadPrevesselStateData(obj.STATE)
			}
		},
		{name:'TESTRESULT',index:'TESTRESULT',width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return SelectOption.loadTestResultData(obj.TESTRESULT)
			}
		},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipprevessel/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
		},
		sortname : 'STARTTIME',
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
		caption: "压力容器列表",
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
    	parent.parent.openWin(BASE_URL+"/enterprise/entequipprevessel/add/"+entid,'添加','58%','75%');
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
    	var prevesselid = rowdata.PREVESSELID;
    	console.log(prevesselid);
    	parent.parent.openWin(BASE_URL+'/enterprise/entequipprevessel/edit/'+prevesselid,'编辑','58%','75%');
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

    	var prevesselids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		prevesselids[i]= rowdatas.PREVESSELID;
    	}
    	var parmJson = prevesselids.toString();
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
		page:1,postData:{
			entid:$("#entid").val(),
			devicename:$("#devicename").val(),
            registnumber:$("#registnumber").val()
		}
	}).trigger("reloadGrid");
}




/*详细查询*/
function display(prevesselid){
	parent.parent.openWin(BASE_URL+"/enterprise/entequipprevessel/display/"+prevesselid,'详细','58%','75%');
}


/*删除方法*/
function del(param){
	    //弹出提示框
		parent.parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/enterprise/entequipprevessel/delete",
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

 

