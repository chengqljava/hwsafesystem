
$(function () {

	var timIndex;
    //$('.subnav').metisMenu();
    $('.J_menuItem').click(function () {
//    	clearTimeout(timIndex);
        $('.J_menuItem').removeClass('active');
        $(this).addClass('active');
        var liClassName = $(this).parent().parent().parent().data('type');
        $('#side-menu li').removeClass('active');
        $('.' + liClassName).parent().addClass('active');
//		执行一次方法，应急救援全屏按钮添加全屏事件	
//        timIndex = setTimeout(fullpreen, 1000);
    });
    $(".right-sidebar-toggle").click(function () {
        $("#right-sidebar").toggleClass("sidebar-open")
    });
    $(".sidebar-container").slimScroll({
        height: "100%",
        railOpacity: .4,
        wheelStep: 10
    });
//	一级菜单的点击事件：默认选中二级菜单的第一个,模拟点击一次
    $('#side-menu').on('click', 'li', function () {
        var liClass = $(this).children('a').attr('class');
        $('.J_menuItem').removeClass('active');
        $("li[data-type=" + liClass + "]").eq(0).children('ul').children('li').eq(0).children('a').click();
    });

    $("#slimtest").find("a").on("click", function (e) {
        e.preventDefault();
        $(this).next("ul").toggle(400);
        $(this).find("i").toggleClass("arrow-up");
    });

    var flag = 1;
    $('.sidebar-collapse ul li').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.subnav').css('display', 'block');
        $('#page-wrapper').css('margin-left', '253px');
        flag = 1;
    });


    $('.pinch').on('click', function () {
        $('.subnav').css('display', 'block');
        if (flag == 1) {
            $('.subnav').css('display', 'none');
            $('#page-wrapper').css('margin-left', '75px');
            flag = 0;
        } else {
            $('.subnav').css('display', 'block');
            $('#page-wrapper').css('margin-left', '253px');
            flag = 1;
        }
    });

    function sub() {
        var simHeight = $(window).height() - $('.header').height() - 12;
        $('#slimtest').slimScroll({
            height: simHeight,
        });
    }

    sub()
    $(window).resize(function () {
        var simHeight = $(window).height() - $('.header').height() - 12;
        $('#slimtest').slimScroll({
            height: simHeight,
        });
    });
    slider();

    //加载请求获取待办事项,三分钟数据刷新一次
//	setInterval(function(){
//		loadWaiting();
//	},180000);

    //loadWaiting();
    //监测报警
//	initMonitorInfo();
    //隐患预警
//	initHiddendangerInfo();
    //许可超期报警
//	initDangerEntInfo();
    // 应急事故预警
//	initDangerEntInfo();

//	loadRemind();
	
	function slider(){
		var outer=$('.sidebar-collapse');
		var oul=$('.sidebar-collapse ul');
		var ali=$('.sidebar-collapse ul li');	
		var aliHei=ali.eq(0).height();	
		var outHei=outer.height();
		var aliSize=ali.size();
		var ulHei=aliHei*aliSize;
		oul.height(ulHei);
		var btnPre = $(".prev-bnt");
		var btnNext = $(".next-btn");	
		var timer = null;
		haveHei = function() {
			var leftHi= $('.navbar-style').height();
//			console.log(leftHi);
			var lisize=Math.floor((leftHi - 155 )/aliHei);
//			console.log(lisize,aliHei);
			if(ulHei>=leftHi){
				outer.css({'top':'0','height':lisize*aliHei});
				btnPre.addClass('active');
				btnNext.show();
				btnPre.show();
			}else{
				outer.css({'height':'100%'});
				oul.css({'top':'0'});
				btnPre.hide();
				btnNext.hide();
			}
			outHei=lisize*(aliHei);
		};	
		$(window).resize(function() {
				clearTimeout(timer);
				timer = setTimeout(haveHei, 300);
			}).ready(haveHei);
		btnNext.click(function(){
			timeId = setTimeout(function(){				
			var oulTop=parseInt(oul.css('top'));	
			if( (oulTop+ulHei)>outHei ) {
				ulMove(-outHei);
			}},100);
			btnNext.addClass('active');
			btnPre.removeClass('active');
		}).dblclick(function(){
			clearTimeout(timeId)
		});
		btnPre.click(function(){		
				   timeId = setTimeout(function(){	
					var oulTop=parseInt(oul.css('top'));				
					if(oulTop>=0){	
					 oul.animate({top:'0px'},500);
					}else{
						ulMove(outHei);
					}},300);
				   btnPre.addClass('active');
				   btnNext.removeClass('active');
				}).dblclick(function(){
					clearTimeout(timeId)
				});
		function ulMove(speed){		   
			oul.animate({top:'+='+speed+'px'},500,function(){
				if(parseInt(oul.css('top'))>0){
					oul.animate({top:'0px'},200);
				}
			});
	   }
	}
	
	//消息提醒数
	loadRemindCount();
	
