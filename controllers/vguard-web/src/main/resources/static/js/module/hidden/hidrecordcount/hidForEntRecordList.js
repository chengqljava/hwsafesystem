$(function(){
	
	var flag = 0;
	
	changQarter();
	loadRecordList();
	loadCylePlanList("",flag);
	loadHidList();
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
		onclick(flag);
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
			onclick(flag);
		});
	});

	$("#aqjcjh").on("click",function(){
		flag = 0;
		$("#aqjcjh").addClass('active').siblings().removeClass('active');
		$("#checkplan").show();
		$("#cyclecheckplan").hide();
		onclick(flag);
	});
	
	$("#zqxjh").on("click",function(){
		flag = 1;
		$("#zqxjh").addClass('active').siblings().removeClass('active');
		$("#cyclecheckplan").show();
		$("#checkplan").hide();
		onclick(flag);
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
        var checkplanid = $('.active input').val();
        var planname = $('.active').text();
        if(flag == 0){
        	reloadCheckGrid(checkplanid);
        	$('#checkplan .dangerTableTitle').html(planname.substring(5)+"执行记录");
        } else {        	
        	reloadGrid(checkplanid);
        	$('#cyclecheckplan .dangerTableTitle').html(planname.substring(5)+"执行记录");
        }
    })
    
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
    	if(flag == 0){
    		loadCylePlanList("search",flag);
        	reloadCheckGrid();
        	$('#checkplan .dangerTableTitle').html("企业安全检查计划执行记录");
        } else {    
        	loadCylePlanList("search",flag);
        	reloadGrid();
        	$('#cyclecheckplan .dangerTableTitle').html("企业周期检查计划执行记录");
        }
    });
    /*重置*/
    $("#resetbtn").bind("click", function () {
    	$("#name").val("");
    });
})

function onclick(flag){
	if(flag == 0){
		$('#checkplan .dangerTableTitle').html("企业安全计划执行记录");
		loadCylePlanList("",flag);
		reloadCheckGrid();
	} else {
		$('#cyclecheckplan .dangerTableTitle').html("周期检查计划执行记录");
		loadCylePlanList("",flag);
		reloadGrid();
	}
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

function loadCylePlanList(type,iscycle){ 
	var planname = $('#name').val();
	var stime = $('#stime').val();
	var etime = $('#etime').val();
	var isgov = $('#isgov').val();
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckplan/loadCycleRecordList",
        dataType: "json",
        data: {
        	planname: planname || '',
        	stime: stime || '',
        	etime: etime || '',
        	iscycle: iscycle,
        	isgov:'2',//为企业下发的计划
        	issuedtype:'1'//已下发
        },
        async:true,
        success: function (data) {
        	$("#planList").empty();
        	$.each(data.checkplans,function(i,item){
                var planlist = '<li>'+item.PLANNAME+'<input type="hidden" name="checkplanid" value="'+item.CHECKPLANID+'"/></li>'
                $("#planList").append(planlist);
                if(type=="search"){
                	if(planname != null && planname != ''){                		
                		$("#planList").find("li:first-child").addClass('active');
                		var checkplanid = $('.active input').val();
                	}
                	reloadGrid(checkplanid);
                }
            }) 
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function loadRecordList(){
	 //列表分页表格
	 var colname = ["id","计划名称","计划执行时间","计划检查企业","已检查企业","计划id"],
     colmodel = [
         {
             name: "PLANCYCLEID",
             index: "PLANCYCLEID",
             width: "5%",
             align: "center",
             sortable: false,
             hidden: true
         },
         {
           	name: "PLANNAME",
           	index: "PLANNAME",
           	width: "10%",
           	align: "center",
           	sortable: false,
           	formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="displayCycPlan(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">' + obj.PLANNAME + '</a>';
            }
          },
         {
             name: "CHECKREQUIRE",
             index: "CHECKREQUIRE",
             width: "10%",
             align: "center",
             sortable: false,
             formatter: function (cellvalue, options, obj) {
                 return getFormatDateByLong(cellvalue, 'yyyy-MM-dd hh:mm:ss');
             }
         },
         {
             name: "CHECKENT",
             index: "CHECKENT",
             width: "15%",
             align: "center",
             sortable: false,
         	formatter: function (cellvalue, options, obj) {
         		return '<a href="javascript:void(0);" onclick="planCheckRecord(\'' + obj.CHECKPLANID + '\',\'' + getFormatDateByLong(obj.CHECKREQUIRE, 'yyyy-MM-dd hh:mm:ss') +'\',\'ALL\')">' + cellvalue + '</a>';
         	}
         },
         {
         	name: "CHECKEDENT",
         	index: "CHECKEDENT",
         	width: "10%",
         	align: "center",
         	sortable: false,
         	formatter: function (cellvalue, options, obj) {
         		return '<a href="javascript:void(0);" onclick="planCheckRecord(\'' + obj.CHECKPLANID + '\',\'' + getFormatDateByLong(obj.CHECKREQUIRE, 'yyyy-MM-dd hh:mm:ss') +'\',\'PART\')">' + cellvalue + '</a>';
         	}
         },
         {
         	name: "CHECKPLANID",
         	index: "CHECKPLANID",
         	width: "10%",
         	align: "center",
         	sortable: false,
         	 hidden: true
         }
     ];
	//分页表格响应式处理
	    var tableHeight = $(window).height() - $(".pcheck").height() - 270 - 33;
	    $(window).resize(function () {
	        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270 - 33);
	        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99 - 465);
	    });

 $("#grid-table").jqGrid({
     height: tableHeight,
     width:'100%',
     url: BASE_URL + "hidden/hidcycleplan/loadCycleRecordList",
     datatype: "json",
     cache: false,
     mtype: "POST",
     colNames: colname,
     colModel: colmodel,
     postData: {
    	 isgov:'2',//下发企业计划
    	 issuedtype:'1',//已下发状态
    	 stime:$("#stime").val(),
     	etime:$("#etime").val()
     },
     sortname: "checkrequire",
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
     multiselect: true,
     autowidth: true,
     loadComplete:function(){
    	 $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99 - 465);	        
    	 $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270 - 33);
     }
 });
}

