/**
 * 隐患台账统计首页js
 */
$(function(){
	
	
	//初始化年份
	var currYear = new Date().getFullYear();
	var html= "年份：<span>"+(currYear-4)+"</span>"+
	"<span>"+(currYear-3)+"</span>"+
	"<span>"+(currYear-2)+"</span>"+
	"<span>"+(currYear-1)+"</span>"+
	"<span class='active'>"+currYear+"</span>";
	$(".years").html(html);
	//初始化时间
	changQarter();
	getCountData();
	tabData();
    $('.years').on('click','span',function(){
        $('.years span').removeClass('active');
        $(this).addClass('active');
        setTimeByQarter($(this).text(),$(".months span.active").text());
        if($(this).index() == 0){
 		   var year = parseInt($(this).text());
 		   var html= "年份：<span>"+(year-2)+"</span>"+
 			"<span>"+(year-1)+"</span>"+
 			"<span class='active'>"+year+"</span>"+
 			"<span>"+(year+1)+"</span>"+
 			"<span>"+(year+2)+"</span>";
 		   $(".years").html(html);
 		}else if($(this).index() ==4){
 			var year = parseInt($(this).text());
 			var curYear = new Date().getFullYear();
 			if(year != curYear){
 				var html= "年份：<span>"+(year-2)+"</span>"+
 	 			"<span>"+(year-1)+"</span>"+
 	 			"<span class='active'>"+year+"</span>"+
 	 			"<span>"+(year+1)+"</span>"+
 	 			"<span>"+(year+2)+"</span>";
 				$(".years").html(html);
 			}
 		}
        getCountData();
        reloadGrid();
    });
    
    $('.months').on('click','span',function(){
        $('.months span').removeClass('active');
        $(this).addClass('active');
        setTimeByQarter($(".years span.active").text(),$(this).text());
        getCountData();
        reloadGrid();
    });
    
    //导出
    $("#exportExcel").off("click").on("click",function(){
    	window.location.href = BASE_URL+"/hidden/hidcount/loadHidDangerForEntCountExport?stime="+$("#stime").val()+"&etime="+$("#etime").val();
    });
});

/**
 * 获取监管企业列表
 */
function getEntList(){
	var etime = $("#etime").val();
	var stime = $("#stime").val();
	parent.openWin(BASE_URL+"/hidden/hidcount/hidDispalyentlist?etime="+etime+"&stime="+stime,'监管企业','80%','70%');
}

/**
 * 获取隐患信息
 */
function getHidCount(entid,hiddendangertype,hiddendangerstate){
	
	var etime = $("#etime").val();
	var stime = $("#stime").val();
	parent.openWin(BASE_URL+"/views/module/hidden/hidcount/HiddendangerCountList.html?etime="+etime+"&stime="+stime+"&entid="+entid+"&hiddendangerstate="+hiddendangerstate+"&hiddendangertype="+hiddendangertype,'隐患信息列表','60%','60%');
}


/**
 * 设置默认时间
 */
function changQarter(){
	var curMonth = new Date().getMonth()+1;
	var curQarter = getQarter2Month(curMonth);
	switch(curQarter){
	case 1:
		$("#one").addClass("active");
		break;
	case 2:
		$("#two").addClass("active");
		break;
	case 3:
		$("#three").addClass("active");
		break;
	case 4:
		$("#four").addClass("active");
		break;
	}
	setTimeByQarter($(".years span.active").text(),$(".months span.active").text());
}
/**
 * 获取当前季度
 * @param month
 * @returns {Number}
 */
function getQarter2Month(month){
	if(1<=month && month<=3){
		return 1;
	}else if(4<=month && month<=6){
		return 2;
	}else if(7<=month && month<=9){
		return 3;
	}else{
		return 4;
	}
}

/**
 * 设置时间
 * @param year
 * @param qarter
 */
function setTimeByQarter(year,qarter){
	if(qarter == 1){
		$("#stime").val(year+"-01-01");
		$("#etime").val(year+"-03-31");
	}else if(qarter == 2){
		$("#stime").val(year+"-04-01");
		$("#etime").val(year+"-06-30");
	}else if(qarter == 3){
		$("#stime").val(year+"-07-01");
		$("#etime").val(year+"-09-30");
	}else if(qarter == 4){
		$("#stime").val(year+"-10-01");
		$("#etime").val(year+"-12-31");
	}
}

function getCountData(){
	$.ajax({
		type : 'post',
		url : BASE_URL+'/hidden/hidcount/dangerCountInfo',
		cache : false,
		data: {
			stime:$("#stime").val(),
			etime:$("#etime").val(),
			entname:""
		},
		dataType : 'json',
		global : false,
		success : function(map) {  
			$("#entCount").html(map.entCount == null ? 0:map.entCount);//企业数
			$("#dangerCount").html(map.DANGERCOUNT == null? 0 :map.DANGERCOUNT);//企业隐患数
			$("#overreformCount").html(map.OVERREFORM == null ? 0 :map.OVERREFORM);//已整改隐患数
			$("#notreformCount").html(map.NOTREFORM == null ? 0 :map.NOTREFORM);//未整改隐患数
		},
		error: function () {
            parent.toast("初始化信息加载失败!");
        }
	});
}

