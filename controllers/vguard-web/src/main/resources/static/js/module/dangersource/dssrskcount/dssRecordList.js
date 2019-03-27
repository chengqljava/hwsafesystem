/**
 * 政府端-风险评级台账
 */
$(function(){

	changQarter();
//	loadDssList();
	loadDssEntList();
	var currYear = new Date().getFullYear();
	var html= "<li>"+(currYear-4)+"</li>"+
	"<li>"+(currYear-3)+"</li>"+
	"<li>"+(currYear-2)+"</li>"+
	 "<li>"+(currYear-1)+"</li>"+
	 "<li class='active'>"+currYear+"</li>";
	$(".year").html(html);
	
	$(".year").on("click","li",function(){
		$(this).addClass('active').siblings().removeClass('active');
		setTimeByQarter($(this).text(),$("#qarter").val());
		onclick();
		if($(this).index() == 0){
		   var year = parseInt($(this).text());
		   var html= "<li>"+(year-2)+"</li>"+
			    	 "<li>"+(year-1)+"</li>"+
			    	 "<li class='active'>"+year+"</li>"+
			    	 "<li>"+(year+1)+"</li>"+
			    	 "<li>"+(year+2)+"</li>";
		   $(".year").html(html);
		}else if($(this).index() == 4){
			var year = parseInt($(this).text());
			var curYear = new Date().getFullYear();
			if(year != curYear){
				var html= "<li>"+(year-2)+"</li>"+
					      "<li>"+(year-1)+"</li>"+
					      "<li class='active'>"+year+"</li>"+
					      "<li>"+(year+1)+"</li>"+
					      "<li>"+(year+2)+"</li>";
				$(".year").html(html);
			}
		}
	});
	
	$(".quarter").find("li").each(function(){
		$(this).bind("click",function(){
			$(this).addClass('active').siblings().removeClass('active');
			var year = $("#stime").val().substring(0,4);
			$("#qarter").val($(this).text());
			setTimeByQarter(year,$(this).text());
			onclick();
		});
	});

	$(".checkstate").find("li").each(function(){
		$(this).bind("click",function(){
			$(this).addClass('active').siblings().removeClass('active');
			$("#evaluationmethod").val($(this).data('id'));
			onclick();
		});
	});
	
    $('.factoryListContent ul').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: true,
        autohidemode: false
    }).show().resize();
    $('.factoryListContent ul').on('click','li',function(){
        $('.factoryListContent ul li').removeClass('active');
        $(this).addClass('active');
        var entid = $('.active input').val();
        var entname = $('.factoryListContent ul .active').text();
        var evaluationmethod = $("#evaluationmethod").val();
        var titlename;
        if(evaluationmethod == "lec"){
        	titlename = "LEC评级台账";
        } else {
        	titlename = "MES评级台账";
        }
        $('#dangerTitle').html(entname + titlename);
        $("#entid").val(entid);
        reloadGrid(entid);
    })
    
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
    	loadDssEntList();
    });
    /*重置*/
    $("#resetbtn").bind("click", function () {
    	$("#name").val("");
    });
})

function onclick(){
	loadDssEntList();
}

/**
 * 季度切换
 */
function changQarter(){
	var curYear = new Date().getFullYear();
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
	case 2:
		$("#four").addClass("active");
		break;
	}
	$("#"+curQarter).addClass("active");
	$("#qarter").val(curQarter);
	setTimeByQarter(curYear,curQarter)
}


