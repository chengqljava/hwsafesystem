$(function () {


    loadList();
    $("#searchBtn").off("click").on("click", function () {
        var entname = $("#entname").val();
        loadList(entname);
    });

    $('.sgxxHeader').on('click', 'li', function () {
        $('.sgxxHeader li').removeClass('active');
        $(this).addClass('active');
        var kind = $(this).data('kind');

        var entid = $('.factoryListContent ul li.active').data('id');
        console.log(entid,kind);
        if(entid){
            showTable(entid,kind);
        }
    })


});
function showDetail(rskrecordid,type) {
    if ($('.sgxxHeader li.active').data('kind')=='lec') {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeRskDetail.html?rskrecordid=" + rskrecordid+"&riskrating="+type,
            "风险评级详情", "55%", "55%");
    } else if ($('.sgxxHeader li.active').data('kind')=='mes') {
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/gradeMesRskDetail.html?rskrecordid=" + rskrecordid+"&riskrating="+type,
            "风险评级详情", "55%", "55%");
    }


}

function loadList(entname) {
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/tablelist",
        dataType: "json",
        data: {
            entname:entname||""
        },
        success: function (data) {

            if (data) {
                var factoryListTpt = _.template($("#factoryListTpt").html());
                $("#factoryListForm").html(factoryListTpt(data));

                if(data.businessinfos.length>0){
                    $(".factoryListContent ul li:first").addClass('active');
                    showTable(data.businessinfos[0].BUSINESSINFOID);
                }

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
                    var kind = $('.sgxxHeader li.active').data("kind");
                    var entid = $(this).attr("data-id");
                    if(entid){
                        showTable(entid,kind);
                    }
                });

            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}


function showTable(businessinfoid,evaluatetype) {
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/loadEntTable",
        dataType: "json",
        data: {
            businessinfoid: businessinfoid,
            evaluatetype: evaluatetype || 'lec'
        },
        success: function (data) {
            if (data) {
                var tableDivTpt = _.template($("#tableDivTpt").html());
                $("#tableDivForm").html(tableDivTpt(data));

                $('.tableDiv').niceScroll({
                    cursorborder: "#4d86d6",
                    cursorcolor: "#4d86d6",
                    background: false,
                    horizrailenabled: true,
                    autohidemode: false
                }).show().resize();
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}