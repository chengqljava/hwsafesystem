$(document).ready(function() {
		var colname = ['主键id','项目内容','计量单位','合计'];
		var colmodel = [
			{name:'docid',index:'docid', width:'15%', hidden : true},
			{name:'docname',index:'docname',width:'10%',align:'center',sortable : false},
			{name:'unit',index:'unit',width:'10%',align:'center',sortable : false},
			{name:'count',index:'count',width:'10%',align:'center',sortable : false}
		];

		var tableHeight = $(window).height() - $('.pcheck').height() - 90;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height()- $('.pcheck').height() - 90);
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		});

	    $("#grid-table").jqGrid({
	    	height: tableHeight,
	    	url : BASE_URL + "/law/lawdocinfo/doccount",
			datatype: "json",
			cache : false,
			mtype : 'POST',
			colNames:colname,
			colModel:colmodel,
			sortname : 'docid',
			sortorder : "DESC",
			viewrecords : true,
			altRows: true,
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




