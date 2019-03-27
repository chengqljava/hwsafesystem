$(function () {

	initPage();
    // 生成滚动条
    scrollResize();
    // 时间轴插件js
    var $timeline_block = $('.cd-timeline-block');
    $timeline_block.each(function () {
        if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
            $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
        }
    });
    $(window).on('scroll', function () {
        $timeline_block.each(function () {
            if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).find(
                    '.cd-timeline-img').hasClass('is-hidden')) {
                $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
            }
        });
    });
    // 时间轴插件js结束

    // 时间轴单个事件的点击事件
    $('body').on('click', '.cd-timeline-content', function () {
        $('.cd-timeline-content').removeClass('active');
        $(this).addClass('active');
        var aID = $(this).data('kind');
        liID = aID + 'LI';
        $('.allKinds li').removeClass('active');
        $("#" + liID).addClass('active');
        $('.allInfo').hide();
        $("." + aID + "AllInfo").show();
        // tab页里第一个元素默认选中
        $("." + aID + "AllInfo").find('.'+ aID + 'Info').removeClass('active');
        $("." + aID + "AllInfo").find('.'+ aID + 'Info').eq(0).addClass('active');

        switch (aID){
        	case 'sgxx':
        		//初始化事故信息模块
        		loadEventInfo();
        		break;
        	case 'sgmn':
        		//初始化事故模拟模块
        		loadSimulation(1);
        		break;
            case 'zypg':
                initResourceInfo(1);
                break;
            case 'zhyc':
                //初始化综合预测模块
                initemscigforecast(1);
                break;
            case 'znfa':
                //初始化智能方案模块
                initemsissscheme(1);
                break;
            case 'yjrw':
                //初始化应急任务模块
                initemsisstask(1);
                break;
            case 'rwfk':
                //初始化任务反馈信息
                initemsisstaskmsg(1);
                break;
            case 'shpg':
                //初始化事故评估
                initestimaterecord(1);
                break;
        }

    });

    // 默认第一页加载，点击事件
    $('.zsjjAllInfo').on('click','.zsjjInfo',function(){
        $('.zsjjInfo').removeClass('active');
        $(this).addClass('active');
        var $id = $(this).data('id');
        window.location.hash = '#'+$id;
        $('.cd-timeline-content').removeClass('active');
        $('#'+$id).find('.cd-timeline-content').addClass('active');
    })
    // 右侧tab页点击事件
    $('.allKinds').on('click', 'li', function () {
        $('.allKinds li').removeClass('active');
        $(this).addClass('active');
        var kind = $(this).data('kind');
        $(".cd-timeline-block .cd-timeline-content").removeClass('active');
        $("." + kind).addClass('active');
        $('.allInfo').hide();
        $("." + kind + "AllInfo").show();
        // tab页里第一个元素默认选中
        $("." + kind + "AllInfo").find('.'+ kind + 'Info').removeClass('active');
        $("." + kind + "AllInfo").find('.'+ kind + 'Info').eq(0).addClass('active');
        // 为所有元素添加点击事件
        if(kind != 'sgxx'){
            $("." + kind + "AllInfo").on('click','.'+kind+'Info',function(){
                $("." + kind + "AllInfo").find('.'+ kind + 'Info').removeClass('active');
                $(this).addClass('active');
                var $id = $(this).data('id');
                window.location.hash = '#'+$id;
                $('.cd-timeline-content').removeClass('active');
                $('#'+$id).find('.cd-timeline-content').addClass('active');
            })
        }
        scrollResize();

        switch (kind){
	        case 'sgxx':
	    		//初始化综合预测模块
	    		loadEventInfo();
	    		break;
	    	case 'sgmn':
	    		//初始化综合预测模块
	    		loadSimulation(1);
	    		break;
            case 'zhyc':
                //初始化综合预测模块
                initemscigforecast(1);
                break;
            case 'zypg':
                initResourceInfo(1);
                break;
            case 'znfa':
                //初始化智能方案模块
                initemsissscheme(1);
                break;
            case 'yjrw':
                //初始化应急任务模块
                initemsisstask(1);
                break;
            case 'rwfk':
                //初始化任务反馈信息
                initemsisstaskmsg(1);
                break;
            case 'shpg':
                //初始化事故评估
                initestimaterecord(1);
                break;
        }




    });

    // 事故切换点击事件
    $('body').on('click', '.eventSelect', function () {
        $('.eventListselect').show(500);
        $(this).hide(500);
        setTimeout(scrollResize, 600);
        $('.eventListselect').on('click', '.eventMarker', function () {
            // 事故列表消失，切换按钮出现
            $('.eventListselect').hide(500);
            $('.eventSelect').show(500);
        })
    })

    // 事故等级点击事件
    $('.accidentKind').on('click', 'li', function () {
        $('.accidentKind li').removeClass('selected');
        $(this).addClass('selected');
        loadallevent(1);
    })

    // 排序方式tab点击事件
    $('.order').on('click', 'li', function () {
        $('.order li').removeClass('selected');
        $(this).addClass('selected');
        loadallevent(1);
    })

    // 筛选条件展开关闭点击事件
    $('.close').on('click', function () {
        var state = $(this).data('state');
        if (state == '0') {
            $('.searchBox').css('height', 150);
            $(this).data('state', '1').css('color', '#5BBBFF');
            $('.accidentListInfo').css('height', 'calc( 100% - 190px )');
            scrollResize();
        } else {
            $('.searchBox').css('height', 50);
            $(this).data('state', '0').css('color', '#0075C7');
            $('.accidentListInfo').css('height', 'calc( 100% - 90px )')
            scrollResize();
        }
    })

    // 单个事故列表单击事件
    $('.accidentListInfo').on('click', '.accident', function () {
        $('.accidentListInfo .accident').removeClass('selected');
        $(this).addClass('selected');
        var eventid = $(this).attr("data-id");
        var eventname = $(this).data("name");
        $("#eventid").val(eventid);
        $("#name").text(eventname);
        initFirst();
        // 事故列表消失，切换按钮出现
        $('.eventListselect').hide(500);
        $('.eventSelect').show(500);
    })

    // //初始化综合预测模块
    // initemscigforecast(1);
    //
    // //初始化智能方案模块
    // initemsissscheme(1);
    //
    // //初始化应急任务模块
    // initemsisstask(1);
    //
    // //初始化任务反馈信息
    // initemsisstaskmsg(1);
    // //初始化事故评估
    // initestimaterecord(1);

});

function initFirst(){
	$('.allKinds li').removeClass('active');
    $('#zsjjLI').addClass('active');
    $('.allInfo').hide();
    $('.zsjjAllInfo').show();
    initPage();
//    loadDutyAlarm();
}

//事故信息
$('#sgxxLI').on('click', 'a',function () {
	loadEventInfo();
})
//事故模拟
$('#sgmnLI').on('click', 'a',function () {
	loadSimulation(1);
})

function toggleShowHide(obj) {
    if ($(obj).data('state') == 0) {
        $(obj).html('收起');
        $(obj).data('state', '1');
    } else {
        $(obj).html('相关任务');
        $(obj).data('state', '0');
    }
    console.log($(obj).parent().parent().find('.xgrw'));
    $(obj).parent().parent().find('.xgrw').toggle(500);
    setTimeout(scrollResize, 600);
}
// 刷新滚动条
function scrollResize() {
    $('.accidentListInfo').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
    $('.cd-area-left').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
    $('.allKindsInfo').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        autohidemode: false
    }).resize();
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}