/**
 * Created by Administrator on 2017/10/19.
 */
$(function () {
    changQarter();
    var currYear = new Date().getFullYear();
    var html = "<li>" + (currYear - 4) + "</li>" +
        "<li>" + (currYear - 3) + "</li>" +
        "<li>" + (currYear - 2) + "</li>" +
        "<li>" + (currYear - 1) + "</li>" +
        "<li class='cur'>" + currYear + "</li>";
    $(".year").html(html);

    $(".year").on("click", "li", function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        setTimeByQarter($(this).text(), $("#qarter").val());
        if ($(this).index() == 0) {
            var year = parseInt($(this).text());
            var html = "<li>" + (year - 2) + "</li>" +
                "<li>" + (year - 1) + "</li>" +
                "<li class='cur'>" + year + "</li>" +
                "<li>" + (year + 1) + "</li>" +
                "<li>" + (year + 2) + "</li>";
            $(".year").html(html);
        } else if ($(this).index() == 4) {
            var year = parseInt($(this).text());
            var curYear = new Date().getFullYear();
            if (year != curYear) {
                var html = "<li>" + (year - 2) + "</li>" +
                    "<li>" + (year - 1) + "</li>" +
                    "<li class='cur'>" + year + "</li>" +
                    "<li>" + (year + 1) + "</li>" +
                    "<li>" + (year + 2) + "</li>";
                $(".year").html(html);
            }
        }
        initData();
    });

    $(".quarter").find("li").each(function () {
        $(this).bind("click", function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var year = $("#stime").val().substring(0, 4);
            $("#qarter").val($(this).text());
            setTimeByQarter(year, $(this).text());
            initData();
        });
    });

    initData();
    //初始化点击事件
    initClickData();
});

/**
 * 初始化点击事件
 */
function initClickData() {


    //统计表
    $("#entMonitorInfoList").off("click").on("click", function () {
        var stime = $("#stime").val();
        var etime = $("#etime").val();
        var qarter = $("#qarter").val();
        var districtid = $("#districtid").val();
        var districtlevel = $("districtlevel").val();
        var districtcode = $("#districtcode").val();
        parent.openWin(BASE_URL + "views/module/monitor/monitorcondition/entMonitorInfoList.html?" +
            "stime=" + stime + "&etime=" + etime + "&qarter=" + qarter + "&districtid=" + districtid + "&districtlevel=" + districtlevel + "&districtcode=" + districtcode,
            "监测监控情况统计表", "60%", "80%");
    });


}

/**
 * 进入企业采集状态列表页面
 */
function intoEntStatus(statustype) {
    var stime = $("#stime").val();
    var etime = $("#etime").val();
    var districtid = $("#districtid").val();

    var statuses = "";
    var title = "";
    var dangertype = "";
    switch (statustype) {
        case "totalEnt":
            title = "监测监控企业";
            dangertype = "1,2,3";
            break;
        case "whpEnt":
            title = "危化品类企业";
            dangertype = "1";
            break;
        case "rqlEnt":
            title = "燃气类企业";
            dangertype = "2";
            break;
        case "gklEnt":
            title = "港口类企业";
            dangertype = "3";
            break;
        case "highAndLowEnt":
            title = "高低报企业";
            statuses = "101,102";
            break;
        case "higherAndLowerEnt":
            title = "超高低报企业";
            statuses = "103,104";
            break;
        case "faultEnt":
            title = "企业列表";
            statuses = "3,7,99";
            break;
    }
    parent.openWin(BASE_URL + 'views/module/monitor/monitorcondition/entInfoList.html?stime=' + stime + '&etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangertype=' + dangertype, title, '80%', '90%');
}

