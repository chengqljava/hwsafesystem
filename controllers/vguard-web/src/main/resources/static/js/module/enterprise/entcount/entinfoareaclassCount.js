$(document).ready(function() {
	var colname = ['行政区域id','行政区域级别','区域名称','工业及危险化学品类','商贸及服务类','交通运输类','工程建设类','合计']; 
	var colmodel = [
	    {name:'DISTRICTCODE',index:'DISTRICTCODE',width:'5%',align:'left',hidden: true},
	    {name:'DISTRICTLEVEL',index:'DISTRICTLEVEL',width:'5%',align:'left',hidden: true},
		{name:'SHORTNAME',index:'SHORTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.DISTRICTCODE+'\',\''+obj.DISTRICTLEVEL+'\')">'+obj.SHORTNAME+'</a>';
			}
		},
		{name:'INDUSTRYNUM',index:'INDUSTRYNUM',width:'10%',align:'left'},
		{name:'BUSINESSNUM',index:'BUSINESSNUM',width:'10%',align:'left'},
		{name:'TRAFFICNUM',index:'TRAFFICNUM',width:'10%',align:'left'},
		{name:'ENGINEERINGNUM',index:'ENGINEERINGNUM',width:'10%',align:'left'},
		{name:'CLASSSUM',index:'CLASSSUM',width:'10%',align:'left'}
	];
	$(window).on('resize.jqGrid', function () {
		if($(window).width() < 700) {
			$('.ui-jqgrid-htable').css({"width":"900"});
			$("#grid-table").css({"width":"900" });
			$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
			$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
		} else {
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
		}
    })
    $("#grid-table").jqGrid({
    	height: 600,
    	url : BASE_URL + "/enterprise/entcount/entDistrictClassCount",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			stime:$("#stime").val(), 
			etime:$("#etime").val(), 
			parentid:$("#parentid").val(),
			districtlevel:$("#districtlevel").val(),
			districtid:$("#districtid").val()
		},
		sortname : 'DISTRICTCODE',
		sortorder : "desc",
		viewrecords : true,
		//pager : "#grid-pager",
		jsonReader : {
			root : "datas",
			total : "total",
			page : "page",
			records : "records",
			repeatitems : false
		},
		rowNum:100,
		rowList:[10,20,30],
		altRows: true,
		multiselect: false,
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
});

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			stime:$("#stime").val(), 
			etime:$("#etime").val(), 
			parentid:$("#parentid").val(),
			districtlevel:$("#districtlevel").val(),
			districtid:$("#districtid").val()
			             }
	}).trigger("reloadGrid");
}

/*详细查询*/
function display(districtcode,districtlevel){
	if(districtcode==null || districtcode=="" || districtcode ==undefined || districtcode == "undefined"){
		return;
	}
	var stime = $("#stime").val();
	var etime = $("#etime").val(); 
	var districtid = $("#districtid").val(); //点击左侧树 
	//上级级别查询下级级别
	if(districtlevel==1){
		//行政区域级别districtlevel(查询所属街道办级别区域,2:标示街道办级别)
		window.location.href = BASE_URL + '/enterprise/entcount/intoEntDistrictClass?stime='+stime+'&etime='+etime+'&districtlevel=2&parentid='+districtcode+'&districtid='+districtid;
	}else if(districtlevel==2){
		//行政区域级别districtlevel(查询所属社区级别区域,3:标示社区级别)
		window.location.href = BASE_URL + '/enterprise/entcount/intoEntDistrictClass?stime='+stime+'&etime='+etime+'&districtlevel=3&parentid='+districtcode+'&districtid='+districtid;
	}
	
}