//	//每隔5秒刷新提醒数目
//	setInterval(function() {		
//		//消息提醒数
//		loadRemindCount();
//	},5000)
	
	$('.hwTab').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('open').removeClass('selected');
		}
		else{
			$(this).removeClass('open').addClass('selected');
			
		}
		return false;
	})

	$('.yjzsTabs').click(function(){
		return false;
	});
});

/*********************消息提醒开始****************************/
//弹窗tab点击事件
$('#remindList').on('click', function () {
    $('.xxtxRightTop ul li').removeClass('active11');
    $('.warningInfoList li').removeClass("active12");

});
//右上角tab点击事件
$('.xxtxRightTop ul').on('mouseover', '.warningKind', function () {
    $('.xxtxRightTop ul li').removeClass('active11');
    $(this).addClass('active11');
    var $kind = $(this).data('kind');
    $('.warningInfoListDiv').removeClass('block');
    $('#' + $kind).addClass('block');
})
$('.warningInfoList').on('click', 'li', function () {
    $('.warningInfoList li').removeClass("active12");
    $(this).addClass('active12');
})

//提醒数目
function loadRemindCount() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/indexalert/remindCount',
        dataType: 'json',
        global: false,
        async: true,
        success: function (data) {
//            console.log(data);
            if (data.total > 99) {
                $("#remindCount").text("99+");
            } else {
                $("#remindCount").text(data.total);
            }
            $("#yhtx").text(data.yhtotal);
            $("#zstx").text(data.zstotal);
            $("#usertype").val(data.userType);
            /**隐患类别*/
            $("#dzgwyq").val(data.dzgwyq);
            $("#dfc").val(data.dfc);
            $("#dhx").val(data.dhx);
            $("#dzgyq").val(data.dzgyq);
            /**证书类型*/
            $("#zgzz").val(data.zgzz);
            $("#whpxk").val(data.whpxk);
            $("#aqsczrr").val(data.aqsczrr);
            $("#aqscglr").val(data.aqscglr);
            $("#tzzyry").val(data.tzzyry);
            $("#tzsbzyry").val(data.tzsbzyry);
            /**监测、故障报警*/
            $("#gzbj").text(data.alarmFaultCount);
            $("#jcbj").text(data.alarmCount);
            $("#gzbjent").text(data.alarmFaultEntCount);
            $("#jcbjent").text(data.alarmEntCount);
            /**任务提醒*/
            if (data.userType == "ENT") {
                $("#xxrw").hide();
                $("#xxhb").hide();
                $(".xxtxRightTop").css('height', '110px');
            }
            $("#rwtx").text(data.rwtotal);
            $("#yjrw").val(data.yjrw);
            $("#jjrw").val(data.jjrw);
            // getHuanbao();

        },
        error: function () {
            parent.toast("网络异常");
        }
    });


}

function getHuanbao() {

    $.ajax({
        type: 'post',
        url: BASE_URL + '/epi/epialaram/getHbMsg',
        global: false,
        async: false,
        data: {
            page:1,
            rows:10
        },
        success: function (data) {
//            console.log(data);

            if(data){
                if(!$("#remindCount").text()=="99+"){
                    var count = parseInt($("#remindCount").text()) + data.total;
                    if(count>99){
                        $("#remindCount").text("99+");
                    }else{
                        $("#remindCount").text(count);
                    }

                }
                $("#hbbj").text(data.total);
            }


        },
        error: function () {
            console.log("----------error--------");
        }
    });
//


}

//打开隐患窗口
$("#xxyh").off("click").on("click", function () {
    var dzgwyq = $("#dzgwyq").val();
    var dfc = $("#dfc").val();
    var dhx = $("#dhx").val();
    var dzgyq = $("#dzgyq").val();
    var usertype = $("#usertype").val();
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/hidRemindList.html?dzgwyq=" + dzgwyq + "&dfc=" + dfc + "&dhx=" + dhx + "&dzgyq=" + dzgyq + "&usertype=" + usertype,
        '隐患提醒列表', '60%', '60%');
    
    //调整遮罩层的优先级
    renderTopShade();
});

