$(document).ready(function() {
	
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
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdigovchecklist/checklist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			businessinfoid:$("#businessinfoid").val(),
			inspectionid:$("#inspectionid").val()
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
		autowidth: true
	});
});


/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(),
			quarter:$("#quarter").val(),
			businessinfoid:$("#businessinfoid").val(),
			inspectionid:$("#inspectionid").val()
			}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#year").val();
	$("#quarter").val();
	$("#begintime").val();
	$("#endtime").val();
	$("#checkresult").val();
	$("#checkitem").val();
	$("#checkitem_select").val()
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



 

