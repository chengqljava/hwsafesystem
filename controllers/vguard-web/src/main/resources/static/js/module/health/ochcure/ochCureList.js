$(document).ready(function() {
	SelectOption.loadCureType("curetype");//防治类型
	var colname = ['主键','标题','防治表类型 ','内容','备注','状态',"操作"]; 
	var colmodel = [
					{name:'cureid',index:'cureid',hidden:true},
					{name:'curetitle',index:'curetitle',
					   formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.cureid+'\')">'+obj.curetitle+'</a>';
                        }
                    },
					{name:'curetype',index:'curetype',
					    formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getCureType(obj.curetype);
                        }
                    },
					{name:'content',index:'content'},
					{name:'notes',index:'notes'},
					{name:'state',index:'state',hidden:true,
					   formatter:function(cellvalue, options, obj) { 
                            return SelectOption.getOchCureState(obj.state);
                        }
                    },
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.cureid+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.cureid+'\')">删除</a>'
            		}}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/health/ochcure/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			curetitle:$("#curetitle").val(),
			curetype:$("#curetype").val()
		},
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
		caption: "职业病防治列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"-2px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});
//编辑
function editInfo(cureid) {
	parent.openWin(BASE_URL+'/health/ochcure/edit/'+cureid,'编辑','55%','70%');
}
// 删除
function delInfo(cureid) {
	var param = {"ids":cureid};
	del(param);
}
/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			curetitle:$("#curetitle").val(),
            curetype:$("#curetype").val()
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
function display(cureid){
	top.openWin(BASE_URL+"/health/ochcure/display/"+cureid,'详细','55%','70%');
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
/*删除方法*/
function del(param){
    //弹出提示框
	parent.confirm('确认删除吗?',function(){
		$.ajax({ 
	  		url: BASE_URL+"/health/ochcure/delete",
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
            url: BASE_URL+"/health/ochcure/report",
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
