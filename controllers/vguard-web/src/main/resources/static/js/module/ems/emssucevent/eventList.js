$(document).ready(function() {
	var colname = ['主键','事故名称','发生时间','发生地址','事故类型','事故等级','事故原因','事故概述','伤亡情况','状态']; 
	var colmodel = [{name:'EVENTID',index:'EVENTID',hidden:true},
					{name:'EVENTNAME',index:'EVENTNAME',
            			formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EVENTID+'\')">'+obj.EVENTNAME+'</a>';
                        }
					},
					{name:'TIME',index:'TIME',
					    formatter:function(cellvalue, options, obj) { 
                            return getSmpFormatDateByLong(obj.TIME,true);
                        }
                    },
					{name:'ADDRESS',index:'ADDRESS'},
					{name:'EVENTTYPENAME',index:'EVENTTYPENAME'},
					{name:'EVENTLEVEL',index:'EVENTLEVEL',
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getAcclevel(obj.EVENTLEVEL);
                        }
					},
					{name:'REASON',index:'REASON'},
					{name:'CONTENT',index:'CONTENT'},
					{name:'CASUALTY',index:'CASUALTY'},
                    {name:'STATE',index:'STATE',
                        formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getEmsSucState(obj.STATE);
                        }
                    }
			       ];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emssucevent/loadeventlist",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			name:$("#name").val()
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
		caption: "事故信息列表",
		autowidth: true,
		loadComplete:function(){
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
			name:$("#name").val(),
            stime:$("#begintime").val(),
            etime:$("#endtime").val(),
            state:$("#state").val()
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


/**
 *政府端处理 
 */
$("#hander").on("click",function(){
     //返回当前grid中复选框所选择的数据的id 
    var ids = getManyIds("请选择需要处理的数据!");
    var eventids=[];
    var state = "";
    for(var i=0;i<ids.length;i++){
        var id = ids[i]; 
        //返回指定id行的数据 
        var rowdatas = $("#grid-table").jqGrid('getRowData',id);
        eventids[i]= rowdatas.EVENTID;
    }
    var parmJson = eventids.toString();
    var param = {"ids":parmJson};
    hander(param);
});



/*详细查询*/
function display(eventid){
	parent.openWin(BASE_URL+"/ems/emssucevent/display/"+eventid,'详细','65%','75%');
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


/**
 *政府端处理 
 */
function hander(param){
    //弹出提示框
    parent.confirm('确认处理吗?',function(){
        $.ajax({ 
            url: BASE_URL+"/ems/emssucevent/hander",
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
    });
}
/**
 *企业上报 
 */
function report(param){
    //弹出提示框
    parent.confirm('确认上报吗?',function(){
        $.ajax({ 
            url: BASE_URL+"/ems/emssucevent/report",
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
    });
}

/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/ems/emssucevent/delete",
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
	});
}
