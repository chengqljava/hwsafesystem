$(function () {
    // 导航种类的点击事件
    $('.nav').on('click', '.navContent', function () {
        var index = $(this).data('index');
        var kind = $(this).data('kind');
        if(kind=="1"){
        	if ($(this).attr('class') == 'navContent visited') {
        		$(this).removeClass('visited');
        		$('#' + index).hide();
        		$('.' + index).attr('src', BASE_URL+'/images/entmenu/noactive.png')
        	} else {
        		$(this).addClass('visited');
        		$('.' + index).attr('src', BASE_URL+'/images/entmenu/active.png');
        		$('#' + index).show();
        		
        	}
        	
        }else{
        	$('.singleNav').removeClass('navActive');
        	var nodeurl = $(this).attr("data-url");
        	var url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid; //进入编辑页面
            if(nodeurl == "/enterprise/entdanexclusive/labelpage")
            	url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid+"/entinfo"; //从企业基础信息进行危化品专属信息
        	$("#contentIframe").attr("src",url);
        }
    })

     var businessinfoid = $('#businessinfoid').val();
    // 左侧导航点击事件
    $('.navGroup').on('click', '.singleNav', function () {
        $('.singleNav').removeClass('navActive');
        $(this).addClass('navActive');
        var nodeurl = $(this).attr("data-url");
        var url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid; //进入编辑页面
        if(nodeurl == "/enterprise/entdanexclusive/labelpage")
        	url = BASE_URL+ nodeurl +"/menuDisplay/"+businessinfoid+"/entinfo"; //从企业基础信息进行危化品专属信息
        $("#contentIframe").attr("src",url);
    })

    // 危险品专属信息的分类点击事件
    $('.navbar').on('click', 'span', function () {
        $('.navbar span').removeClass('active');
        $(this).addClass('active');
        var danexclusiveid = $("#danexclusiveid").val();
        if(danexclusiveid){
        	var url = $(this).data("url");
        	$("#chemIframe").attr("src",url);
        }else{
        	parent.parent.toast("请先填写企业基础信息");
        	return false;
        }
        
    })
    // 折叠菜单
    $('#back').click(function () {
        $('#leftNav').toggle();
        if ($('#leftNav').css('display') == 'block') {
            $('.main').css('width', $(window).innerWidth() - 200);
            $(this).css('left','180px');
        } else {
            $('.main').css('width', $(window).innerWidth())
            $(this).show().css('left','0');                    
        }

    });
    // 预览插件
    $('#companyImg').viewer({
        'title':false,
        'toolbar':false
    });
    $('#companyImg').mouseover(function(){
    	console.log('1111');
    })
    // 企业资格弹窗
//   $('.content').on('click', '.qyzg>img', function () {
//    console.log($(this).attr('src'));
//    var src = $(this).attr('src');
//    $('#body').show();
//    $('#body').append('<div class=\'qyzgTC\' style="position:fixed;width:100%;height:100%;top:0;left:0;background-color:rgba(0, 0, 0, 0.5);box-sizing:border-box;">\n        <div style="position:absolute;width:849px;height:607px;top:50%;left:50%;margin-left:-425px;margin-top:-304px;box-sizing:border-box;">\n            <div style="float:left;width:556px;height:100%;box-sizing:border-box;">\n                <img style=\'height:607px\' src=' + src + ' alt="">\n            </div>\n            <div class="qyzgContent" style="float:right;width:293px;height:100%;box-sizing:border-box;background-color:rgb(72,72,72);padding-left:28px;padding-top:60px;padding-left:26px; padding-right:28px;">\n            <img class=\'qyzgClose\' src=\'./images/close.png\' style=\'position:absolute;top:26px;right:26px;\'>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>证 照 类 型：xxxxxxx</p>\n                <p>记录更新时间：2014-12-25 10:53:50</p>\n                <p class="beizhu">备注：</p>\n                <p class="beizhu">今天是个好日子心想的事儿都能成；今天是个好日子心想的事儿都能成；今天是个好日子心想的事儿都能成；今天是个好日子心想的事儿都能成；今天是个好日子心想的事儿都能成；今天是个好日子心想的事儿都能成；</p>\n            </div>\n        </div>       \n    </div>');
//});

    $('body').on('click','.qyzgClose',function(){
        $('#body').empty();
        $('#body').hide();
    });
    
})