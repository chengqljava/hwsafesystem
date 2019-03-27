$(document).ready(function() {
	
	var colname = ['目录id','品名','别名','危险货物编号','CAS','UN','MSDS']; 
	var colmodel = [
		{name:'CHEMCATALID',index:'CHEMCATALID', width:'5%',hidden: true},
		{name:'CHEMCATALNAME',index:'CHEMCATALNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.CHEMCATALID+'\')">'+obj.CHEMCATALNAME+'</a>';
			}
		},
		{name:'ALIAS',index:'ALIAS',width:'20%',align:'left'},
		{name:'SPECIFICATIONS',index:'SPECIFICATIONS',width:'10%',align:'left'},
		{name:'CAS',index:'CAS',width:'10%',align:'left'},
		{name:'UN',index:'UN',width:'10%',align:'left'},
		{name:'MSDS',index:'MSDS',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.MSDS=="true"){
					return '<a href="javascript:void(0);" onclick="gotoMSDS(\''+obj.CAS+'\',\''+obj.UN+'\')">进入</a>';
				}else{
					return '';
				}
			}
		}
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
    	url : BASE_URL + "/knowledge/knochemicalcatal/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			chemcatalname:$("#chemcatalname").val(),
			alias:$("#alias").val(),
			cas:$("#cas").val(),
			un:$("#un").val()
		},
		sortname : 'CHEMCATALID',
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
		caption: "危险化学品名录库",
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
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			chemcatalname:$("#chemcatalname").val(),
			alias:$("#alias").val(),
			cas:$("#cas").val(),
			un:$("#un").val()}
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
	parent.openWin(BASE_URL+"/knowledge/knochemicalcatal/display/"+chemcatalid,'详细','60%','75%');
}



/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/knowledge/knochemicalcatal/delete",
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

/*excel导入*/
$("#importBtn").on("click", function () {
	parent.openWin(BASE_URL+"/knowledge/knochemicalcatal/import",'导入excel数据','60%','40%');
});

/**
 * 进入msds详细页
 * @param cas
 * @param un
 */
function gotoMSDS(cas,un){
	parent.parent.parent.openWin(BASE_URL + "/knowledge/knomsds/chemsds?casno="+cas+"&unno="+un, '详细', "65%", "75%");
}


 

