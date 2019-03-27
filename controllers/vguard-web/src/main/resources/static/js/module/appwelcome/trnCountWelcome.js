function initTrnData(year, userid) {
    var classData = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    var classEntValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var classTrnValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var classTrnUserValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    $.ajax({
        type: "post",
        url: BASE_URL + "mobile/etswelcome/trnCount",
        data: {year: year, userid: userid},
        success: function (data) {
            if (data) {

                var userType = data.userType;
                var series = [];
                var legendData = [];

                $.each(data.datas, function (i, item) {
                    switch (item.MONTHNAME) {
                        case '一月':
                            classEntValue[0] = item.ENTCOUNT;
                            classTrnValue[0] = item.TRNCOUNT;
                            classTrnUserValue[0] = item.TRNUSERCOUNT;
                            break;
                        case '二月':
                            classEntValue[1] = item.ENTCOUNT;
                            classTrnValue[1] = item.TRNCOUNT;
                            classTrnUserValue[1] = item.TRNUSERCOUNT;
                            break;
                        case '三月':
                            classEntValue[2] = item.ENTCOUNT;
                            classTrnValue[2] = item.TRNCOUNT;
                            classTrnUserValue[2] = item.TRNUSERCOUNT;
                            break;
                        case '四月':
                            classEntValue[3] = item.ENTCOUNT;
                            classTrnValue[3] = item.TRNCOUNT;
                            classTrnUserValue[3] = item.TRNUSERCOUNT;
                            break;
                        case '五月':
                            classEntValue[4] = item.ENTCOUNT;
                            classTrnValue[4] = item.TRNCOUNT;
                            classTrnUserValue[4] = item.TRNUSERCOUNT;
                            break;
                        case '六月':
                            classEntValue[5] = item.ENTCOUNT;
                            classTrnValue[5] = item.TRNCOUNT;
                            classTrnUserValue[5] = item.TRNUSERCOUNT;
                            break;
                        case '七月':
                            classEntValue[6] = item.ENTCOUNT;
                            classTrnValue[6] = item.TRNCOUNT;
                            classTrnUserValue[6] = item.TRNUSERCOUNT;
                            break;
                        case '八月':
                            classEntValue[7] = item.ENTCOUNT;
                            classTrnValue[7] = item.TRNCOUNT;
                            classTrnUserValue[7] = item.TRNUSERCOUNT;
                            break;
                        case '九月':
                            classEntValue[8] = item.ENTCOUNT;
                            classTrnValue[8] = item.TRNCOUNT;
                            classTrnUserValue[8] = item.TRNUSERCOUNT;
                            break;
                        case '十月':
                            classEntValue[9] = item.ENTCOUNT;
                            classTrnValue[9] = item.TRNCOUNT;
                            classTrnUserValue[9] = item.TRNUSERCOUNT;
                            break;
                        case '十一月':
                            classEntValue[10] = item.ENTCOUNT;
                            classTrnValue[10] = item.TRNCOUNT;
                            classTrnUserValue[10] = item.TRNUSERCOUNT;
                            break;
                        case '十二月':
                            classEntValue[11] = item.ENTCOUNT;
                            classTrnValue[11] = item.TRNCOUNT;
                            classTrnUserValue[11] = item.TRNUSERCOUNT;
                            break;
                    }
                });

                if (userType === "ENT") {
                    //证明是企业
                    legendData = ['培训数', '人员数'];
                    series = [
                        {
                            name: '培训数',
                            type: 'bar',
                            data: classTrnValue,
                        },
                        {
                            name: '人员数',
                            type: 'bar',
                            data: classTrnUserValue,
                        }
                    ];
                } else {
                    //证明是政府
                    legendData = ['企业数', '培训数'];
                    series = [
                        {
                            name: '企业数',
                            type: 'bar',
                            data: classEntValue,
                        },
                        {
                            name: '培训数',
                            type: 'bar',
                            data: classTrnValue,
                        }
                    ];
                }


                initTrnCount(classData, legendData, series);
            }
        }
    });
}
/**
 * Created by Administrator on 2017/10/27.
 */
$(function () {

    var userid = getQueryString("userid");
    var year = getQueryString("year");
    var isDetail = getQueryString("isDetail");
    //默认为详情
    if (isDetail == true || isDetail == "true") {
        var currYear = new Date().getFullYear();
        var html = "<li>" + (currYear - 4) + "</li>" +
            "<li>" + (currYear - 3) + "</li>" +
            "<li>" + (currYear - 2) + "</li>" +
            "<li>" + (currYear - 1) + "</li>" +
            "<li class='cur'>" + currYear + "</li>";
        $(".year").html(html);

        $(".year").on("click", "li", function () {
            $(this).addClass('cur').siblings().removeClass('cur');
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
            console.log($(this).text(), userid);
            initTrnData($(this).text(), userid);
        });
    } else {
        $("#yearDiv").hide();
    }


    initTrnData(year, userid);


});

function initTrnCount(classData, legendData, series) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('trnChart'));
    var option = {
        color: ["#89E5AE", "#8AD2FC"],
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            orient: 'vertical',
            data: legendData,
            x: 'right'
        },
        xAxis: [
            {
                name: '月份',
                type: 'category',
                data: classData
            }
        ],
        yAxis: [
            {
                name: '数量',
                type: 'value'
            }
        ],
        series: series
    };
    myChart.setOption(option);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}