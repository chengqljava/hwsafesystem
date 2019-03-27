$(document).ready(function() {
	
	var colname = ['警示灯','企业名称','主要负责人','联系电话','许可类型','许可编号','证书有效期','发证机关']; 
	var colmodel = [
		{name:'STATUS',index:'STATUS', width:'5%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if(obj.STATUS=='1'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='超期'/>";
				}else if(obj.STATUS=='2'){
					return "<img src='"+BASE_URL+"/images/permitlight/lightyellow.gif' title='预超期'/>";
				}else{
					return "";
				}
			}
		},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'LEGALPERSON',index:'LEGALPERSON',width:'10%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'10%',align:'left'},
		{name:'CHEMICALTYPE',index:'CHEMICALTYPE',width:'15%',align:'left'},
		{name:'CERTIFICATENUM',index:'CERTIFICATENUM',width:'10%',align:'left'},
		{name:'EXPIRYDATE',index:'EXPIRYDATE',width:'10%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.EXPIRYDATE,"yyyy-MM-dd");
			}
		},
		{name:'LICENCEISSUING',index:'LICENCEISSUING',width:'10%',align:'left'}
	];

	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/dangerentcount/entpermitwarnlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			year:$("#year").val(), 		//年份
			status:$("#status").val(),	//警示状态
			districtid:$("#districtid").val()
		},
		sortname : 'EXPIRYDATE',
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
		multiselect: false,
		caption: "许可预警",
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
function reloadGrid(districtcode,districtname){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			year:$("#year").val(), 		//年份
			status:$("#status").val(),	//警示状态
			districtid:$("#districtid").val()
			             }
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#year").val("");
	$("#status").val("");
});


/*企业安全信息*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

