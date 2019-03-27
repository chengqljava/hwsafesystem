var districtcode="";//行政机构树id全局变量
$(document).ready(function() {
	var colname = ['主机id','主机编号','主机品牌','主机型号','主机名称','IP','端口号','所属企业','状态','备注']; 
	
	var colmodel = [
					{name:'PROBEHOSTID',index:'PROBEHOSTID',hidden:true},
					{name:'PROBEHOSTNUM',index:'PROBEHOSTNUM',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<a href='javascript:void(0)' onclick='display(\""+obj.PROBEHOSTID+"\")'>"+obj.PROBEHOSTNUM+"</a>";
						}
					},
					{name:'BRANDNAME',index:'BRANDNAME',align:'left'},
					{name:'BRANDTYPENUM',index:'BRANDTYPENUM',align:'left'},
					{name:'PROBEHOSTNAME',index:'PROBEHOSTNAME',align:'left'},
					{name:'IPADDR',index:'IPADDR',align:'left'},
					{name:'PORT',index:'PORT',align:'left'},
					{name:'ENTNAME',index:'ENTNAME',align:'left'},
					{name:'STATE',index:'STATE',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(obj.PROBESTATE == 2){
								return "<span style='color:red'>"+SelectOption.getVideostate(obj.STATE)+"</span>";
							}else{
								return "<span style='color:blue'>"+SelectOption.getVideostate(obj.STATE)+"</span>";
							}
						}
					},
					{name:'NOTES',index:'NOTES',align:'left'}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/macprobehost/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{},
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
		caption: "监测主机列表",
		autowidth: true
	});
});

/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode2,name,districtlevel){
	districtcode = districtcode2;
	reloadGrid(districtcode)
}

/*加载*/
function reloadGrid(districtcode){
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	})
	searchParamJson["districtcode"] = districtcode;
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid(districtcode);
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/monitor/macprobehost/add",'添加','65%','65%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var PROBEHOSTID = rowdata.PROBEHOSTID;
	parent.openWin(BASE_URL+'/monitor/macprobehost/edit/'+PROBEHOSTID,'编辑','65%','65%');
});

/*详细查询*/
function display(PROBEHOSTID){
	parent.openWin(BASE_URL+"/monitor/macprobehost/display/"+PROBEHOSTID,'详细','65%','65%');
}
/**
 * 选择一条视频主机
 */
$("#entbtn").on("click",function(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var paramsJson="[";
	paramsJson+="{'PROBEHOSTID':'"+rowdata.PROBEHOSTID+"',";
	paramsJson+="'MACPROBEHOSTNAME':'"+rowdata.PROBEHOSTNAME+"',";
	paramsJson+="}";
	paramsJson+="]";
	if($("#frameIndex").val() == undefined || $("#frameIndex").val()==""){
		parent.frames[1].selectProbeHost(paramsJson);
	}else{
		parent.frames["layui-layer-iframe"+$("#frameIndex").val()].selectProbeHost(paramsJson);
	}
	parent.closeWin('dialogModal');// 关闭弹出框// 关闭弹出框
});

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var PROBEHOSTIDs=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		PROBEHOSTIDs[i]= rowdatas.PROBEHOSTID;
	}
	var parmJson = PROBEHOSTIDs.toString();
	var param = {"ids":parmJson};
	del(param);
});

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
	  		url: BASE_URL+"/monitor/macprobehost/delete",
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
	})
}

/**
 * 选择一条监测主机
 */
$("#entbtn").on("click",function(){
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length !=1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var paramsJson="[";
	paramsJson+="{'PROBEHOSTID':'"+rowdata.PROBEHOSTID+"',";
	paramsJson+="'MACPROBEHOSTNAME':'"+rowdata.PROBEHOSTNAME+"',";
	paramsJson+="}";
	paramsJson+="]";
	if($("#frameIndex").val() == undefined || $("#frameIndex").val()==""){
		parent.frames[1].selectProbeHost(paramsJson);
	}else{
		parent.frames["layui-layer-iframe"+$("#frameIndex").val()].selectProbeHost(paramsJson);
	}
	parent.closeWin('dialogModal');// 关闭弹出框// 关闭弹出框
});
