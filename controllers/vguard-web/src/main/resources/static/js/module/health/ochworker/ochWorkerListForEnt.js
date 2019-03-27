$(document).ready(function() {
    var isGOVUser = $("#isGOVUser").val();
	var colname = ['企业','主键id','姓名','出生日期','联系电话','性别','民族','总工龄','接害工龄','家庭住址','工种','学历','技术职称','职业健康检查表编号','所在作业场所名称','状态']; 
	var colmodel = [
					{name:'ENTNAME',index:'ENTNAME'},
					{name:'WORKERID',index:'WORKERID',hidden:true},
					{name:'NAME',index:'NAME',formatter:
                           function(cellvalue, options, obj) { 
                              return '<a href="javascript:void(0);" onclick="display(\''+obj.WORKERID+'\')">'+obj.NAME+'</a>';
                           }
                    },
					{name:'BIRTHDAY',index:'BIRTHDAY',formatter:
					       function(cellvalue, options, obj) { 
                              return getSmpFormatDateByLong(obj.BIRTHDAY,false);
                           }
                    },
					{name:'TEL',index:'TEL'},
					{name:'SEX',index:'SEX',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getSex(obj.SEX);
                         }
                    },
					{name:'NATION',index:'NATION',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getNation(obj.NATION);
                         }
                    },
					{name:'WORKAGE',index:'WORKAGE'},
					{name:'INDIRECTHARMAGE',index:'INDIRECTHARMAGE'},
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'WORKTYPE',index:'WORKTYPE'},
					{name:'EDUCATION',index:'EDUCATION',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getEducation(obj.EDUCATION);
                         }
                    },
					{name:'TECHNICAL',index:'TECHNICAL',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getTechnical(obj.TECHNICAL);
                         }
                    },
					{name:'HEALTHNUM',index:'HEALTHNUM'},
					{name:'WORKPLACE',index:'WORKPLACE',formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getOchWorkPlace(obj.WORKPLACE);
                         }
                    },
					{name:'STATE',index:'STATE',hidden:true,formatter:
                         function(cellvalue, options, obj) { 
                             return SelectOption.getOchWorkerState(obj.STATE);
                         }
                    }
			];
	if(isGOVUser){//政府用户
	    colname.pop();//移除最后一个
	    colmodel.pop();
	}else{
	    colname.shift();//移除第一个
	    colmodel.shift();
	}
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochworker/listforent",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			businessinfoid:$("#businessinfoid").val()
		},
		sortname : 'UPDATETIME',
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
		caption: "劳动者信息列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
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
			businessinfoid:$("#businessinfoid").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	});
});

/*详细查询*/
function display(workerid){
	parent.openWin(BASE_URL+'/health/ochworker/labelpage/menuDisplay/'+workerid,'劳动者信息','70%','80%');
}


/**
 * 值选择一条记录
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:43:15
 */
function getSingleIds(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	return ids;
}
/**
 * 获取多条记录id
 * @param message
 * @returns
 * @author lzqiang
 * @date 2016年7月7日 下午4:45:13
 */
function getManyIds(message){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length==0){
		// 弹出提示信息
		parent.toast(message);
		return;
	}
	return ids;
}
