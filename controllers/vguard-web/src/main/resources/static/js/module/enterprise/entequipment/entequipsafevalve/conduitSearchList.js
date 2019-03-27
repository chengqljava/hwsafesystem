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
	
	var colname = ['管道id','设备名称','型号规格','设备品种','材质','使用压力（Mpa）','设计温度（℃）','工作介质','使用地点']; 
	var colmodel = [
		{name:'conduitid',index:'conduitid', width:'5%',hidden: true},
		{name:'devicename',index:'devicename',width:'10%',align:'left'},
		{name:'specmodel',index:'specmodel',width:'10%',align:'left'},
		{name:'devicevariety',index:'devicevariety',width:'8%',align:'left'},
		{name:'material',index:'material',width:'8%',align:'left'},
		{name:'workingpressure',index:'workingpressure',width:'12%',align:'left'},
		{name:'designtemp',index:'designtemp',width:'10%',align:'left'},
		{name:'workingmedium',index:'workingmedium',width:'18%',align:'left'},
		{name:'instalposition',index:'instalposition',width:'15%',align:'left'},
	];


	var tableHeight = $(window).height() - $('.pcheck').height() - 190;
	$(window).resize(function(){
		$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 190 );
		$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
	});

    $("#grid-table").jqGrid({
    	height: tableHeight,
    	url : BASE_URL + "/enterprise/entequipconduit/list",
		datatype: "json",
		cache : false,
		mtype : 'post',
		colNames:colname,
		colModel:colmodel,
		postData:{
			entid:$("#entid").val()
//			entid:"C4CC8D76C94A43ACA451450FA967FEAB"
		},
		sortname : 'DEVICENAME',
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
		caption: "压力管道列表",
		autowidth: true,
		loadComplete: function() {
			if($(window).width() < 700) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#grid-table").css({"width":"900" });
				$("#grid-table").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#grid-table").jqGrid( 'setGridWidth', $(window).width()*0.99 );
			}
		}
	});
    
});

/**
 * 选择管道
 */
$("#selEntBtn").on("click",function() {
	console.log("123");
			// 返回当前grid中复选框所选择的数据的id
			var prodSelRowArr = $("#grid-table").jqGrid('getGridParam','selarrrow');
			if(prodSelRowArr.length !=1){
	    		// 弹出提示信息
	    		parent.parent.toast("请选择一条记录！");
	    		return;
	    	}
//			if (isSingle) {
//				if (1 != prodSelRowArr.length) {
//					// 弹出提示信息
//					parent.toast("请选择一个管道！");
//					return;
//				}
				var prodRowDataObj = $("#grid-table").jqGrid("getRowData",
						prodSelRowArr[0]);
				// 给父窗口中产品赋值方法
				var index = parent.getParentIndex();
				parent.frames["layui-layer-iframe" + index].setEntInfo({
					"conduitid" : prodRowDataObj.conduitid,
					"devicename" : prodRowDataObj.devicename
				});
				parent.parent.closeWin();
//			} 
//			else {
//
//				var selIds = new Array();
//				var selNames = new Array();
//				$.each(prodSelRowArr, function(index, item) {
//					var prodRowDataObj = $("#grid-table").jqGrid("getRowData",
//							prodSelRowArr[index]);
//					selIds.push(prodRowDataObj.prodid);
//					selNames.push(prodRowDataObj.prodnane);
//					console.log(prodRowDataObj);
//				});
//				// 给父窗口中产品赋值方法
//				var index = parent.getParentIndex();
//				parent.frames["layui-layer-iframe" + index].setEntInfo({
//					"prodEntIds" : selIds.join(),
//					"prodEntNames" : selNames.join()
//				});
//				parent.closeWin();
//			}
		});





 

