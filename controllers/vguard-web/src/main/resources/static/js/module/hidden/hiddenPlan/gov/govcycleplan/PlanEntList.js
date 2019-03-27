/**
 * 政府周期计划计划检查企业
 */
$(document).ready(function() {
	var colname = ['工商信息id','企业信息id','企业名称','行业主管分类','行业行政主管部门','负责人','联系电话','采集状态',/**'审核状态',**/'更新时间']; 
	var colmodel = [
		{name:'BUSINESSINFOID',index:'BUSINESSINFOID', width:'5%',hidden: true},
		{name:'BASEINFOID',index:'BASEINFOID', width:'5%',hidden: true},
		{name:'ENTNAME',index:'ENTNAME',width:'20%',align:'left',
			formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="display(\''+obj.BUSINESSINFOID+'\',\''+obj.ENTNAME+'\')">'+obj.ENTNAME+'</a>';
			}
		},
		{name:'DIRECTORTYPENAME',index:'DIRECTORTYPENAME',width:'20%',align:'left'},
		{name:'ALLORGNAME',index:'ALLORGNAME',width:'20%',align:'left'},
		{name:'LEGALPERSON',index:'DIRECTORTYPEID',width:'6%',align:'left'},
		{name:'PHONE',index:'PHONE',width:'8%',align:'left'},
		{name:'STATUS',index:'STATUS',width:'10%',align:'left',editoptions : {value : "0:未填报;1:填报中;2:更新中;3:已上报"},formatter:'select'},
		/**
		{name:'AUDITSTATUS',index:'AUDITSTATUS',width:'8%',align:'left',editoptions : {value:"0:审核未通过;1:审核通过;null:未审核"},formatter:'select'},
		**/
		{name:'UPDATETIME',index:'UPDATETIME',width:'15%',align:'left',
			formatter : function(cellvalue, options, obj) {
				return getFormatDateByLong(obj.UPDATETIME,
						"yyyy-MM-dd hh:mm:ss");
			}
		}
	];
	var tableHeight = $(window).height() - $(".pcheck").height() - 150;
	$(window).on('resize.jqGrid', function () {
		$("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 150);
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
    })

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL +'hidden/hidcheckplan/planEntList/'+GetQueryString("checkplanid"),
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{},
		sortname : 'updatetime',
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
		multiselect: true,
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

/*详细查询*/
function display(businessinfoid,entname){
	// parent.openWin(BASE_URL+'/enterprise/entsafeinfomenu/safemenuDisplay/'+businessinfoid,entname,'80%','90%');
    parent.openWin(BASE_URL+"/views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid="+businessinfoid,'详细','90%','90%');
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