/**
 * 表格数据
 */
function tabData(){
	 var colNames=['企业id', '企业名称', '隐患数', '已整改', '未整改',
	                '隐患数', '已整改', '未整改','隐患数', '已整改', '未整改','整改率','所属行业'],
     colModel=[
           {name: 'BUSINESSINFOID', index: 'BUSINESSINFOID', align: 'left',hidden: true},
           {name: 'ENTNAME', index: 'ENTNAME', width: '22%',sortable: false,align: 'left' },
           {name: 'LOCALREFORM', index: 'LOCALREFORM', width: '7%', align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"2"+'\',\''+""+'\')">'+obj.LOCALREFORM+'</a>';
        	   }
           },
           {name: 'LOCALOVERREFORM', index: 'LOCALOVERREFORM',width: '7%', align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"2"+'\',\''+"6"+'\')">'+obj.LOCALOVERREFORM+'</a>';
        	   }
           },
           {name: 'LOCALNOTREFORM', index: 'LOCALNOTREFORM', width: '7%', align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"2"+'\',\''+"3"+'\')">'+obj.LOCALNOTREFORM+'</a>';
        	   }
           },
           {name: 'SAFEREFORM', index: 'SAFEREFORM', width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"1"+'\',\''+""+'\')">'+obj.SAFEREFORM+'</a>';
        	   }
           },
           {name: 'SAFEOVERREFORM', index: 'SAFEOVERREFORM', width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"1"+'\',\''+"6"+'\')">'+obj.SAFEOVERREFORM+'</a>';
        	   }
           },
           {name: 'SAFENOTREFORM', index: 'SAFENOTREFORM', width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+"1"+'\',\''+"3"+'\')">'+obj.SAFENOTREFORM+'</a>';
        	   }
           },
           {name: 'SUMCOUNT', index: 'SUMCOUNT',width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+""+'\',\''+""+'\')">'+obj.SUMCOUNT+'</a>';
        	   }
           },
           {name: 'OVERSUMCOUNT', index: 'OVERSUMCOUNT', width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+""+'\',\''+"6"+'\')">'+obj.OVERSUMCOUNT+'</a>';
        	   }
           },
           {name: 'NOTSUMCOUNT', index: 'NOTSUMCOUNT', width: '7%',align: 'center',
        	   formatter:function(cellvalue, options, obj) { 
				   return '<a href="javascript:void(0);" onclick="getHidCount(\''+obj.BUSINESSINFOID+'\',\''+""+'\',\''+"3"+'\')">'+obj.NOTSUMCOUNT+'</a>';
        	   }
           },
           {name: 'AVGMOUNT', index: 'AVGMOUNT',width: '7%', align: 'center'},
           {name: 'TYPENAME', index: 'TYPENAME', width: '13%', sortable: false,align: 'left'},
      ];
	
	 var tableHeight = $(window).height() - $('.pcheck').height() - 375;
		$(window).resize(function(){
			$("#grid-table").jqGrid( 'setGridHeight', $(window).height() - $('.pcheck').height() - 375 );
			$("#grid-table").jqGrid( 'setGridWidth', $(window).width() -60 );
		});
	 $("#grid-table").jqGrid({
		  height: tableHeight,
		  url: BASE_URL + "hidden/hidcount/loadHidDangerForEntCount",
		  datatype: "json",
		  cache: false,
		  mtype: "POST",
		  colNames: colNames,
		  colModel: colModel,
		  postData: {
			  stime:$("#stime").val(),
			  etime:$("#etime").val()
		  },
		  sortname: "AVGMOUNT",
		  sortorder: "desc",
		  viewrecords: true,
		  pager: "#grid-pager",
		  jsonReader: {
		      root: "datas",
		      total: "total",
		      page: "page",
		      records: "records",
		      repeatitems: false
		  },
		  rowNum: 10,
		  rowList: [10, 20, 30],
		  altRows: true,
		  autowidth: true
	    });
	 $("#grid-table" ).jqGrid( 'setGroupHeaders' , {
			useColSpanStyle : true , // 没有表头的列是否与表头列位置的空单元格合并
			groupHeaders : [
			    {startColumnName: 'LOCALREFORM', numberOfColumns: 3, titleText: '<font color="#015293">现场问题</font>'},
			    {startColumnName: 'SAFEREFORM', numberOfColumns: 3, titleText: '<font color="#015293">安全管理资料问题</font>'},
			    {startColumnName: 'SUMCOUNT', numberOfColumns: 3, titleText: '<font color="#015293">合计</font>'}
			]
	});
}


function reloadGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	stime:$("#stime").val(),
			etime:$("#etime").val()
        }
    }).trigger("reloadGrid");
}