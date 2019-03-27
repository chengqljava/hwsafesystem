$(document).ready(function() {
	var colname = ['行政区域','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个','家','个']; 
	var colmodel = [
		{name:'SHORTNAME',index:'SHORTNAME',align:'left',width:290,
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="nextLevel(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.SHORTNAME+'</a>';
			}
		},
		{name:'WXHXPU1',index:'WXHXPU1'},
		{name:'WXHXPD1',index:'WXHXPD1',align:'center'},
		{name:'RQU1',index:'RQU1',align:'center'},
		{name:'RQD1',index:'RQD1',align:'center'},
		{name:'GKU1',index:'GKU1',align:'center'},
		{name:'GKD1',index:'GKD1',align:'center'},
		{name:'LEVELU1',index:'LEVELU2',align:'center'},
		{name:'LEVELD1',index:'LEVELD2',align:'center'},
		{name:'WXHXPU2',index:'WXHXPU2'},
		{name:'WXHXPD2',index:'WXHXPD2',align:'center'},
		{name:'RQU2',index:'RQU2',align:'center'},
		{name:'RQD2',index:'RQD2',align:'center'},
		{name:'GKU2',index:'GKU2',align:'center'},
		{name:'GKD2',index:'GKD2',align:'center'},
		{name:'LEVELU2',index:'LEVELU2',align:'center'},
		{name:'LEVELD2',index:'LEVELD2',align:'center'},
		{name:'WXHXPU3',index:'WXHXPU3'},
		{name:'WXHXPD3',index:'WXHXPD3',align:'center'},
		{name:'RQU3',index:'RQU3',align:'center'},
		{name:'RQD3',index:'RQD3',align:'center'},
		{name:'GKU3',index:'GKU3',align:'center'},
		{name:'GKD3',index:'GKD3',align:'center'},
		{name:'LEVELU3',index:'LEVELU3',align:'center'},
		{name:'LEVELD3',index:'LEVELD3',align:'center'},
		{name:'WXHXPU4',index:'WXHXPU4'},
		{name:'WXHXPD4',index:'WXHXPD4',align:'center'},
		{name:'RQU4',index:'RQU4',align:'center'},
		{name:'RQD4',index:'RQD4',align:'center'},
		{name:'GKU4',index:'GKU4',align:'center'},
		{name:'GKD4',index:'GKD4',align:'center'},
		{name:'LEVELU4',index:'LEVELU4',align:'center'},
		{name:'LEVELD4',index:'LEVELD4',align:'center'},
	];
	
	var tableHeight = $(window).height() - 202 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight',  $(window).height() - 202 -33);
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssStatistics/dangerLevelTJList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			districtlevel:$("#districtlevel").val(),
			parentid:$("#parentid").val()
		},
		sortname : 'SHORTNAME',
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
		rowNum:50,
		rowList:[50,100,150],
		altRows: true,
		multiselect: true,
		caption: "",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"1200","overflow-x" : "scroll"});
				$("#grid-table").css({"width":"1200" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({"overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({"overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
	//设置二级表头
	jQuery("#grid-table").jqGrid("setGroupHeaders",{
		 useColSpanStyle: false, 
		 groupHeaders:[
			{startColumnName: 'WXHXPU1', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">危险化学品</div>'},
			{startColumnName: 'RQU1', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">燃气</div>'},
			{startColumnName: 'GKU1', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">港口</div>'},
			{startColumnName: 'LEVELU1', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">合计</div>'},
			
			{startColumnName: 'WXHXPU2', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">危险化学品</div>'},
			{startColumnName: 'RQU2', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">燃气</div>'},
			{startColumnName: 'GKU2', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">港口</div>'},
			{startColumnName: 'LEVELU2', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">合计</div>'},
			
			{startColumnName: 'WXHXPU3', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">危险化学品</div>'},
			{startColumnName: 'RQU3', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">燃气</div>'},
			{startColumnName: 'GKU3', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">港口</div>'},
			{startColumnName: 'LEVELU3', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">合计</div>'},
			
			{startColumnName: 'WXHXPU4', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">危险化学品</div>'},
			{startColumnName: 'RQU4', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">燃气</div>'},
			{startColumnName: 'GKU4', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">港口</div>'},
			{startColumnName: 'LEVELU4', numberOfColumns: 2, titleText: '<div class="ui-jqgrid-sortable" style="top: 0px;">合计</div>'},
		 ]

	});
	//单独调用该方法，设置三级表头
	jQuery("#grid-table").jqGrid("setComplexGroupHeaders",{
		 complexGroupHeaders:[
		    {startColumnName:'WXHXPU1',numberOfColumns:8,titleText:'<div class="ui-jqgrid-sortable" style="top: 0px;">一级'},
		    {startColumnName:'WXHXPU2',numberOfColumns:8,titleText:'<div class="ui-jqgrid-sortable" style="top: 0px;">二级'},
		    {startColumnName:'WXHXPU3',numberOfColumns:8,titleText:'<div class="ui-jqgrid-sortable" style="top: 0px;">三级'},
		    {startColumnName:'WXHXPU4',numberOfColumns:8,titleText:'<div class="ui-jqgrid-sortable" style="top: 0px;">四级'}
		 ]	

	});
});

function nextLevel(parentid,districtlevel){
	if(parentid != undefined && districtlevel!=undefined && districtlevel!=3){//3级下面没有了
		$("#districtlevel").val(districtlevel);
		$("#parentid").val(parentid);
		$("#grid-table").jqGrid('setGridParam',{
			page:1,postData:{
				districtlevel:districtlevel,
				parentid:parentid
			}
		}).trigger("reloadGrid");
	}
	
}
/**
 * 导出Excel表格
 */
$("#exportExcel").on("click",function(){
	var districtlevel = $("#districtlevel").val();
	var parentid = $("#parentid").val();
	window.location.href = BASE_URL+"/dangersource/dssStatistics/dangerLevelTJListExport?parentid="+parentid+"&districtlevel="+districtlevel;
})