function intoAlarmInfo(type) {
    var stime = $("#stime").val();
    var etime = $("#etime").val();
    var districtid = $("#districtid").val();

    var statuses = "";
    var title = "";
    var dangertype = "";
    var handlestatus = "";
    switch (type) {
        case "totalAlarm":
            title = "预警信息列表";
            dangertype = "1,2,3";
            break;
        case "totalHandle":
            title = "已处理列表";
            dangertype = "1,2,3";
            handlestatus = "1";
            break;
        case "totalNoHandle":
            title = "未处理列表";
            dangertype = "1,2,3";
            handlestatus = "0";
            break;
        case "whpAlarm":
            title = "危化品企业预警列表";
            dangertype = "1";
            break;
        case "whpHandle":
            title = "危化品企业已处理列表";
            dangertype = "1";
            handlestatus = "1";
            break;
        case "whpNoHandle":
            title = "危化品企业未处理列表";
            dangertype = "1";
            handlestatus = "0";
            break;
        case "rqlAlarm":
            title = "燃气类预警列表";
            dangertype = "2";
            break;
        case "rqlHandle":
            title = "燃气类已处理列表";
            dangertype = "2";
            handlestatus = "1";
            break;
        case "rqlNoHandle":
            title = "燃气类未处理列表";
            dangertype = "2";
            handlestatus = "0";
            break;
        case "gklAlarm":
            title = "港口类预警列表";
            dangertype = "3";
            break;
        case "gklHandle":
            title = "港口类已处理列表";
            dangertype = "3";
            handlestatus = "1";
            break;
        case "gklNoHandle":
            title = "港口类未处理列表";
            dangertype = "3";
            handlestatus = "0";
            break;
        case "highAndLow":
            title = "高低报预警列表";
            statuses = "101,102";
            break;
        case "highAndLowHandle":
            title = "高低报已处理列表";
            statuses = "101,102";
            handlestatus = "1";
            break;
        case "highAndLowNoHandle":
            title = "高低报未处理列表";
            statuses = "101,102";
            handlestatus = "0";
            break;
        case "higherAndLower":
            title = "超高低报预警列表";
            statuses = "103,104";
            break;
        case "higherAndLowerHandle":
            title = "超高低报已处理列表";
            statuses = "103,104";
            handlestatus = "1";
            break;
        case "higherAndLowerNoHandle":
            title = "超高低报已处理列表";
            statuses = "103,104";
            handlestatus = "0";
            break;
        case "faultAlarm":
            title = "故障预警列表";
            statuses = "3,7,99";
            break;
        case "faultAlarmHandle":
            title = "故障已处理列表";
            statuses = "3,7,99";
            handlestatus = "1";
            break;
        case "faultAlarmNoHandle":
            title = "故障未处理列表";
            statuses = "3,7,99";
            handlestatus = "0";
            break;

    }
    window.top.GEventObject.die("REFERESH_EVENT");
    window.top.GEventObject.on("REFERESH_EVENT", function (json) {
        initData();
    });
    parent.openWinWithCloseCallback(BASE_URL + 'views/module/monitor/monitorcondition/alarmInfoList.html?etime=' + etime + '&statuses=' + statuses + '&districtid=' + districtid + '&dangertype=' + dangertype+ '&handlestatus=' + handlestatus, title, '80%', '90%',true,null,function () {
        initData();
    });
}


/**
 *企业信息统计
 */
function initEntCountByDangerType() {
    $("#whpEntCount").html("0");
    $("#rqlEntCount").html("0");
    $("#gklEntCount").html("0");
    $("#totalEntCount").html("0");
    $("#typeEntCount").html("0");
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entcount/loadEntCountByDangerType",
        data: $("#entcountform").serializeArray(),
        success: function (data) {
            if (data) {
                var datas = data.datas;
                var totalEntCount = 0;
                $.each(datas, function (i, item) {
                    switch (item.DANGERTYPE) {
                        case "1":
                            $("#whpEntCount").html(item.ENTCOUNT | "0");
                            totalEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "2":
                            $("#rqlEntCount").html(item.ENTCOUNT | "0");
                            totalEntCount += parseInt(item.ENTCOUNT);
                            break;
                        case "3":
                            $("#gklEntCount").html(item.ENTCOUNT | "0");
                            totalEntCount += parseInt(item.ENTCOUNT);
                            break;
                        default:
                            break;
                    }
                });
                $("#totalEntCount").html(totalEntCount);
                $("#typeEntCount").html(totalEntCount);
            }
        }
    });
}


/**
 * 统计图的切换
 */
function changeCountView() {
    var radioValue = $('input:radio:checked').val();

    initCharts(radioValue, window.bjdata, window.handledata);

}


/**
 * 初始化echarts
 * @param type 1为报警分类 2 为警情处理
 */