//打开环保窗口
$("#xxhb").off("click").on("click", function () {

    parent.openWin(BASE_URL + "/views/module/system/remindinfo/alarmhbList.html",
        '环保提醒列表', '60%', '60%');
    
    //调整遮罩层的优先级
    renderTopShade();
});


//打开证书窗口
$("#xxzs").off("click").on("click", function () {
    var zgzz = $("#zgzz").val();
    var whpxk = $("#whpxk").val();
    var aqsczrr = $("#aqsczrr").val();
    var aqscglr = $("#aqscglr").val();
    var tzzyry = $("#tzzyry").val();
    var tzsbzyry = $("#tzsbzyry").val();
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/certifRemindList.html?zgzz=" + zgzz + "&whpxk=" + whpxk + "&aqsczrr=" + aqsczrr + "&aqscglr=" + aqscglr + "&tzzyry=" + tzzyry + "&tzsbzyry=" + tzsbzyry,
        '证书提醒列表', '70%', '60%');
    
    //调整遮罩层的优先级
    renderTopShade();
});

//打开故障报警窗口
$("#xxgz").off("click").on("click", function () {
    var usertype = $("#usertype").val();
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/faultAlarmList.html?usertype=" + usertype,
        '故障报警列表', '60%', '60%');
    
    
    //调整遮罩层的优先级
    renderTopShade();
});

//打开监测报警窗口
$("#xxjc").off("click").on("click", function () {
    var usertype = $("#usertype").val();
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/alarmList.html?usertype=" + usertype,
        '监测报警列表', '60%', '60%');
    
    //调整遮罩层的优先级
    renderTopShade();
});

//打开任务窗口
$("#xxrw").off("click").on("click", function () {
    var yjrw = $("#yjrw").val();
    var jjrw = $("#jjrw").val();
    var usertype = $("#usertype").val();
    parent.openWin(BASE_URL + "/views/module/system/remindinfo/emsTaskList.html?yjrw=" + yjrw + "&jjrw=" + jjrw + "&usertype=" + usertype,
        '任务提醒列表', '60%', '60%');
    
    //调整遮罩层的优先级
    renderTopShade();
});

/*********************消息提醒结束****************************/

//加载系统提醒信息
function loadRemind() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/system/sysremindinfo/remind',
        cache: false,
        dataType: 'json',
        global: false,
        async: false,
        success: function (result) {
            if (result.content != null && result.content != "") {
                //捕获页
                layer.open({
                    type: 1,
                    skin: 'layui-layer-dialog',
                    area: ['300px', '180px'], //宽高
                    title: "消息提醒", //显示标题
                    shade: 0,
                    content: result.content, //捕获的元素
                    offset: 'rb'
                });
            }
        },
        error: function () {
            parent.parent.toast("网络异常");
        }
    });
}


//查询待办数目
function loadWaiting() {
    //加载请求获取待办事项
    $.ajax({
        type: 'post',
        url: BASE_URL + '/law/lawwaiting/waiting',
        cache: false,
        dataType: 'json',
        global: false,
        async: false,
        success: function (result) {
            if (result.todoNum > 0 && result.taskNum == 0) {
                //捕获页
                layer.open({
                    type: 1,
                    skin: 'layui-layer-dialog',
                    area: ['300px', '150px'], //宽高
                    title: "消息提醒", //显示标题
                    shade: 0,
                    content: "<div class='tip03'>有&nbsp;<a href='javascript:void(0);' onclick='initTodo()'>" + result.todoNum + "</a>&nbsp;条待办文书需要处理。</div>", //捕获的元素
                    offset: 'rb'
                });
            } else if (result.todoNum == 0 && result.taskNum > 0) {
                //捕获页
                layer.open({
                    type: 1,
                    skin: 'layui-layer-dialog',
                    area: ['300px', '150px'], //宽高
                    title: "消息提醒", //显示标题
                    shade: 0,
                    content: "<div class='tip02'>有&nbsp;<a href='javascript:void(0);' onclick='initTask()'>" + result.taskNum + "</a>&nbsp;条待办任务需要处理。</div>", //捕获的元素
                    offset: 'rb'
                });
            } else if (result.todoNum > 0 && result.taskNum > 0) {
                //捕获页
                layer.open({
                    type: 1,
                    skin: 'layui-layer-dialog',
                    area: ['300px', '150px'], //宽高
                    title: "消息提醒", //显示标题
                    shade: 0,
                    content: "<div class='tip03'>有&nbsp;<a href='javascript:void(0);' onclick='initTodo()'>" + result.todoNum + "</a>&nbsp;条待办文书</div><div class='tip02'>有&nbsp;<a href='javascript:void(0);' onclick='initTask()'>" + result.taskNum + "</a>&nbsp;条待办任务需要处理</div>", //捕获的元素
                    offset: 'rb'
                });
            }
        },
        error: function () {
            parent.parent.toast("网络异常");
        }
    });
}

