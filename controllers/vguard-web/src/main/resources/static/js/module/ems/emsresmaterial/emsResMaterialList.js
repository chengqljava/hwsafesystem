$(document).ready(function() {
	if($(window).width() < 700) {
		$('.showBtn').css({"display":"none"});
		var len = $('.dropdown-menu li').length;
		for(var i = 0; i < len; i++) {
			$('.smallShow li button')[i].onclick = function () {
    				var html = $(this).html();
    				$('.clickBtn').html(html);
    			};
    		}
	}else {
		// $('.showBtn').show({"display":"block"});
		// $('.smallShow').css({"display":"none"});
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	initSeachInput();
	SelectOption.loadEquiptypemax("equiptypemaxid");
    SelectOption.loadEquiptypemin("equiptypeminid",{"materialmaxid":"-1"});
    $("#equiptypemaxid").bind("change",function(){
        $("#equiptypeminid").html("");
        SelectOption.loadEquiptypemin("equiptypeminid",{"materialmaxid":$(this).val()});
    });
	
    console.log(Date.parse(new Date()));
    
	var colname = ['主键id','和gis关联ID','应急仓库id','是否过期','物资设备编号','物资设备名称','行政区域','物资设备类别大类','物资设备类别小类','规格型号','数量','所属仓库','地理定位',"操作"]; 
	
	var colmodel = [
					{name:'EMSMATERIALID',index:'EMSMATERIALID', width:'5%',hidden:true},
					{name:'GISID',index:'GISID', width:'5%',hidden:true},
					{name:'EMSDEPOSID',index:'EMSDEPOSID', width:'5%',hidden:true},
					{name:'DUETIME',index:'DUETIME',width: '3%',align: 'center',
						formatter: function(cellvalue, options, obj){
							if(cellvalue != null && cellvalue < Date.parse(new Date())){
								return "<img src='"+BASE_URL+"/images/permitlight/lightred.gif' title='过期'/>";
							}else{
								return "<img src='"+BASE_URL+"/images/permitlight/lightgreen.gif' title='正常'/>";
							}
						}
					},
					{name:'MATERIALNUM',index:'MATERIALNUM', width:'5%'},
					{name:'MATERIALNAME',index:'MATERIALNAME', width:'5%',
					   formatter:function(cellvalue, options, obj) { 
                             return '<a href="javascript:void(0);" onclick="display(\''+obj.EMSMATERIALID+'\')">'+obj.MATERIALNAME+'</a>';
                        }
                    },
					{name:'DISTRICTNAME',index:'DISTRICTNAME', width:'5%'},
					{name:'MAXNAME',index:'MAXNAME', width:'5%'},
					{name:'MINAME',index:'MINAME', width:'5%'},
					{name:'MODEL',index:'MODEL', width:'5%'},
					{name:'NUM',index:'NUM', width:'5%'},
					{name:'UNITNAME',index:'UNITNAME', width:'5%'},
					{name:'LONGITUDE',index:'LONGITUDE', width:'5%',
                       formatter:function(cellvalue, options, obj) { 
                            if(obj.LONGITUDE!="" && obj.LATITUDE!=""){
                                return '<a href="javascript:void(0);" onclick="loactionGIS(\''+obj.LONGITUDE+'\',\''+obj.LATITUDE+'\',\''+obj.AREA+'\')">已定位</a>';
                            }else{
                                return '未定位';
                            }
                        }
                    },
            		{name:'OPERATION',index:"OPERATION",width:'80px',fixed:true,align:"left",formatter:function(cellvalue, options, obj){
            			return '<a href="javascript:void(0);" title="编辑" class="operation editInfoBtn" onclick="editInfo(\''+obj.EMSMATERIALID+'\')">编辑</a><br>'
            			     + '<a href="javascript:void(0);" title="删除" class="operation delInfoBtn" onclick="delInfo(\''+obj.EMSMATERIALID+'\')">删除</a>'
            		}}
			];
	
	if($("#entUser").val()){
        //企业
       colname.push("状态");
       colmodel.push({name:'FILLSTATE',index:'FILLSTATE',width:'5%',hidden: true,
                        formatter:function(cellvalue, options, obj) { 
                           return SelectOption.getEmsState(obj.FILLSTATE);
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
    	url : BASE_URL + "/ems/emsresmaterial/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			unitname:$("#unitname").val(),
			materialname:$("#materialname").val(),
			equiptypemaxid:$("#equiptypemaxid").val(),
			equiptypeminid:$("#equiptypeminid").val(),
			emsdeposid:$("#emsdeposid").val(),
			districtid:$("#districtname_select").val(),
			planId : $('#planId').val()
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
		caption: "应急资源列表",
		//autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900"});
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width() - 96 );
			}
		}
	});
/*搜索查询*/
$("#searchBtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetBtn").bind("click",function(){
	$("#searchForm").find("input,select").each(function(){
		$(this).val("");
	});
});

/*添加*/
$("#addBtn").on("click", function () {
    var emsdeposid=$("#emsdeposid").val();
    if(emsdeposid==""){
        emsdeposid = "null";
    }
	parent.openWin(BASE_URL+"/ems/emsresmaterial/add/"+emsdeposid,'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var emsmaterialid = rowdata.EMSMATERIALID;
	var emsdeposid=$("#emsdeposid").val();
	if(emsdeposid==""){
        emsdeposid = "null";
    }
	parent.openWin(BASE_URL+'/ems/emsresmaterial/edit/'+emsmaterialid+"/"+emsdeposid,'编辑','65%','75%');
});
/**
 *企业端 上报 
 */
$("#report").on("click",function(){
    var ids = getSingleIds();
    var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    var emsmaterialid = rowdata.EMSMATERIALID;
    var param = {emsmaterialid:emsmaterialid};
    //弹出提示框
    parent.confirm('确认上报吗?',function(){
        $.ajax({ 
            url: BASE_URL+"/ems/emsresmaterial/report",
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
/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var emsmaterialids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		emsmaterialids[i]= rowdatas.EMSMATERIALID;
	}
	var parmJson = emsmaterialids.toString();
	var param = {"ids":parmJson};
	del(param);
});



/**
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var materialIds = [];
	var rowData, materialId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		materialId = rowData.EMSMATERIALID;
		materialIds.push(materialId);
	}
	
	save(materialIds + '');
	
});
});
function editInfo(emsmaterialid) {
	var emsdeposid=$("#emsdeposid").val();
	if(emsdeposid==""){
        emsdeposid = "null";
    }
	parent.openWin(BASE_URL+'/ems/emsresmaterial/edit/'+emsmaterialid+"/"+emsdeposid,'编辑','65%','75%');
}
function delInfo(id) {
	var param = {"ids":id};
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
			unitname:$("#unitname").val(),
            materialname:$("#materialname").val(),
            equiptypemaxid:$("#equiptypemaxid").val(),
            equiptypeminid:$("#equiptypeminid").val(),
            emsdeposid:$("#emsdeposid").val(),
            districtid:$("#districtname_select").val(),
            planId : $('#planId').val()
		}
	}).trigger("reloadGrid");
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
	  		url: BASE_URL+"/ems/emsresmaterial/delete",
	  		type:'post',
	  		dataType:'json',
	  		data:param,
	  		success: function(json){
	  			if(json.success==true){
	  				parent.toast(json.msg);
	  				reloadGrid();//刷新列表
	  				try{
	  				    parent.getActiveIFrame().reloadGrid();
	  				}catch(e){
	  				    
	  				}
	  			}else{
	  				parent.toast(json.msg);
	  			}
	  		}
		 });
	});
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

/**保存*/
function save(materialIdsStr){

	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplamaterial/save',
		cache : false,
		dataType : 'json',
		data : {planId : $('#planId').val(), materialIds : materialIdsStr},
		global : false,
		success : function(json) {
			if(json.success == true){
				parent.toast(json.msg);//弹出提示信息
				var frameLen = parent.parent.frames.length;
				parent.parent.frames[frameLen - 1].frames["chemIframe"].reloadGrid();
				parent.closeWin();// 关闭弹出框
			}else{
				parent.toast(json.msg);
			}
		},
		error : function() {
			parent.toast("保存失败");
		}
	});
}

/**
 * 详细信息
 */
function display(emsmaterialid){
    var emsdeposid=$("#emsdeposid").val();
    if(emsdeposid==""){
        emsdeposid = "null";
    }
	parent.openWin(BASE_URL+"/ems/emsresmaterial/display/"+emsmaterialid+"/"+emsdeposid,'详细','65%','75%');
}