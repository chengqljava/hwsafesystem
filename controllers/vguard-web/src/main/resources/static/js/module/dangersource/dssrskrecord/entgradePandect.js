$(function () {
	showTable();
    $('.sgxxHeader').on('click', 'li', function () {
        $('.sgxxHeader li').removeClass('active');
        $(this).addClass('active');
        var kind = $(this).data('kind');
        showTable(kind);
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

function showTable(evaluatetype) {
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/loadEntTable",
        dataType: "json",
        data: {
            evaluatetype: evaluatetype || 'lec'
        },
        success: function (data) {
            if (data) {
                var tableDivTpt = _.template($("#tableDivTpt").html());
                $("#tableDivForm").html(tableDivTpt(data));
                
                //没有区域时表格自适应 
                var eventcategorys = data.eventcategorys;
                var areaAndSpecifics = data.areaAndSpecifics;
                if (eventcategorys.length == 0 && areaAndSpecifics.length == 0) {
					$(".dangerTable table tr td").css({"max-width":"176px","width":"176px"});
				}
               
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