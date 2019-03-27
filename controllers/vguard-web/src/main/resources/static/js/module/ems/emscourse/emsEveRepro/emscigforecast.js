function initemscigforecast(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/historylist",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page: page || 1,
            rows: 4,
            sidx:'createdate',
            sord:'asc'
        },
        success: function (data) {
            var emsissforecastTpt = _.template($("#emsissforecastTpt").html());
            data.baseUrl = BASE_URL;
            $("#emsissforecastDiv").html(emsissforecastTpt(data));
            // 事后评估分页
            Page({
                num: data.total, //页码数
                startnum: page || 1, //指定页码
                elem: $('#zhycPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initemscigforecast(n);
                }
            });

        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function showemscigforecaseInfo(forecastid) {
    //TODO 智能方案详情
    parent.openWin(BASE_URL + "views/module/ems/emscigforecast/emscigforecast.html?forecastid=" + forecastid+"&eventid="+$("#eventid").val(),
        "综合预测详情", "70%", "70%");
}