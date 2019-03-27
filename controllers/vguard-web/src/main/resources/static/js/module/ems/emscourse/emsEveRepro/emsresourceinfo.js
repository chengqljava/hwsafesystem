function initResourceInfo(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/resource/list",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page: page || 1,
            rows: 5,
            sidx:'createtime',
            sord:'asc'
        },
        success: function (data) {
            var emsresourceinfoTpt = _.template($("#emsresourceinfoTpt").html());
            data.baseUrl = BASE_URL;
            $("#emsresourceinfoDiv").html(emsresourceinfoTpt(data));
            // 事后评估分页
            Page({
                num: data.total, //页码数
                startnum: page || 1, //指定页码
                elem: $('#zypgPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initResourceInfo(n);
                }
            });

        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function showemsResourceInfo(evaluationid) {
    //TODO 资源评估详情
    parent.openWin(BASE_URL + "views/module/ems/emscourse/emsresource.html?evaluationid=" + evaluationid+"&eventid="+$("#eventid").val(),
        "资源评估详情", "70%", "70%");
}