function initTodo() {
    parent.openWin(BASE_URL + "/law/lawtodo/DBWS_GOV", "待办文书", '65%', '50%');
}


function initRemind(typeid) {
    var title = "消息提醒";
    switch (typeid) {
        case "D":
            title = "隐患排查提醒";
            break;
        case "C":
            title = "监测预警提醒";
            break;
        case "B":
            title = "证书到期提醒";
            break;
        case "A":
            title = "待办事项提醒";
            break;
    }
    createTab(BASE_URL + "/views/module/system/sysremindinfo/sysRemindInfoList.html?privcode=XTTX_GOV&typeid=" + typeid, title, typeid);
}


function initTask() {
    parent.openWin(BASE_URL + "/task/backlog/DBRW_GOV", "待办任务", '65%', '50%');
}


/**
 * 监测报警
 */
function initMonitorInfo() {
    var userid = $("#userid").val();
    var date = new Date;
    var year = date.getFullYear();

    $.ajax({
        type: "post",
        url: BASE_URL + "/monitor/welcome/monitorInfo",
        data: {
            etime: getFormatDate(new Date(), "yyyy-MM-dd"),
            stime: getFormatDate(new Date(), "yyyy-MM-dd"),
            userid: userid,
            year: year
        },
        success: function (data) {
            if (data) {
                var warningCounts = data.warningCounts;
                var totalwarning = warningCounts.TOTALWARNING;
                if (warningCounts && totalwarning != 0) {
                    var noHandleCount = warningCounts.NOHANDLECOUNT == null ? 0 : warningCounts.NOHANDLECOUNT;

                    var content = "";
                    if (noHandleCount == 0) {
                        content = "<div class='tip03'>今日警报数目&nbsp;<a href='javascript:void(0);' onclick='intoAlarmInfoList(\"" + all + "\")'>" + totalwarning + "</a>。</div>";
                    } else {
                        content = "<div class='tip03'>今日警报数目&nbsp;<a href='javascript:void(0);' onclick='intoAlarmInfoList(\"" + all + "\")'>" + totalwarning + "</a>&nbsp;，今日未处理&nbsp;<a href='javascript:void(0);' onclick='intoAlarmInfoList(\"" + nohandle + "\")'>" + noHandleCount + "</a>。</div>";
                    }

                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });

                }


            }
        }
    });

}

//进入报警列表（全部和未处理）
function intoAlarmInfoList(type) {
    var stime = getFormatDate(new Date(), "yyyy-MM-dd");
    var etime = getFormatDate(new Date(), "yyyy-MM-dd");
    var districtid = "";

    var statuses = "";
    var title = "";
    var dangertype = "";
    var handlestatus = "";

    switch (type) {
        case "all":
            title = "今日报警列表";
            break;
        case "nohandle":
            title = "今日报警未处理列表";
            handlestatus = "0";
            break;
    }
    parent.openWinWithCloseCallback(BASE_URL + '/views/module/monitor/monitorcondition/alarmInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangertype=' + dangertype + '&handlestatus=' + handlestatus, title, '80%', '90%');

}

/**
 * 隐患预警
 */