function initCharts(type, bjdata, handledata) {
    var xdata = [];
    var data = [];
    color = ["#ff7f50",
        "#87cefa",
        "#da70d6",
        "#32cd32",
        "#ff5f50",];
    if (type === "1") {
        xdata = ['高报', '低报', '超高报', '超低报', '故障'];
        text = "报警分类";
        data = bjdata;
    } else {
        xdata = ['已处理', '未处理'];
        text = "警情处理";
        data = handledata;
    }


    var chart = echarts.init(document.getElementById('chartMain'));
    var option = {
        title: {
            text: text
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: xdata
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                name: '分类',
                type: 'category',
                data: xdata
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value'
            }
        ],
        series: [
            {
                name: '数量',
                type: 'bar',
                data: data,
                itemStyle: {
                    //通常情况下：
                    normal: {
                        //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                        color: function (params) {
                            var colorList = color;
                            return colorList[params.dataIndex];
                        }
                    },
                    //鼠标悬停时：
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    chart.setOption(option);

}

/**
 * 处理统计信息
 */
function initMonitorCondition() {
    //监测监控所有企业=typeEntCount=whpCount+rqlCount+gklCount
    //所有报警信息=whpAlarmCount+rqlAlarmCount+gklAlarmCount
    var totalAlarmCount = 0;
    //所有已处理信息=whpHandleCount+rqlHandleCount+gklHandleCount
    var totalHandleCount = 0;
    //所有未处理信息=whpNoHandleCount+rqlNoHandleCount+gklNoHandleCount
    var totalNoHandleCount = 0;
    //所有类型企业=whpCount+rqlCount+gklCount
    var whpAlarmCount = 0;
    var whpHandleCount = 0;
    var whpNoHandleCount = 0;
    var rqlAlarmCount = 0;
    var rqlHandleCount = 0;
    var rqlNoHandleCount = 0;
    var gklAlarmCount = 0;
    var gklHandleCount = 0;
    var gklNoHandleCount = 0;
    var highAndLowCount = 0;
    var highAndLowHandleCount = 0;
    var highAndLowNoHandleCount = 0;
    var higherAndLowerCount = 0;
    var higherAndLowerHandleCount = 0;
    var higherAndLowerNoHandleCount = 0;
    var faultEntCount = 0;
    var faultAlarmCount = 0;
    var faultAlarmHandleCount = 0;
    var faultAlarmNoHandleCount = 0;

    var businessinfoids = [];
    var whpbusinessinfoids = [];
    var rqlbusinessinfoids = [];
    var gklbusinessinfoids = [];

    var gbAdbbusinessinfoids = [];
    var cgbAcdbbusinessinfoids = [];
    var faultbusinessinfoids = [];

    var highAlarmCount = 0;
    var higherAlarmCount = 0;
    var lowAlarmCount = 0;
    var lowerAlarmCount = 0;
    //获取预警信息
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/monitorcondition/loadMonitorCondition",
        data: $("#entcountform").serializeArray(),
        success: function (data) {
            if (data) {
                var datas = data.datas;
                var faultAlarmCount = 0;

                $.each(datas, function (i, item) {
                    var dangertype = item.DANGERTYPE;
                    var handlestatus = item.HANDLESTATUS;
                    var status = item.STATUS;
                    var alarmcount = item.ALARMCOUNT;
                    var businessinfoid = item.BUSINESSINFOID;
                    if (businessinfoids.indexOf(businessinfoid) === -1) {
                        businessinfoids.push(businessinfoid);
                    }
                    //计算所有的预警
                    totalAlarmCount += alarmcount;


                    if (dangertype === "1") {
                        if (whpbusinessinfoids.indexOf(businessinfoid) === -1) {
                            whpbusinessinfoids.push(businessinfoid);
                        }
                    } else if (dangertype === "2") {
                        if (rqlbusinessinfoids.indexOf(businessinfoid) === -1) {
                            rqlbusinessinfoids.push(businessinfoid);
                        }
                    } else {
                        if (gklbusinessinfoids.indexOf(businessinfoid) === -1) {
                            gklbusinessinfoids.push(businessinfoid);
                        }
                    }


                    //计算高低报的处理数量
                    if (status === "101") {
                        if (gbAdbbusinessinfoids.indexOf(businessinfoid) === -1) {
                            gbAdbbusinessinfoids.push(businessinfoid);
                        }
                        highAlarmCount += item.ALARMCOUNT;
                    } else if (status === "102") {
                        if (gbAdbbusinessinfoids.indexOf(businessinfoid) === -1) {
                            gbAdbbusinessinfoids.push(businessinfoid);
                        }
                        lowAlarmCount += item.ALARMCOUNT;
                    } else if (status === "103") {
                        if (cgbAcdbbusinessinfoids.indexOf(businessinfoid) === -1) {
                            cgbAcdbbusinessinfoids.push(businessinfoid);
                        }
                        higherAlarmCount += item.ALARMCOUNT;
                    } else if (status === "104") {
                        if (cgbAcdbbusinessinfoids.indexOf(businessinfoid) === -1) {
                            cgbAcdbbusinessinfoids.push(businessinfoid);
                        }
                        lowerAlarmCount += item.ALARMCOUNT;
                    } else {
                        if (faultbusinessinfoids.indexOf(businessinfoid) === -1) {
                            faultbusinessinfoids.push(businessinfoid);
                        }
                    }


                    //计算所有的处理数量
                    if (handlestatus === "1") {
                        totalHandleCount += alarmcount;
                        //计算危化品企业的处理数量
                        if (dangertype === "1") {
                            whpHandleCount += alarmcount;
                        } else if (dangertype === "2") {
                            rqlHandleCount += alarmcount;
                        } else {
                            gklHandleCount += alarmcount;
                        }


                        //计算高低报的处理数量
                        if (status === "101" || status === "102") {
                            highAndLowHandleCount += alarmcount;
                        } else if (status === "103" || status === "104") {
                            higherAndLowerHandleCount += alarmcount;
                        } else {
                            faultAlarmHandleCount += alarmcount;
                        }

                    } else {
                        totalNoHandleCount += alarmcount;
                        //计算危化品企业的未处理数量
                        if (dangertype === "1") {
                            whpNoHandleCount += alarmcount;
                        } else if (dangertype === "2") {
                            rqlNoHandleCount += alarmcount;
                        } else {
                            gklNoHandleCount += alarmcount;
                        }
                        //计算高低报的未处理数量
                        if (status === "101" || status === "102") {
                            highAndLowNoHandleCount += alarmcount;
                        } else if (status === "103" || status === "104") {
                            higherAndLowerNoHandleCount += alarmcount;
                        } else {
                            faultAlarmNoHandleCount += alarmcount;
                        }
                    }

                });
                highAndLowCount = highAndLowHandleCount + highAndLowNoHandleCount;
                higherAndLowerCount = higherAndLowerHandleCount + higherAndLowerNoHandleCount;
                faultAlarmCount = faultAlarmHandleCount + faultAlarmNoHandleCount;

                whpAlarmCount = whpHandleCount + whpNoHandleCount;
                rqlAlarmCount = rqlHandleCount + rqlNoHandleCount;
                gklAlarmCount = gklHandleCount + gklNoHandleCount;

                $("#totalAlarmCount").html(totalAlarmCount);
                $("#totalHandleCount").html(totalHandleCount);
                $("#totalNoHandleCount").html(totalNoHandleCount);
                $("#whpHandleCount").html(whpHandleCount);
                $("#rqlHandleCount").html(rqlHandleCount);
                $("#gklHandleCount").html(gklHandleCount);
                $("#whpNoHandleCount").html(whpNoHandleCount);
                $("#rqlNoHandleCount").html(rqlNoHandleCount);
                $("#gklNoHandleCount").html(gklNoHandleCount);
                $("#whpAlarmCount").html(whpAlarmCount);
                $("#rqlAlarmCount").html(rqlAlarmCount);
                $("#gklAlarmCount").html(gklAlarmCount);

                $("#highAndLowHandleCount").html(highAndLowHandleCount);
                $("#higherAndLowerHandleCount").html(higherAndLowerHandleCount);
                $("#faultAlarmHandleCount").html(faultAlarmHandleCount);
                $("#highAndLowNoHandleCount").html(highAndLowNoHandleCount);
                $("#higherAndLowerNoHandleCount").html(higherAndLowerNoHandleCount);
                $("#faultAlarmNoHandleCount").html(faultAlarmNoHandleCount);
                $("#highAndLowCount").html(highAndLowCount);
                $("#higherAndLowerCount").html(higherAndLowerCount);
                $("#faultAlarmCount").html(faultAlarmCount);


                $("#highEntCount").html(gbAdbbusinessinfoids.length);
                $("#higherEntCount").html(cgbAcdbbusinessinfoids.length);
                $("#faultEntCount").html(faultbusinessinfoids.length);
                window.bjdata = [highAlarmCount, lowAlarmCount, higherAlarmCount, lowerAlarmCount, faultAlarmCount];
                window.handledata = [totalHandleCount, totalNoHandleCount];
                changeCountView();
            }
        }
    });

    //获取监测监控企业信息
}
/**
 * 初始化表格数据
 */
