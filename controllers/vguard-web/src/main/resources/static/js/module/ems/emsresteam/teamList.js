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
		$('#btnli').css({"display":"none"});
		$("#btnli").empty();
		$('#btnli').remove();
	}
	
	var colname = ['主键id','队伍编号', '队伍名称', '填报单位', '总人数', '主要负责人', '应急值班电话', '填报状态','地理定位']; 
	
	var colmodel = [
					{name: 'TEAMID',index: 'TEAMID', width: '5%', hidden: true},
					{name: 'TEAMNUM',index: 'TEAMNUM', width: '5%'},
					{name: 'TEAMNAME',index: 'TEAMNAME', formatter : function(cellvalue, options, obj) {
						return "<a href = 'javascript:void(0)' onclick='display(\""+obj.TEAMID+"\")'>"+obj.TEAMNAME+"</a>";
					}, width: '5%'},
					{name: 'UNITNAME',index: 'UNITNAME', width: '5%',hidden: true},
					{name: 'TOTALNUM',index: 'TOTALNUM', width: '5%'},
					{name: 'RESPONSEPER',index: 'RESPONSEPER', width: '5%'},
					{name: 'DUTYTEL',index: 'DUTYTEL', width: '5%'},
					{name: 'FILLSTATE', index: 'FILLSTATE', hidden: true,formatter : function(cellvalue, options, obj) {
						return SelectOption.getEmsState(obj.FILLSTATE);
					}, width: '5%'},
					{name: 'getPosition',index: 'getPosition', formatter:function(cellvalue, options, obj) { 
                        if(obj.LONGITUDE!="" && obj.LATITUDE!=""){
                            return '<a href="javascript:void(0);" onclick="loactionGIS(\''+obj.LONGITUDE+'\',\''+obj.LATITUDE+'\')">已定位</a>';
                        }else{
                            return '未定位';
                        }
                    }, width: '5%'}
			];
	
	var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};	

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/ems/emsresteam/teamList",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData : searchParam,
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
		caption: "应急队伍列表",
		autowidth: true,
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
				$(".table-line .tableTitle").find("button").css({"margin-right":"0px","margin-top":"7px"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});



/*添加*/
$("#addBtn").on("click", function () {
	parent.openWin(BASE_URL+"/ems/emsresteam/add",'添加','65%','75%');
});

/*编辑*/
$("#editBtn").on("click", function () {
	var ids = getSingleIds();
	var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
	var teamid = rowdata.TEAMID;
	parent.openWin(BASE_URL+'/ems/emsresteam/edit/'+ teamid,'编辑','65%','75%');
});




/*批量删除*/
$("#delBtn").on("click", function () {
	//返回当前grid中复选框所选择的数据的id 
	var ids = getManyIds("请选择需要删除的数据!");
	var teamids=[];
	var state = "";
	for(var i=0;i<ids.length;i++){
		var id = ids[i]; 
		//返回指定id行的数据 
		var rowdatas = $("#grid-table").jqGrid('getRowData',id);
		teamids[i]= rowdatas.TEAMID;
	}
	var parmJson = teamids.toString();
	var param = {"ids":parmJson};
	del(param);
});

/*企业上报*/
$("#report").on("click", function () {
	var ids = getSingleIds();
    var rowdata = $("#grid-table").jqGrid('getRowData',ids[0]); //选中的一条记录
    var teamId = rowdata.TEAMID;
    //弹出提示框
    parent.confirm('确认上报吗?',function(){
        $.ajax({ 
            url : BASE_URL + "/ems/emsresteam/report/" + teamId,
            type :'post',
            dataType : 'json',
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



/**
 * 选择一条记录
 */
$("#submitbtn").on("click",function(){
	
	var teamIds = [];
	var rowData, teamId;
	
	var ids = $("#grid-table").jqGrid('getGridParam','selarrrow');
	if(ids.length < 1){
		// 弹出提示信息
		parent.toast("请选择至少一条记录！");
		return;
	}
	
	for(var i = 0; i < ids.length; i++){
		rowData = $("#grid-table").jqGrid('getRowData', ids[i]); //选中的一条记录
		teamId = rowData.TEAMID;
		teamIds.push(teamId);
	}
	
	save(teamIds + '');
	
});

});


/*加载*/
function reloadGrid(){
	
	var searchParamJson = {};
	
	$.each($("#searchForm").serializeArray(), function(){
		searchParamJson[this.name] = this.value;
	});
	
	var searchParam = {"searchParamJson" : JSON.stringify(searchParamJson)};
	
	$("#grid-table").jqGrid('setGridParam',{
		page : 1,
		postData : searchParam
	}).trigger("reloadGrid");
}

/**
 * 查询危险化学品列表
 * @param teamid
 */
function display_chem(teamid){
	parent.openWin(BASE_URL+"/ems/emsresteam/chemicalList/"+teamid,'详细','80%','60%');
}

/*加载行政区域*/
function searchDistrict(districtid){
	$('#districtid').val(districtid);
	reloadGrid();
}


/**保存*/
function save(teamIdsStr){

	$.ajax({
		type : 'post',
		url : BASE_URL+'/ems/emsplateam/save',
		cache : false,
		dataType : 'json',
		data : {planId : $('#planId').val(), teamIds : teamIdsStr},
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
	  		url: BASE_URL+"/ems/emsresteam/delete",
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
 *在GIS上定位 
 *longitude:经度
 *latitude:维度 
 */
function loactionGIS(longitude, latitude){
	parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=1", "地理定位", "90%", "90%", false);
//    parent.openWin(BASE_URL+"/olgis/gisOperBuss/viewposition?longitude="+longitude+"&latitude="+latitude,'地理定位','90%','90%',false);
}
/*详细查询*/
function display(teamid){
	parent.openWin(BASE_URL+"/ems/emsresteam/display/"+teamid,'详细','65%','75%');
}