/**
 * 根据季度设置时间
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

/**
 * 根据月份获取季度
 * @param month
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

//加载企业列表
function loadDssEntList(){ 
	var entname = $('#name').val();
	var stime = $('#stime').val();
	var etime = $('#etime').val();
	var evaluationmethod = $('#evaluationmethod').val();
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/loadallentlist",
        dataType: "json",
        data: {
        	entname: entname || '',
        	stime: stime || '',
        	etime: etime || '',
        	evaluationmethod: evaluationmethod || ''
        },
        async:false,
        success: function (data) {
        	$("#entList").empty();
        	$("#gridTable").empty();
        	$.each(data.entList,function(i,item){
        		var entid;
        		var entlist;
        		if(i == 0){    
        			entlist = '<li class="active">'+item.BUSINESSINFONAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
        			entid = item.BUSINESSINFOID;
        			$("#entid").val(entid);
        			$("#gridTable").append('<table id="grid-table"></table><div id="grid-pager"></div>');
        			var titlename;
        	        if(evaluationmethod == "lec"){
        	        	titlename = "LEC评级台账";
        	        } else {
        	        	titlename = "MES评级台账";
        	        }
        			$('#dangerTitle').html(item.BUSINESSINFONAME + titlename);
        			loadDssList(entid);
        		} else {
        			entlist = '<li>'+item.BUSINESSINFONAME+'<input type="hidden" name="entid" value="'+item.BUSINESSINFOID+'"/></li>'
        		}
                $("#entList").append(entlist);
            }) 
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

//加载表格数据
function loadDssList(entid){
	var stime = $('#stime').val();
	var etime = $('#etime').val();
	var evaluationmethod = $("#evaluationmethod").val();
	 //列表分页表格
    var colname = [
            "场所区域","重大风险", "较大风险","一般风险", "低风险","合计"],
        colmodel = [
            {
                name: "placeareaname",
                index: "placeareaname",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "zdfx",
                index: "zdfx",
                width: "20%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.zdfx == '0'){
                		return '0'
                	} else {                		
                		return '<a href="javascript:void(0);" onclick="displayDss(\'' + obj.placeareaname + '\',\'重大风险\')">' + obj.zdfx + '</a>';
                	}
                }
            },
            {
                name: "jdfx",
                index: "jdfx",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.jdfx == '0'){
                		return '0'
                	} else {  
                		return '<a href="javascript:void(0);" onclick="displayDss(\'' + obj.placeareaname + '\',\'较大风险\')">' + obj.jdfx + '</a>';
                	}
                }
            },
            {
                name: "ybfx",
                index: "ybfx",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.ybfx == '0'){
                		return '0'
                	} else {  
                		return '<a href="javascript:void(0);" onclick="displayDss(\'' + obj.placeareaname + '\',\'一般风险\')">' + obj.ybfx + '</a>';
                	}
                }
            },
            {
                name: "dfx",
                index: "dfx",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.dfx == '0'){
                		return '0'
                	} else {  
                		return '<a href="javascript:void(0);" onclick="displayDss(\'' + obj.placeareaname + '\',\'低风险\')">' + obj.dfx + '</a>';
                	}
                }
            },
            {
				name : "fshj",
                index: "fshj",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if(obj.fshj == '0'){
                		return '0'
                	} else {  
                		return '<a href="javascript:void(0);" onclick="displayDss(\'' + obj.placeareaname + '\')">' + obj.fshj + '</a>';
                	}
                }
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 280;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 280);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "dangersource/dssrskrecord/loadrskcount",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	stime: stime,
        	etime: etime,
        	evaluationmethod: evaluationmethod,//评价方法
        	businessinfoid: entid
        },
//        sortname: "CREATETIME",
//        sortorder: "desc",
        viewrecords: true,
//        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
//        rowNum: 10,
//        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true
    });
    $("#grid-table" ).jqGrid( 'setGroupHeaders' , {
		useColSpanStyle : true , // 没有表头的列是否与表头列位置的空单元格合并
		groupHeaders : [
		    {startColumnName: 'zdfx', numberOfColumns: 4, titleText: '<font color="#015293">风险数目</font>'}
		]
    });
}

/**
 * 排查项、隐患数、已整改数列表
 * @param checkrecordid
 * @param flag
 */
function displayDss(placeareaname,riskrating){
	var entid = $("#entid").val();
	var evaluationmethod = $("#evaluationmethod").val();
	var titlename = riskrating + "列表";
	if(riskrating == null){
		titlename = "风险合计";
		riskrating	= ""
	}
	parent.openWin(encodeURI(BASE_URL + "views/module/dangersource/dssrskcount/dssRskCountList.html?placeareaname=" + placeareaname
			+ "&businessinfoid=" + entid + "&riskrating=" + riskrating + "&evaluationmethod=" + evaluationmethod),
			titlename, "60%", "60%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid(entid) {
	var stime = $("#stime").val();
	var etime = $("#etime").val();
	var evaluationmethod = $("#evaluationmethod").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	businessinfoid: entid || '',
        	stime: stime ||"",
        	etime: etime ||"",
        	evaluationmethod: evaluationmethod || ""
        }
    }).trigger("reloadGrid");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}