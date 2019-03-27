function initemsisstaskmsg(page) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucisstaskmsg/list",
        dataType: "json",
        data: {
            eventid: $("#eventid").val(),
            page:page||1,
            rows:4,
            sidx:'SENDTIME',
            sord:'asc'
        },
        success: function (data) {
            var emsisstaskmsgTpt = _.template($("#emsisstaskmsgTpt").html());
            data.baseUrl = BASE_URL;
            $("#emsisstaskmsgDiv").html(emsisstaskmsgTpt(data));
            // 事后评估分页
            Page({
                num: data.total, //页码数
                startnum: page||1, //指定页码
                elem: $('#rwfkPage'), //指定的元素
                callback: function (n) { //回调函数 n 为当前页码
                    initemsisstaskmsg(n);
                }
            })
        },
        error : function() {
            parent.toast("初始化信息加载失败!");
        }
    });
}