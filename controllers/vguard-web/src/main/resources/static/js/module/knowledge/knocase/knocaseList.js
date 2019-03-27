$(document).ready(function() {
	initSeachInput();
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
	
	SelectOption.loadAcclevel("acclevel");
//	SelectTree.loadEventTypeAllTreeSelect("acctype");
	SelectTree.loadEconindustrySelect("industrytype");
	
	var colname = ['CASEID','事故标题','行业类型','事故级别','发生时间']; 
	var colmodel = [
		{name:'CASEID',index:'CASEID', width:'5%',hidden: true},
		{name:'ACCNAME',index:'ACCNAME',width:'20%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.CASEID+'\')">'+obj.ACCNAME+'</a>';
			}
		},
		{name:'TYPE',index:'TYPE',width:'20%',align:'center'
			},
		/*{name:'NAME',index:'NAME', width:'20%', align:'center', 
		},*/
		{name:'ACCLEVEL',index:'ACCLEVEL', width:'20%', align:'center', 
			formatter : function(cellvalue, options, obj) {
				return obj.ACCLEVEL != null ? SelectOption.getAcclevel(obj.ACCLEVEL) : "";
			}
		},
		{name:'ACCTIME',index:'ACCTIME',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.ACCTIME == null)
					return "-";
				else
					return getSmpFormatDateByLong(obj.ACCTIME,true);
			}, width : '10%'}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});
	
//	$(window).on('resize.jqGrid', function () {
//		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
//    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/knowledge/knocase/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			keyword:$("#keyword").val(),
			industrytype:$("#industrytype").val(),
//			acctype:$("#acctype").val(),
			acclevel:$("#acclevel").val()
		},
		sortname : 'CASEID',
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
		caption: "事故案例",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}

	});
    
    /*添加*/
    $("#addBtn").on("click", function () {
    	parent.openWin(BASE_URL+"/knowledge/knocase/add",'添加','60%','75%');
    });
    
    /*编辑*/
    $("#editBtn").on("click", function () {
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length !=1){
    		// 弹出提示信息
    		parent.toast("请选择一条记录！");
    		return;
    	}
    	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    	var chemcatalid = rowdata.CASEID;
    	
    	parent.openWin(BASE_URL+'/knowledge/knocase/edit/'+chemcatalid,'编辑','60%','75%');
    });

    /* Excel导入 */
    $("#importBtn").bind("click", function() {
    	parent.openWin(BASE_URL + '/knowledge/knocase/importExcel','excel导入事故案例', "45%", "30%");
    });
    
    /*批量删除*/
    $("#delBtn").on("click", function () {
    	//返回当前grid中复选框所选择的数据的id 
    	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
    	if(ids.length==0){
    		// 弹出提示信息
    		parent.toast("请选择需要删除的数据！");
    		return;
    	}
    
    	var chemcatalids=[];
    	for(var i=0;i<ids.length;i++){
    		var id = ids[i]; 
    		//返回指定id行的数据 
    		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
    		chemcatalids[i]= rowdatas.CASEID;
    	}
    	var parmJson = chemcatalids.toString();
    	var param = {"ids":parmJson};
    	del(param);
    });
    
    
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			keyword:$("#keyword").val(),
			industrytype:$("#industrytype").val(),
//			acctype:$("#acctype").val(),
			acclevel:$("#acclevel").val()}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#chemcatalname").val();
	$("#alias").val();
	$("#cas").val();
	$("#un").val();
});



/*详细查询*/
function display(chemcatalid){
	parent.openWin(BASE_URL+'/knowledge/knocase/display/'+chemcatalid,'详细','60%','75%');
}



/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/knowledge/knocase/delete",
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





 

