$(document).ready(function() {
	
	//设置当年年度和季度
	setYearAndQuarter();
	//隐患排查结果
	SelectOption.loadCheckResult("checkresult");
	 //下拉树
	SelectTree.loadCheckitemSelect("checkitem");
	
	var colname = ['id','检查日期','检查项目','检查内容','检查人','检查结果']; 
	var colmodel = [
		{name:'REGISTRAID',index:'REGISTRAID', width:'5%',hidden: true},
		{name:'CHECKTIME',index:'CHECKTIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.CHECKTIME) {
					return getSmpFormatDateByLong(obj.CHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'ITEMNAME',index:'ITEMNAME',width:'20%',align:'left'},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'20%',align:'left'},
		{name:'RUMMAGER',index:'RUMMAGER',width:'10%',align:'left'},
		{name:'RESTATE',index:'RESTATE',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.RESTATE=='1'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='有隐患'/>";
				}else if(obj.RESTATE=='0'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='无隐患'/>";
				}else{
					return "";
				}
			}
		}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })


    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/hiddendanger/hdientchecklist/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			begintime:$("#begintime").val(),
			endtime:$("#endtime").val(),
			checkresult:$("#checkresult").val(),
			checkitem:$("#checkitem_select").val()
		},
		sortname : 'REGISTRAID',
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
		caption: "自查列表",
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
});


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			begintime:$("#begintime").val(),
			endtime:$("#endtime").val(),
			checkresult:$("#checkresult").val(),
			checkitem:$("#checkitem_select").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#year").val("");
	$("#quarter").val("");
	$("#begintime").val("");
	$("#endtime").val("");
	$("#checkresult").val("");
	$("#checkitem").val("");
	$("#checkitem_select").val("");
});

/**
 * 设置当前年度和季度
 */
function setYearAndQuarter(){
	var curYear = new Date().getFullYear();
	var curMonth = new Date().getMonth()+1;
	var curQuarter = getQarter2Month(curMonth);
	$("#year").val(curYear);
	$("#quarter").val(curQuarter);
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month){
	if(1<=month && month<=3){
		return 1;
	}else if(4<=month && month<=6){
		return 2;
	}else if(7<=month && month<=9){
		return 3;
	}else{
		return 4;
	}
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast("请选择需要删除的数据！");
		return;
	}

	var registraids=[];
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		registraids[i]= rowdatas.REGISTRAID;
	}
	var parmJson = registraids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*删除方法*/
function del(param){
	    //弹出提示框
		parent.confirm('确认删除吗?',function(){
			$.ajax({ 
		  		url: BASE_URL+"/hiddendanger/hdientchecklist/delete",
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



 

