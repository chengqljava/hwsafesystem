$(function() {
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
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['主键ID','主机id','企业名称','主机名称','摄像头名称','通道','品牌','型号','分组','状态 ','视频', '所属海康平台号', '经度', '维度', 'IP地址', '怀业播放端口', '(怀业)设备所属域编号', '(怀业)设备编码', '(怀业)通道编码', '(怀业)码流编码']; 
	var colmodel = [
					{name:'VIDEOID',index:'VIDEOID',hidden:true},
					{name:'VIDEOHOSTID',index:'VIDEOHOSTID',align:'left',hidden:true},
					{name:'ENTNAME',index:'ENTNAME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(cellvalue && "" != cellvalue){
								return cellvalue;
							}else{
								return "-";
							}
						}
					},
					{name:'VIDEOHOSTNAME',index:'VIDEOHOSTNAME',align:'left'},
					{name:'VIDEONAME',index:'VIDEONAME',align:'left',
						formatter:function(cellvalue, options, obj) { 
							return "<a href='javascript:void(0)' onclick='display(\""+obj.VIDEOID+"\")'>"+obj.VIDEONAME+"</a>";
						}
					},
					{name:'VIDEONUM',index:'VIDEONUM',align:'left'},
					{name:'BRANDNAME',index:'BRANDNAME',align:'left'},
					{name:'BRANDTYPENUM',index:'BRANDTYPENUM',align:'left'},
					{name:'VIDEOGROUP',index:'VIDEOGROUP',align:'left'},
					{name:'STATE',index:'STATE',align:'left',
						formatter:function(cellvalue, options, obj) { 
							if(obj.STATE == 2){
								return "<span style='color:red'>"+SelectOption.getVideostate(obj.STATE)+"</span>";
							}else{
								return "<span style='color:blue'>"+SelectOption.getVideostate(obj.STATE)+"</span>";
							}
						}
					},
					//function showVideo(ip,port,username,password,channel,brand){
					{name:'showVideo',index:'showVideo',align:'left',
						formatter:function(cellvalue, options, obj) {  
							if(obj.VIDEONUM)
								return '<a href="javascript:void(0);" style="color:blue" onclick="showVideo(\''+obj.VIDEOID+'\',\''+obj.HIKPLATNUM+'\',\''+obj.IPADDR+'\',\''+obj.HYPLAYPORT+'\',\''+obj.STRDOMAINCODE+'\',\''+obj.STRDEVICECODE+'\',\''+obj.STRCHANNELCODE+'\',\''+obj.STRSTREAMCODE+'\')">视频</a>';
							else 
								return '-';
						}
					},
					{name:'HIKPLATNUM',index:'HIKPLATNUM',hidden:true},
					{name:'LONGITUDE',index:'LONGITUDE'},
					{name:'LATITUDE',index:'LATITUDE'},
					{name:'IPADDR',index:'IPADDR',hidden:true},
					{name:'HYPLAYPORT',index:'HYPLAYPORT',hidden:true},
					{name:'STRDOMAINCODE',index:'STRDOMAINCODE',hidden:true},
					{name:'STRDEVICECODE',index:'STRDEVICECODE',hidden:true},
					{name:'STRCHANNELCODE',index:'STRCHANNELCODE',hidden:true},
					{name:'STRSTREAMCODE',index:'STRSTREAMCODE',hidden:true}
				];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function() {
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/monitor/macvideo/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			videonum:$("#videonum").val(),
			videoname:$("#videoname").val(),
			videogroup:$("#videogroup").val(),
			entname:$("#entname").val(),
			hostname:$("#hostname").val()
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
		caption: "摄像头管理列表",
		autowidth: true
	});
});

/*加载*/
function reloadGrid(districtcode){
	$("#grid-table").jqGrid('setGridParam',{
		page:1,postData:{
			videonum:$("#videonum").val(),
			videoname:$("#videoname").val(),
			videogroup:$("#videogroup").val(),
			entname:$("#entname").val(),
			hostname:$("#hostname").val(),
			districtcode:districtcode
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
	parent.openWin(BASE_URL+"/monitor/macvideo/add",'添加','65%','50%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var VIDEOID = rowdata.VIDEOID;
	parent.openWin(BASE_URL+'/monitor/macvideo/edit/'+VIDEOID,'编辑','65%','50%');
});

/*详细查询*/
function display(VIDEOID){
	parent.openWin(BASE_URL+"/monitor/macvideo/display/"+VIDEOID,'详细','65%','50%');
}

/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var dangerids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		dangerids[i]= rowdatas.VIDEOID;
	}
	var parmJson = dangerids.toString();
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
	  		url: BASE_URL+"/monitor/macvideo/delete",
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
 * 查看视频
 * @param videoid
 */
function showVideo(videoid, hikplatnum, ipaddr, hyplayport, strdomaincode, strdevicecode, strchannelcode, strstreamcode){
	parent.openWin(BASE_URL+"/monitor/macvideo/displayVideo/"+ videoid + "/" + hikplatnum +
			       "?ipaddr=" + ipaddr + "&hyplayport=" + hyplayport + "&strdomaincode=" + strdomaincode +
			       "&strdevicecode=" + strdevicecode + "&strchannelcode=" + strchannelcode + "&strstreamcode=" + strstreamcode,
			       '视频','65%','65%');
}


