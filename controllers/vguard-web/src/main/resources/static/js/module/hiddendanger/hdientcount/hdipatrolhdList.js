$(document).ready(function() {
	
	var colname = ['企业名称','隐患编号','检查日期','隐患巡查内容','隐患基本情况','隐患状态']; 
	var colmodel = [
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'ENTREGISTRANUM',index:'ENTREGISTRANUM', width:'10%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				return '<a href="javascript:void(0);" onclick="displayHd(\''+obj.REGISTRAID+'\')">'+obj.ENTREGISTRANUM+'</a>';
			}
		},
		{name:'CHECKTIME',index:'CHECKTIME',width:'10%',align:'center',
			formatter:function(cellvalue, options, obj) { 
				if (obj.CHECKTIME) {
					return getSmpFormatDateByLong(obj.CHECKTIME, false);
				} else {
					return "";
				}
			}
		},
		{name:'CHECKCONTENT',index:'CHECKCONTENT',width:'20%',align:'left'},
		{name:'REINFO',index:'REINFO',width:'20%',align:'left'},
		{name:'REFORMSTATE',index:'REFORMSTATE',width:'10%',align:'center'}
	];
	
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: 250,
    	url : BASE_URL + "/hiddendanger/hdientcount/patrolhdlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			reformstate:$("#reformstate").val(),
			year:$("#year").val(),
			quarter:$("#quarter").val()
		},
		sortname : 'CHECKTIME',
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

/**
 * 企业安全信息
 * @param businessinfoid
 * @param entname
 */
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

/**
 * 隐患信息
 * @param businessinfoid
 * @param entname
 */
function displayHd(registraid){
	parent.openWin(BASE_URL+'/hiddendanger/hdientabarbeitung/display/'+registraid+'/GOV','隐患整改详细','','85%');
}


