function initemsissscheme(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucissscheme/list",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page: page || 1,
            rows: 5,
            sidx:'createtime',
            sord:'asc'
        },
        success: function (data) {
            var emsissschemeTpt = _.template($("#emsissschemeTpt").html());
            data.baseUrl = BASE_URL;
            $("#emsissschemeDiv").html(emsissschemeTpt(data));
            //
            Page({
                num: data.total, //页码数
                startnum: page || 1, //指定页码
                elem: $('#znfaPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initemsissscheme(n);
                }
            })
        },
        error: function () {
            parent.toast("获取智能方案失败!");
        }
    });
}

function showemsissschemeInfo(schemeid,evaluationid,forecastid,schemename) {
    //TODO 智能方案详情
    parent.openWin(BASE_URL + "views/module/ems/emsissscheme/emsissscheme.html?schemeid=" + schemeid+
    		"&evaluationid="+evaluationid+"&forecastid="+forecastid+"&eventid="+$("#eventid").val(),
    		schemename, "70%", "90%");
}