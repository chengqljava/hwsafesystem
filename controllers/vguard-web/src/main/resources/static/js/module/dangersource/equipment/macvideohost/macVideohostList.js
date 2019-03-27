$(document).ready(function() {
	var colname = ['主机id','主机编号','主机品牌','主机型号','主机名称','用户名','密码','IP','端口号',/*'所属企业',*/'状态','备注']; 
	initSeachInput();
	var colmodel = [
					{name:'VIDEOHOSTID',index:'VIDEOHOSTID',hidden:true},
					{name:'VIDEOHOSTNUM',index:'VIDEOHOSTNUM',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<a href='javascript:void(0)' onclick='display(\""+obj.VIDEOHOSTID+"\")'>"+obj.VIDEOHOSTNUM+"</a>";
						}
					},
					{name:'BRANDNAME',index:'BRANDNAME',align:'left'},
					{name:'BRANDTYPENUM',index:'BRANDTYPENUM',align:'left'},
					{name:'VIDEOHOSTNAME',index:'VIDEOHOSTNAME',align:'left'},
					{name:'USERNAME',index:'USERNAME',align:'left'},
					{name:'PASSWORD',index:'PASSWORD',align:'left'},
					{name:'IPADDR',index:'IPADDR',align:'left'},
					{name:'PORT',index:'PORT',align:'left'},
					/*{name:'ENTNAME',index:'ENTNAME',align:'left'},*/
					{name:'STATE',index:'STATE',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(obj.STATE == 2){
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
    	url : BASE_URL + "/monitor/macvideohost/loadList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			brandtypenum:$("#brandtypenum").val(),//主机型号
			entname:$("#entname").val(),//企业名称
			hostnum:$("#hostnum").val(),//主机编号
			hostname:$("#hostname").val()//主机名称
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
		caption: "视频主机管理列表",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(districtcode){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			brandtypenum:$("#brandtypenum").val(),//主机型号
			entname:$("#entname").val(),//企业名称
			hostnum:$("#hostnum").val(),//主机编号
			hostname:$("#hostname").val(),//主机名称
			districtcode:districtcode//左侧机构树
		}
	}).trigger("reloadGrid");
}

/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode,name,districtlevel){
	reloadGrid(districtcode)
}

/*搜索查询*/
$("#searchbtn").bind("click",function(){
	reloadGrid();
});

/*重置*/
$("#resetbtn").bind("click",function(){
	$("#searchForm").each(function(){
		$(this).val("");
	})
});

/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/monitor/macvideohost/add/ENT",'添加','70%','70%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var VIDEOHOSTID = rowdata.VIDEOHOSTID;
	parent.openWin(BASE_URL+'/monitor/macvideohost/edit/ENT/'+VIDEOHOSTID,'编辑','70%','70%');
});

/*详细查询*/
function display(VIDEOHOSTID){
	parent.openWin(BASE_URL+"/monitor/macvideohost/display/ENT/"+VIDEOHOSTID,'详细','70%','70%');
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
	paramsJson+="{'VIDEOHOSTID':'"+rowdata.VIDEOHOSTID+"',";
	paramsJson+="'MACVIDEOHOSTNAME':'"+rowdata.VIDEOHOSTNAME+"',";
	paramsJson+="}";
	paramsJson+="]";
	if($("#frameIndex").val() == undefined || $("#frameIndex").val()==""){
		parent.frames[1].selectVideoHost(paramsJson);
	}else{
		parent.frames["layui-layer-iframe"+$("#frameIndex").val()].selectVideoHost(paramsJson);
	}
	parent.closeWin('dialogModal');// 关闭弹出框// 关闭弹出框
});

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var VIDEOHOSTIDs=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		VIDEOHOSTIDs[i]= rowdatas.VIDEOHOSTID;
	}
	var parmJson = VIDEOHOSTIDs.toString();
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
	$.ajax({ 
  		url: BASE_URL+"/monitor/macvideo/haveMacVideo",
  		type:'post',
  		dataType:'json',
  		data:param,
  		success: function(json){
  			if(json.success==true){
  				parent.confirm('确认删除吗?',function(){ //弹出提示框
	  				$.ajax({ 
	  			  		url: BASE_URL+"/monitor/macvideohost/delete",
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
	  			  		},
	  			  		error:function(){
	  			  			parent.toast("网络异常")
	  			  		}
	  				 });
  				});
  			}else{
  				parent.toast(json.msg);
  			}
  		},
  		error:function(){
  			parent.toast("网络异常")
  		}
	 });
}
