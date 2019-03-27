var VideoInfo = function () {

};

VideoInfo.prototype = {

    loadVideoall: function (entid) {
        $.jgrid.defaults.styleUI = 'Bootstrap';
        var videoall = monitordatas.getVideoAndProbe(entid);
        var videolist = videoall.videoList;
        var mydata = [];
        if (videolist == undefined || videolist.length <= 0)return mydata;
        for (var key in videolist) {
            var item = videolist[key];
            var arr = {};
            arr.id = key;
            arr.name = item.VIDEONAME;
            arr.site = item.VIDEONUM;
            arr.videoid = item.VIDEOID;
            arr.check = "";
            mydata.push(arr);
        }
        $(window).bind('resize', function () {
            $("#jqGrid").setGridWidth($(window).width() * 0.99);
            $("#jqGrid").setGridHeight($(window).height() * 0.85);
        });
        var tHeight = $(window).height() * 0.85;
        $("#jqGrid").jqGrid({
            datatype: "local",
            height: tHeight,
            rowNum: 11,
            rowList: [10, 20, 30],
            colNames: ['序号', '摄像头名称', '摄像头编号', 'id', '查看'],
            colModel: [
                {name: 'id', index: 'id', sorttype: "int", align: "center", width: '8%'},
                {name: 'name', index: 'name', width: '30%'},
                {name: 'site', index: 'site', width: '50%'},
                {name: 'videoid', index: 'videoid', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '12%',
                    formatter: function (cellvalue, options, obj) {
                    	return '<a href=' + BASE_URL + "/olgis/gispage/addjcjkVideo/" + obj.videoid + "/" + options.rowId + "/" + entid + ' target="frm"><img  src="' + BASE_URL + '/images/monitor/gis/check.png"/></a>';
//                      return '<a onclick="displayEntVideo(\'' + obj.videoid + '\',\''+obj.name+ '\',\''+entid+'\')" href="javascript:void(0);"><img  src="' + BASE_URL + '/images/monitor/gis/check.png"/></a>';
                    }
                },
            ],
            pager: "#jqGridPager",
            viewrecords: true,
            multiselect: true,
            altRows: true,
            autowidth: true,
            loadComplete: function () {
                $("#jqGrid").setGridWidth($(window).width() * 0.99);
            }

        });
        console.log(mydata);
        $("#jqGrid").jqGrid('setGridParam', {
            data: mydata
        }).trigger("reloadGrid");
    },
    loadVideo: function (videoid, rowId, entid) {
        if ($(window).parent().find('.mapfrm').attr('src', 'video.html')) {
        }
        var data = monitordatas.loadVideoInfo(videoid);
        $('.videoPop').attr('ip', JSON.stringify(data));
        $('.videoPop').show("slow", "linear", function () {
            VideoInfo.cameraObj = $("#plugin").loadCamera({
                "ip": data[0].IPADDR,
                "port": data[0].PORT,
                "username": data[0].USERNAME,
                "password": data[0].PASSWORD,
                "channel": data[0].VIDEONUM,
                "brand": data[0].BRAND,
                "width": ($(window).width() - 205),
                "height": ($(window).height() * 0.6 - 38)
            });
            /*
             VideoInfo.cameraObj = $("#plugin").loadCamera({
             "ip":"192.168.88.164",
             "port":"8000",
             "username":"admin",
             "password":"hk123456",
             "channel":"1",
             "brand":"1",
             "width":($(window).width() - 205),
             "height":($(window).height()*0.6 - 38)
             });
             */
            if (!VideoInfo.cameraObj.isInstall()) {
                layer.confirm("插件没有安装,请下载安装", {
                    btn: ['下载', '取消'], //按钮
                    shade: false //不显示遮罩
                }, function (index) {
                    window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebComponentsZW";
                    layer.close(index);
                });
                return;
            }
            VideoInfo.cameraObj.play();//播放
        });
        /*//操作
         var flag = 1;
         $('.kz').click(function () {
         if(flag == 1) {
         $('.videoFrm').css('display','block');
         flag = 0;
         }else {
         $('.videoFrm').css('display','none');
         flag = 1;
         }
         });*/
        //上下区域的高度
        $('.vidCenter').css('height', $(window).height() * 0.6);
        $('.vidCenter1').css('height', $(window).height() * 0.4);
        $(window).resize(function () {
            $('.vidCenter').css('height', $(window).height() * 0.6);
            $('.vidCenter1').css('height', $(window).height() * 0.4);
        });
        //表格
        this.loadVideoall(entid);
        $("#jqGrid").setSelection(rowId);
        $("#jqGrid").setGridHeight($('.vidCenter1').height() - 88);

    }
};

