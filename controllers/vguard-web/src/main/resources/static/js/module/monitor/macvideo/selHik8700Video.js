$(function() {
	//加载海康8700平台视频点位信息
	$.ajax({ 
  		url: BASE_URL + "/monitor/macvideo/loadHik8700VideoList",
  		type: "post",
  		data: {},
  		success: function(data){
  			if (data.macHikVideos && 0 < data.macHikVideos.length) {
  				$("#macHikVideos").val(JSON.stringify(data.macHikVideos));
  				
  				//加载87平台所有视频点位列表
  				var colname = ["点位ID", "点位名", "所属区域ID"]; 
  				var colmodel = [
  								{name:'videoId',index:'videoId',hidden:true},
  								{name:'videoName',index:'videoName',align:'left'
//  									,formatter:function(cellvalue, options, obj) { 
//  										return "<a href='javascript:void(0)' onclick='display(\""+obj.VIDEOHOSTID+"\")'>"+obj.VIDEOHOSTNUM+"</a>";
//  									}
  								},
  								{name:'videoReg',index:'videoReg',align:'left',hidden:true
//  									,formatter:function(cellvalue, options, obj) { 
//  										return "<a href='javascript:void(0)' onclick='display(\""+obj.VIDEOHOSTID+"\")'>"+obj.VIDEOHOSTNUM+"</a>";
//  									}
  								}
//  								{name:'ISGOV',index:'ISGOV',align:'left',
//  									formatter:function(cellvalue, options, obj) { 
//  										if ("0" == obj.ISGOV){
//  											return "企业";
//  										} else if ("1" == obj.ISGOV) {
//  											return "政府";
//  										} else {
//  											return "-";
//  										}
//  									}
//  								},
  								];
  				
  				var tableHeight = $(window).height() - $('.pcheck').height() - 190 -33;
  				$(window).resize(function() {
  					$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 -33 );
  					$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
  				});
  				
  			    $("#grid-table").jqGrid({
  			    	datatype: "local",
//  			    	url : BASE_URL + "/monitor/macvideohost/list",
  					colNames: colname,
  					colModel: colmodel,
  					height: tableHeight,
  					viewrecords: true,
  					rowNum: 10,
  					rowList: [10,20,30],
  					altRows: true,
  					multiselect: true,
  					caption: "海康8700平台视频列表",
  					pager: "#grid-pager",
  					autowidth: true
  				});
  			    
  			    //加载表格数据
  			    reloadGrid(data.macHikVideos, null);
  			    
  			    //加载视频点位区域选择框数据
  			    if (data.macHikVideoRegs && 0 < data.macHikVideoRegs.length) {
  			    	var selVideoRegOpt = "";
  			    	_.map(data.macHikVideoRegs, function(tmpVideoReg, index) {
  			    		if (0 == index) {
  			    			selVideoRegOpt += "<option value=''>所有区域</option>";
  			    		} else {
  			    			selVideoRegOpt += "<option value='" + tmpVideoReg.regId + "'>" + tmpVideoReg.regName + "</option>";
  			    		}
  			    	});
  			    	
  			    	$("#selVideoReg").empty().html(selVideoRegOpt);
  			    	$("#selVideoReg").change(function() {
  			    		var curVideoReg = $(this).val(),
  			    			macHikVideoRegs = JSON.parse($("#macHikVideos").val());
  			    		if ("" == curVideoReg) {
  			    			reloadGrid(macHikVideoRegs, null);
  			    		} else {
  			    			reloadGrid(macHikVideoRegs, curVideoReg);
  			    		}
  			    	});
  			    }
  			}
  		},
  		error: function() {
  			parent.toast("系统繁忙，请稍后再试!")
  		}
	 });
});

/*加载*/
function reloadGrid(macHikVideos, videoReg){
	var tgt = null != videoReg ? 
			  _.where(macHikVideos, {"videoReg": videoReg}) : macHikVideos;
	console.log(tgt);
	$("#grid-table").clearGridData(false).jqGrid("setGridParam", {
		data: tgt
	}).trigger("reloadGrid");
}

/*选择某一个视频点位*/
$("#chosnVideoBtn").off("click").on("click", function() {
	var curSelIds = $("#grid-table").jqGrid("getGridParam", "selarrrow");
	if(curSelIds.length != 1){
		// 弹出提示信息
		parent.toast("请选择一条记录！");
		return;
	}
	
	var curSelRowdata = $("#grid-table").jqGrid("getRowData", curSelIds[0]);
	window.top.GEventObject.fireEvent("LOAD_MONITOR_HIK8700VIDEO_EVENT", {
		"videoId": curSelRowdata.videoId,
		"videoName": curSelRowdata.videoName 
	});
	parent.closeWin();
});