function initData() {
    initEntCountByDangerType();
    initMonitorCondition();
}


/**
 * 季度切换
 */
function changQarter() {
    var curYear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;
    var curQarter = getQarter2Month(curMonth);
    switch (curQarter) {
        case 1:
            $("#one").addClass("cur");
            break;
        case 2:
            $("#two").addClass("cur");
            break;
        case 3:
            $("#three").addClass("cur");
            break;
        case 4:
            $("#four").addClass("cur");
            break;
    }
    $("#" + curQarter).addClass("cur");
    $("#qarter").val(curQarter);
    setTimeByQarter(curYear, curQarter)
}

/**
 * 根据季度设置时间
 * @param qarter
 */
function setTimeByQarter(year, qarter) {
    if (qarter == 1) {
        $("#stime").val(year + "-01-01");
        $("#etime").val(year + "-03-31");
    } else if (qarter == 2) {
        $("#stime").val(year + "-04-01");
        $("#etime").val(year + "-06-30");
    } else if (qarter == 3) {
        $("#stime").val(year + "-07-01");
        $("#etime").val(year + "-09-30");
    } else if (qarter == 4) {
        $("#stime").val(year + "-10-01");
        $("#etime").val(year + "-12-31");
    }
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month) {
    if (1 <= month && month <= 3) {
        return 1;
    } else if (4 <= month && month <= 6) {
        return 2;
    } else if (7 <= month && month <= 9) {
        return 3;
    } else {
        return 4;
    }
}
