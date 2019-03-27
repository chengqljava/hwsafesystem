$(document).ready(function() {
	initSeachInput();
	var colname = ['应急仓库编号','和gis关联的id','仓库代码','仓库名称','仓库名称_hidden','行政区域','仓库地址','第一负责人','办公电话','手机','定位','设备物资','设备物资个数','操作']; 
	var colmodel = [
					{name:'EMSDEPOSID',index:'EMSDEPOSID', width:'5%',hidden:true},
					{name:'GISID',index:'GISID', width:'5%',hidden:true},
					{name:'DEPOTCODE',index:'DEPOTCODE', width:'5%'},
					{name:'STOREHOUSE2',index:'STOREHOUSE2', width:'5%',
					    formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="display(\''+obj.EMSDEPOSID+'\')">'+obj.STOREHOUSE+'</a>';
                        }
                     },
                    {name:'STOREHOUSE',index:'STOREHOUSE', width:'5%',hidden:true},
					{name:'DISTRICTNAME',index:'DISTRICTNAME', width:'5%'},
					{name:'ADDRESS',index:'ADDRESS', width:'5%'},
					{name:'PRINCIPALONE',index:'PRINCIPALONE', width:'5%'},
					{name:'OFFICETELONE',index:'OFFICETELONE', width:'5%'},
					{name:'MOBILEONE',index:'MOBILEONE', width:'5%'},
					{name:'LONGITUDE',index:'LONGITUDE', width:'5%',
					   formatter:function(cellvalue, options, obj) { 
                            if(obj.LONGITUDE!="" && obj.LATITUDE!=""){
                                return '<a href="javascript:void(0);" onclick="loactionGIS(\''+obj.LONGITUDE+'\',\''+obj.LATITUDE+'\',\''+obj.AREA+'\')">已定位</a>';
                            }else{
                                return '未定位';
                            }
                        }
					},
					{name:'COU_hid',index:'COU_hid', width:'5%',
					   formatter:function(cellvalue, options, obj) { 
                            return '<a href="javascript:void(0);" onclick="emsResMaterialList(\''+obj.EMSDEPOSID+'\')">'+obj.COU+'</a>';
                        }
                    },
                    {name:'COU',index:'COU', width:'5%',hidden:true},
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.EMSDEPOSID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.id+'\',\''+obj.EMSDEPOSID+'\')">删除</a>'
            		}}
			     ];
	if($("#entUser").val()){
	    //企业
	   colname.push("状态");
       colmodel.push({name:'FILLSTATE',index:'FILLSTATE', width:'5%',hidden: true,
                       formatter:function(cellvalue, options, obj) { 
                           return SelectOption.getEmsState(cellvalue);
                        }
                    }); 
	}else{
	    //政府
	   colname.push("所属单位");
       colmodel.push({name:'FILLORGANNAME',index:'FILLORGANNAME', width:'5%'}); 
	}
	
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsresdepos/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			storehouse:$("#storehouse").val(),
			depotCode:$("#depotCode").val(),
			principalone:$("#principalone").val(),
			districtid:$("#districtname_select").val()
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
		caption: "应急仓库列表",
		//autowidth: true,
		onSelectRow: function(id) { //单击选择行
		    var isselected = $("#isselected").val();
		    if(isselected){
		        var rowdatas = $("#grid-table").jqGrid('getRowData',id);
                window.top.GEventObject.fireEvent('LOAD_ENT_EVENT',rowdatas);
                parent.closeWin();
		    }
        },
        loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
});

function editInfo(id) {
	parent.openWin(BASE_URL+'/ems/emsresdepos/edit/'+id,'编辑','65%','75%');
}
function delInfo(id,emsdeposids) {
	if(id.COU>0){
	    parent.toast("关联应急物资,不能删除!");
	    return;
	}
	var param = {"ids":emsdeposids};
	del(param);
}
/*加载行政区域*/
function searchDistrict(districtid){
    $("#districtname_select").val(districtid);
    reloadGrid();
}

/*加载*/
function reloadGrid(){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			storehouse:$("#storehouse").val(),
            depotCode:$("#depotCode").val(),
            principalone:$("#principalone").val(),
            districtid:$("#districtname_select").val()
		}
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input").each(function(){
		$(this).val("");
	});
});


/**
 *企业端 上报 
 */
$("#report").on("click",function(){
    var ids = getSingleIds();
    var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    var emsdeposid = rowdata.EMSDEPOSID;
    var param = {emsdeposid:emsdeposid};
    //弹出提示框
    parent.confirm('确认上报吗?',function(){
        $.ajax({ 
            url: BASE_URL+"/ems/emsresdepos/report",
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
});



/*详细查询*/
function display(emsdeposid){
	parent.openWin(BASE_URL+"/ems/emsresdepos/display/"+emsdeposid,'详细','65%','75%');
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
	  		url: BASE_URL+"/ems/emsresdepos/delete",
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
 *应急物资列表 
 */
function emsResMaterialList(emsdeposid){
    parent.openWin(BASE_URL+'/ems/emsresmaterial/null/'+emsdeposid,'应急物资列表','70%','75%');
}
/**
 *在GIS上定位 
 *longitude:经度
 *latitude:维度 
 */
function loactionGIS(longitude,latitude,areaName){
	parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=1", "地理定位", "90%", "90%", false);
//    parent.openWin(BASE_URL+"/olgis/gisOperBuss/viewposition?longitude="+longitude+"&latitude="+latitude,'地理定位','90%','90%',false);  
}