function initHiddendangerInfo() {
    $.ajax({
        type: "post",
        url: BASE_URL + "/hdidanger/welcome/loadDangerCount",
        data: {},
        success: function (data) {
            if (data) {
                var zczb = data.zczbcount;
                var wgxc = data.wgxccount;
                if (zczb > 0 && wgxc > 0) {
                    var content = content = "<div class='tip03'>自查自报隐患数&nbsp;<a href='javascript:void(0);' onclick='displayHdi(0)'>" + zczb + "</a>&nbsp;，网格巡查隐患数&nbsp;<a href='javascript:void(0);' onclick='displayHdi(1)'>" + wgxc + "</a>。</div>";
                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });
                } else if (zczb > 0) {
                    var content = content = "<div class='tip03'>自查自报隐患数&nbsp;<a href='javascript:void(0);' onclick='displayHdi(0)'>" + zczb + "</a>。</div>";
                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });
                } else if (wgxc > 0) {
                    var content = content = "<div class='tip03'>网格巡查隐患数&nbsp;<a href='javascript:void(0);' onclick='displayHdi(1)'>" + wgxc + "</a>。</div>";
                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });
                }

            }
        }

    });
}

/**
 * 详细查看
 */
function displayHdi(type) {
    //返回当前选中行政执法的列表
    if (type == "0") {
        //自查自报隐患数
        parent.openWin(BASE_URL + "/hiddendanger/hdientcount/displayselfcheckhdlist", "自查隐患列表", "80%", "80%");
    } else if (type == "1") {
        //网格巡查隐患数
        parent.openWin(BASE_URL + "/hiddendanger/hdientcount/displaypatrolhdlist", "巡查隐患列表", "80%", "80%");
    }
}


/**
 * 许可超期报警
 */
function initDangerEntInfo() {
    var date = new Date();
    var year = date.getFullYear();

    $.ajax({
        type: "post",
        url: BASE_URL + "/enterprise/dangerentcount/report",
        data: {
            districtid: "",
            year: year
        },
        success: function (map) {
            if (map.success == true) {
                var expire = map.data.expire;
                if (expire && expire != 0) {

                    var content = "<div class='tip03'>危化品企业许可超期数目&nbsp;<a href='javascript:void(0);' onclick='getExpireInfo(1)'>" + expire + "</a>。</div>";

                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });

                }


            }
        }
    });

}

/**
 * 许可预警列表信息
 * @param expire    是否超期
 */
function getExpireInfo(expire) {
    var date = new Date();
    var year = date.getFullYear();
    var districtid = "";
    parent.openWin(BASE_URL + "/enterprise/dangerentcount/displaypermitwarn/" + year + "/" + expire + "?districtid=" + districtid, '许可超期详细', '80%', '60%');
}


/**
 * 应急事故预警
 */
function initDangerEntInfo() {
    var date = new Date;
    var year = date.getFullYear();

    $.ajax({
        type: "post",
        url: BASE_URL + "/ems/emssucevent/loadeventcount",
        data: {},
        success: function (map) {
            if (map.success == true) {
                var count = map.count;
                if (count && count != 0) {

                    var content = "<div class='tip03'>未处理应急事故数目&nbsp;<a href='javascript:void(0);' onclick='getEventInfo()'>" + count + "</a>。</div>";

                    //捕获页
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-dialog',
                        area: ['300px', '150px'], //宽高
                        title: "消息提醒", //显示标题
                        shade: 0,
                        content: content, //捕获的元素
                        offset: 'rb'
                    });

                }


            }
        }
    });

}

/**
 * 应急事故列表信息
 */
function getEventInfo() {
    parent.openWin(BASE_URL + "/ems/emssucevent/intoeventpage", '应急事故', '80%', '60%');
}

/**
 * 创建首页tab页
 * @param url 访问地址
 * @param title tab页标题
 * @param iframeindex tab的index
 * @returns {Boolean}
 */
// function createTab(url,title,iframeindex) {
// 	var k = true;
// 	if (url == undefined || $.trim(url).length == 0) {
// 		return false
// 	}
// 	$(".J_mainContent .J_iframe").each(
// 			function() {
//
// 				if ($(this).attr("name") == 'iframe' + iframeindex) {
// 					$(this).show()
// 							.siblings(".J_iframe")
// 							.hide();
// 					k=false;
// 				}
// 			})
// 	if (k) {
// 		var p = '<a href="javascript:;" class="active J_menuTab" data-id="'
// 				+ url + '">' + title
// 				+ ' <i class="glyphicon glyphicon-remove-sign"></i></a>';
// 		$(".J_menuTab").removeClass("active");
// 		var n = '<iframe class="J_iframe" name="iframe' + iframeindex
// 				+ '" width="100%" height="100%" src="' + url
// 				+ '" frameborder="0" data-id="' + url
// 				+ '" seamless></iframe>';
// 		$(".J_mainContent").find("iframe.J_iframe").hide().parents(
// 				".J_mainContent").append(n);
// 		$(".J_menuTabs .page-tabs-content").append(p);
// 	}else{
// 		$(".J_iframe[name=iframe" + iframeindex+"]").attr("src",url);//如果界面已经打开重新加载界面
// 	}
// 	return false
// }