/**
 * 海康视频接入
 * @param videoid
 * @param rowId
 * @param entid
 */
function showViode(videoid, rowId, entid){
	if ($(window).parent().find('.mapfrm').attr('src', 'video.html')) {
    }
    var data = monitordatas.loadVideoInfo(videoid);
    $('.videoPop').attr('ip', JSON.stringify(data));
    var previewXml;
    //拼接参数
    if (data) {
    	previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<Message>" +
			    "<Camera>" +
			    	"<IndexCode>"+data[0].INDEXCODE+"</IndexCode>" +
			    "</Camera>" +
			    "<Dev regtype='6' devtype='"+data[0].DEVTYPE+"'></Dev>" +
			    "<Vag IP='"+data[0].VAGIP+"' Port='"+data[0].VAGPORT+"' />" +
			    	"<Media Protocol='0' Stream='0'>" +
			    		"<Vtdu IP='"+data[0].VTDUIP+"' Port='"+data[0].VTDUPORT+"' />" +
			    	"</Media>" +
			    "<Privilege Priority='1' Code='15' />" +
			    "<Option>" +
			    	"<Talk>1</Talk>" +
			    	"<PreviewType>0</PreviewType>" +
			    "</Option>" +
			"</Message>";
	}
    try {
    	//初始化摄像头页面
    	init();
    	//预览
    	StartPlayView(previewXml);
    	
    	//上下区域的高度
        $('.vidCenter').css('height', $(window).height() * 0.6);
        $('.vidCenter1').css('height', $(window).height() * 0.4);
        $(window).resize(function () {
            $('.vidCenter').css('height', $(window).height() * 0.6);
            $('.vidCenter1').css('height', $(window).height() * 0.4);
        });
        //表格
        showVideoall(entid);
        $("#jqGrid").setSelection(rowId);
        $("#jqGrid").setGridHeight($('.vidCenter1').height() - 88);
    } catch (e) {
		// TODO: handle exception
    	layer.confirm("插件没有安装,请下载安装", {
            btn: ['下载', '取消'], //按钮
            shade: false //不显示遮罩
        }, function (index) {
            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
            layer.close(index);
        });
        return;
	}
}

