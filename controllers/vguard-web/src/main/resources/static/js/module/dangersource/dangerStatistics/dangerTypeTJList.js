$(document).ready(function() {
	var colname = ['行政区域','家','个','家','个','家','个','家','个']; 
	var colmodel = [
		{name:'SHORTNAME',index:'SHORTNAME',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="nextLevel(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.SHORTNAME+'</a>';
			}
		},
		{name:'A1',index:'A1'},
		{name:'A11',index:'A11',align:'center'},
		{name:'A2',index:'A2',align:'center'},
		{name:'A22',index:'A22',align:'center'},
		{name:'A3',index:'A3',align:'center'},
		{name:'A33',index:'A33',align:'center'},
		{name:'SUM1',index:'SUM1',align:'center'},
		{name:'SUM2',index:'SUM2',align:'center'}
	];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/dangersource/dssStatistics/dangerTypeTJList",
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
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
	

	$( "#grid-table" ).jqGrid( 'setGroupHeaders' , {
		useColSpanStyle : true , // 没有表头的列是否与表头列位置的空单元格合并
		groupHeaders : [{
				startColumnName : 'A1' , // 对应colModel中的name
				numberOfColumns : 2, // 跨越的列数
				titleText : '<div id="jqgh_grid-table_A1" class="ui-jqgrid-sortable" style="top: 0px;">危险化学品类</div>'
			},
			{
				startColumnName : 'A2' , // 对应colModel中的name
				numberOfColumns : 2, // 跨越的列数
				titleText : '<div class="ui-jqgrid-sortable" style="top: 0px;">燃气类</div>'
			},
			{
				startColumnName : 'A3' , // 对应colModel中的name
				numberOfColumns : 2, // 跨越的列数
				titleText : '<div class="ui-jqgrid-sortable" style="top: 0px;">港口类</div>'
			},
			{
				startColumnName : 'SUM1' , // 对应colModel中的name
				numberOfColumns : 2, // 跨越的列数
				titleText : '<div class="ui-jqgrid-sortable" style="top: 0px;">重大危险源合计</div>'
			}
			
		]
	});

});
/**
 *点击区域名称 进入下一级
 * @param parentid
 * @param districtlevel
 * @author lzqiang
 * @date 2016年7月20日 下午1:01:20
 */
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
 * @author lzqiang
 * @date 2016年7月20日 下午1:01:47
 */
$("#exportExcel").on("click",function(){
	var districtlevel = $("#districtlevel").val();
	var parentid = $("#parentid").val();
	window.location.href = BASE_URL+"/dangersource/dssStatistics/dangerTypeTJListExport?parentid="+parentid+"&districtlevel="+districtlevel;
});