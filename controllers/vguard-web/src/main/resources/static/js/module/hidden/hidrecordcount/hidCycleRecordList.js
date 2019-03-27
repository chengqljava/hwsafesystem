$(function(){
	changQarter();
	loadCylePlanList();
	loadRecordList();
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
        $('#dangerTitle').html(planname.substring(5)+"执行记录");
        reloadGrid(checkplanid);
    })
    
    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
    	$('#dangerTitle').html("周期检查计划执行记录");
    	loadCylePlanList("search");
    });
    /*重置*/
    $("#resetbtn").bind("click", function () {
    	$("#name").val("");
    });
})

function onclick(){
	loadCylePlanList();
	reloadGrid();
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}


function loadCylePlanList(type){ 
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
        	iscycle:'1',
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
	var stime = $('#stime').val();
	var etime = $('#etime').val();
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
                return '<a href="javascript:void(0);" onclick="display(\'' + obj.CHECKPLANID + '\',\'' + obj.PLANNAME + '\')">' + obj.PLANNAME + '</a>';
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
	    var tableHeight = $(window).height() - $(".pcheck").height() - 250 - 33;
	    $(window).resize(function () {
	        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 250 - 33);
	        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
	    });

 $("#grid-table").jqGrid({
     height: tableHeight,
     url: BASE_URL + "hidden/hidcycleplan/loadCycleRecordList",
     datatype: "json",
     cache: false,
     mtype: "POST",
     colNames: colname,
     colModel: colmodel,
     postData: {
    	 stime: stime,
    	 etime: etime
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
     autowidth: true
 });
}

/**
 * 查看计划检查项目
 * @param checkplanid
 */
function planCheckRecord(checkplanid,time,msg) {
	parent.openWin(BASE_URL + "views/module/hidden/hiddenPlan/gov/govcycleplan/checkRecordList.html?checkplanid="+checkplanid+"&time="+time+"&msg="+msg,"巡查记录", "70%", "75%");
}

function display(checkplanid, checkname) {
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}