function createTab(url, title, index) {

    var href = url;


    // var href = $(this).attr("href"), index = $(this).data("index"), title = $.trim($(
    //     this).text()), isCreate = true;
    var isCreate = true;
    if (href == undefined || $.trim(href).length == 0) {
        return false
    }
    $(".J_menuTab").each(
        function () {
            if ($(this).data("id") == href) {
                if (!$(this).hasClass("active")) {
                    $(this).addClass("active").siblings(".J_menuTab")
                        .removeClass("active");
                    g(this);
                    $(".J_mainContent .J_iframe").each(
                        function () {
                            if ($(this).data("id") == href) {
                                $(this).show()
                                    .siblings(".J_iframe")
                                    .hide();
                                return false
                            }
                        })
                }
                isCreate = false;
                return false
            }
        });
    if (isCreate) {
        var p = '<a href="javascript:;" class="active J_menuTab" data-id="'
            + href + '">' + title
            + ' <i class="glyphicon glyphicon-remove-sign"></i></a>';
        $(".J_menuTab").removeClass("active");
        var n = '<iframe class="J_iframe" name="iframe' + index
            + '" width="100%" height="100%" src="' + href
            + '" frameborder="0" data-id="' + href
            + '" seamless></iframe>';
        $(".J_mainContent").find("iframe.J_iframe").hide().parents(
            ".J_mainContent").append(n);
        $(".J_menuTabs .page-tabs-content").append(p);
        g($(".J_menuTab.active"))
    } else {
        $(".J_iframe[data-id='" + href + "']").attr("src", href);//如果界面已经打开重新加载界面
    }
    return false
}


function g(n) {
    var o = f($(n).prevAll()), q = f($(n).nextAll());
    var l = f($(".content-tabs").children().not(".J_menuTabs"));
    var k = $(".content-tabs").outerWidth(true) - l;
    var p = 0;
    if ($(".page-tabs-content").outerWidth() < k) {
        p = 0
    } else {
        if (q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
            if ((k - $(n).next().outerWidth(true)) > q) {
                p = o;
                var m = n;
                while ((p - $(m).outerWidth()) > ($(".page-tabs-content")
                    .outerWidth() - k)) {
                    p -= $(m).prev().outerWidth();
                    m = $(m).prev()
                }
            }
        } else {
            if (o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(
                    true))) {
                p = o - $(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content").animate({
        marginLeft: 0 - p + "px"
    }, "fast")
}

function f(l) {
    var k = 0;
    $(l).each(function () {
        k += $(this).outerWidth(true)
    });
    return k
}

// 添加应急救援全屏按钮点击事件
//function fullpreen() {
//    $('iframe').contents().find('body').on('click', '#fullpreen i', function () {
//        fullScreen();
//    });
//};

//全屏实现的方法
//function fullScreen(){
//	var width = $(window).width();
//	var height = $(window).height();
//	var fullBtn = $('iframe').contents().find('#fullpreen i');
//	$('.J_iframe').each(function(){
		//通过判断data-id的值获取应急救援的ifream
//		var Jsrc = $(this).data('id');
//		if(Jsrc == BASE_URL+'/views/module/ems/emsmap/emResIndex.html?lastPageUrl=&eventid='){
//			if($(this).css('position') == 'fixed'){
//				$(this).css('position','relative');
//				$(fullBtn).attr('class','icon-size-fullscreen');
//			}
//			else{
//				$(this).css({
//					'position': 'fixed',
//				    'top': 0,
//				    'left': 0,
//				    'z-index':999
//				});
//				$(fullBtn).attr('class','icon-size-actual');
//			}
//		}
//	});
//}

/**
 * 调整遮罩层的优先级
 */
function renderTopShade() {
	$(".layui-layer-shade").empty().html("<iframe  src='about:blank' frameBorder='0' marginHeight='0' marginWidth='0' style='position: absolute; visibility: inherit; top: 0px; left: 0px; width: 100%; height: 100%; z-index: -1; filter: alpha(opacity = 0);'></iframe>");
}