/**
 * 查看计划检查项目
 * @param checkplanid
 */
function planCheckRecord(checkplanid,time,msg) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/checkRecordList.html?checkplanid="+checkplanid+"&time="+time+"&msg="+msg,"巡查记录", "70%", "75%");
}

function displayCycPlan(checkplanid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/govCyclePlanDisplay.html?checkplanid=" + checkplanid,
    		checkname, "60%", "70%");
}


/**
 * 刷新时加载查询条件
 */
function reloadGrid(checkplanid) {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkplanid: checkplanid || '',
        	stime:$("#stime").val(),
        	etime:$("#etime").val()
        }
    }).trigger("reloadGrid");
}

function loadHidList(){
	var stime = $('#stime').val();
	var etime = $('#etime').val();
	 //列表分页表格
    var colname = [
            "隐患排查记录id","检查对象", "检查记录名称","检查项(项)", "隐患数","未整改数", "检查人员","检查时间", "关联计划",  "检查状态", "检查区域", "检查进度"],
        colmodel = [
            {
                name: "CHECKRECORDID",
                index: "CHECKRECORDID",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "CHECKNAME",
                index: "CHECKNAME",
                width: "15%",
                align: "center",
                sortable: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKRECORDID + '\',\'' + obj.CHECKNAME + '\')">' + obj.CHECKNAME + '</a>';
                }
            },
            {
                name: "ITEMCOUNT",
                index: "ITEMCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'PCLB\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "DANGERCOUNT",
                index: "DANGERCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'YHLB\')">' + cellvalue + '</a>';
                }
            },
            {
				name : "ISOUTCOUNT",
                index: "ISOUTCOUNT",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                    return '<a href="javascript:void(0);" onclick="displayHid(\'' + obj.CHECKRECORDID + '\',\'YZGLB\')">' + cellvalue + '</a>';
                }
            },
            {
                name: "CHECKUSERS",
                index: "CHECKUSERS",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name: "CHECKTIME",
                index: "CHECKTIME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue != '' || cellvalue != null ) {
                		return getSmpFormatDateByLong(obj.CHECKTIME,false);
					}else{
						return '';
					}
                }
            },
            {
                name: "PLANNAME",
                index: "PLANNAME",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: false,
                formatter: function (cellvalue, options, obj) {
                	if (cellvalue != '' && cellvalue != null ) {
                		return '<a href="javascript:void(0);" onclick="displayPlan(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">' + cellvalue + '</a>';
					}else{
						return '--';
					}
                }
            },
            {
				name : "CHECKSTATE",
                index: "CHECKSTATE",
                width: "15%",
                align: "center",
                sortable: true,
                hidden: true,
            },
            {
				name : "CHECKAREA",
                index: "CHECKAREA",
                width: "15%",
                align: "center",
                sortable: true
            },
            {
            	name : "progress",
                index: "progress",
                width: "10%",
                align: "center",
                sortable: true,
                formatter: function (cellvalue, options, obj) {
                	if(obj.CHECKSTATE == "1"){
                    	return '<img src="../../../../images/module/hidden/progress0.png" style="height:10px;width: 65%;" alt="0%" />';
                    } else if(obj.CHECKSTATE == "2") {
                    	return '<img src="../../../../images/module/hidden/progress50.png" style="height:10px;width: 65%;" alt="50%" />';
                    } else if(obj.CHECKSTATE == "3"){
                    	return '<img src="../../../../images/module/hidden/progress100.png" style="height:10px;width: 65%;" alt="100%"  />';
                    } else {
                    	return "";
                    }
                }
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 270 - 33;
    $(window).resize(function () {
        $("#checkGrid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270 - 33);
        $("#checkGrid-table").jqGrid("setGridWidth", $(window).width() * 0.99  - 465);
    });

    $("#checkGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "hidden/hidcheckrecord/loadFromGovCommonRecordList",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
        	stime: stime,
        	etime: etime
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#checkGrid-pager",
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
        multiselect: true,
//        caption: "网格巡查记录列表",
        autowidth: true
//        ,
//        loadComplete:function(){
//	       	$("#checkGrid-table").jqGrid("setGridWidth", $(window).width() * 0.99 - 465);	        
//	       	$("#checkGrid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 270 - 33);
//        }
    });
}

