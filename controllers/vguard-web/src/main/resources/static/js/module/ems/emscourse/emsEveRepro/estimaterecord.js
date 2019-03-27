function initestimaterecord(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucestimaterecord/list",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page:page||1,
            rows:3,
            sidx:'ESTIMATEDATE',
            sord:'asc'
        },
        success: function (data) {
            var estimatereordTpt = _.template($("#estimatereordTpt").html());
            data.baseUrl = BASE_URL;
            $("#estimatereordDiv").html(estimatereordTpt(data));
            // 事后评估分页
            Page({
                num: data.total, //页码数
                startnum: page||1, //指定页码
                elem: $('#shpgPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initestimaterecord(n);
                }
            })
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });
}

/**
 * 详细查看
 */
function displayEstimaterecord(recordid) {
    parent.openWin(BASE_URL + "views/module/ems/emssucestimate/estimaterecordDisplay.html?recordid="+recordid,
        "事故评估详情","70%", "80%");
}