function showVideoall(entid) {
	
    $.jgrid.defaults.styleUI = 'Bootstrap';
    var videoall = monitordatas.getVideoAndProbe(entid);
    var videolist = videoall.videoList;
    var mydata = [];
    if (videolist == undefined || videolist.length <= 0)return mydata;
    for (var key in videolist) {
        var item = videolist[key];
        var arr = {};
        arr.id = key;
        arr.name = item.VIDEONAME;
        arr.site = item.VIDEONUM;
        arr.videoid = item.VIDEOID;
        arr.check = "";
        mydata.push(arr);
    }
    $(window).bind('resize', function () {
        $("#jqGrid").setGridWidth($(window).width() * 0.99);
        $("#jqGrid").setGridHeight($(window).height() * 0.85);
    });
    var tHeight = $(window).height() * 0.85;
    $("#jqGrid").jqGrid({
        datatype: "local",
        height: tHeight,
        rowNum: 11,
        rowList: [10, 20, 30],
        colNames: ['序号', '摄像头名称', '摄像头编号', 'id', '查看'],
        colModel: [
            {name: 'id', index: 'id', sorttype: "int", align: "center", width: '8%'},
            {name: 'name', index: 'name', width: '30%'},
            {name: 'site', index: 'site', width: '50%'},
            {name: 'videoid', index: 'videoid', hidden: true},
            {
                name: 'check', index: 'check', align: "center", width: '12%',
                formatter: function (cellvalue, options, obj) {
//                    return '<a href=' + BASE_URL + "/olgis/gispage/addjcjkVideo/" + obj.videoid + "/" + options.rowId + "/" + entid + ' target="frm"><img  src="' + BASE_URL + '/images/monitor/gis/check.png"/></a>';
                    return '<a onclick="showVideoDiv(\'' + obj.videoid + '\')" href="javascript:void(0);"><img  src="' + BASE_URL + '/images/monitor/gis/check.png"/></a>';
                }
            },
        ],
        pager: "#jqGridPager",
        viewrecords: true,
        multiselect: true,
        altRows: true,
        autowidth: true,
        loadComplete: function () {
            $("#jqGrid").setGridWidth($(window).width() * 0.99);
        }

    });
    console.log(mydata);
    $("#jqGrid").jqGrid('setGridParam', {
        data: mydata
    }).trigger("reloadGrid");
}

function showVideoDiv(videoid) {
//	document.getElementById("PlayViewOCX").Destroy();
    //调整大小
    $("#vidCenter").css({
        "height": window.leftTopDivHeight,
        "width": window.leftTopDivWidth
    });
    $(".header").html("<span class='headerTitle'>摄像头</span><span class='back' onclick='hideContent()'>返回</span>");
    $("#vidCenter").show();
    $("#dataDiv").hide();
    $(".contentArea").hide();
    
    //获取摄像头信息
    var data = monitordatas.loadVideoInfo(videoid);
    var previewXml;
    //拼接参数
    if (data) {
    	previewXml = "<?xml version='1.0' encoding='UTF-8'?>" +
			"<Message>" +
			    "<Camera>" +
			    	"<IndexCode>"+data[0].INDEXCODE+"</IndexCode>" +
			    "</Camera>" +
			    "<Dev regtype='6' devtype='"+data[0].DEVTYPE+"'></Dev>" +
			    "<Vag IP='"+data[0].VAGIP+"' Port='"+data[0].VAGPORT+"' />" +
			    	"<Media Protocol='0' Stream='0'>" +
			    		"<Vtdu IP='"+data[0].VTDUIP+"' Port='"+data[0].VTDUPORT+"' />" +
			    	"</Media>" +
			    "<Privilege Priority='1' Code='15' />" +
			    "<Option>" +
			    	"<Talk>1</Talk>" +
			    	"<PreviewType>0</PreviewType>" +
			    "</Option>" +
			"</Message>";
	}
    $("#videoXmlInfo").val(previewXml);
    console.log(previewXml);
    try {
    	//获取当亲空闲窗口
    	var OCXobj = document.getElementById("PlayViewOCX");
    	var lWndIndex = OCXobj.GetFreePreviewWnd();
    	console.log(lWndIndex);
    	if (lWndIndex == -1) {
    		StartPlayView(previewXml,0);
		}else{
			StartPlayView(previewXml,lWndIndex);
		}
    } catch (e) {
		// TODO: handle exception
    	layer.confirm("插件没有安装,请下载安装", {
            btn: ['下载', '取消'], //按钮
            shade: false //不显示遮罩
        }, function (index) {
            window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebVideo";
            layer.close(index);
        });
        return;
	}
    
    window.clearInterval(window.realimeTicket);
    window.clearInterval(window.textinfoInterval);
}

function displayEntVideo(videoid, videoname,entId) {
	parent.openWin(BASE_URL + "/views/module/monitor/map/jcjk/video.html?videoid="+videoid+"&businessinfoid=" + entId, 
			videoname + "监控视频", "55%", "60%");
}