/**
 * 排查项、隐患数、已整改数列表
 * @param checkrecordid
 * @param flag
 */
function displayHid(checkrecordid,flag){
	var titlename;
	if (flag == "PCLB") {
		titlename="排查项列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidItemInfo.html?checkrecordid=" + checkrecordid,
				titlename, "60%", "60%");
	}else if(flag == "YHLB"){
		titlename="隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YHLB",
				titlename,"60%", "60%");
	}else{
		titlename="未整改隐患列表";
		parent.openWin(BASE_URL + "views/module/hidden/checkRecord/hidDangerInfo.html?checkrecordid=" + checkrecordid+"&flag=YZGLB",
				titlename, "60%", "60%");
	} 
}

/*企业详细查询*/
function displayEnt(businessinfoid,entname){
	parent.openWin(BASE_URL+'views/module/enterprise/entbusinessinfo/displayEntbusinessinfo.html?businessinfoid='+businessinfoid,entname,'80%','90%');
}

function display(checkrecordid, checkname) {
    parent.openWin(BASE_URL + "views/module/hidden/checkRecord/govCheckRecordDisplay.html?checkrecordid=" + checkrecordid,
    		checkname, "55%", "45%");
}

function displayPlan(checkplanid, checkname) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcommonplan/govcommonplanDisplay.html?checkplanid=" + checkplanid,
			checkname, "60%", "70%");
}

/**
 * 刷新时加载查询条件
 */
function reloadCheckGrid(checkplanid) {
	var stime = $("#stime").val();
	var etime = $("#etime").val();

    $("#checkGrid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	checkplanid: checkplanid || '',
        	stime: stime ||"",
        	etime: etime ||""
        }
    }).trigger("reloadGrid");
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}