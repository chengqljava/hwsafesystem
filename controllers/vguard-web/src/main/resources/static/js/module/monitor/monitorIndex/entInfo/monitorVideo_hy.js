/**
 * Created by Administrator on 2017-11-09.
 */
var MonitorVideo = function (businessinfoid) {
    this.businessinfoid = businessinfoid;
};

MonitorVideo.prototype = {
    loadVideoInfo:function () {
        var data;
        $.ajax({
            type: 'post',
            url: BASE_URL + '/monitor/macvideo/load',
            cache: false,
            dataType: 'json',
            data: {"businessinfoid": this.businessinfoid},
            global: false,
            async: false,
            success: function (map) {
                if (map.length == 0 || map == null) {
                    window.wxc.xcConfirm("该企业没有视频或探头数据！", window.wxc.xcConfirm.typeEnum.info);
                } else {
                    data = map;
                }
            },
            error: function (err) {
                //window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
            }
        });
        return data;
    },
    updateGrid:function () {
        var data = this.loadVideoInfo();
        var datas = data.videolist;
        
        //为返回值添加编号统计
        if (datas && 0 < datas.length) {
        	_.map(datas, function(tmpData, index) {
        		tmpData.videonum = (parseInt(index) + 1);
        	});
        }
        
        var entid = this.businessinfoid;
        $.jgrid.defaults.styleUI = 'Bootstrap';
        $(window).bind('resize', function () {
//            $("#videoTable").setGridHeight($(window).height()-500 <100?100:$(window).height()-500);
        	$("#videoTable").setGridHeight($("#videoInfo").height() - 40);
        });
//        var tHeight = $(window).height()-520 <100?100:$(window).height()-500 ;
        var tHeight = $("#videoInfo").height() - 40;
        var tWidth = $("#videoInfo").width() - 15;
        $("#videoTable").jqGrid({
            datatype: "local",
            height: tHeight,
            width: tWidth,
            rowNum: 100,
//            rowList: [10, 20, 30],
            colNames: ['编号', '名称',  'id', '查看','高度','宽度', '类型'],
            colModel: [
                {name: 'videonum', index: 'videonum', width: '20%'},
                {name: 'videoname', index: 'videoname', width: '50%'},
                {name: 'videoid', index: 'videoid', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '25%',
                    formatter: function (cellvalue, options, obj) {
//                        return '<a onclick="showVideoDiv(\'' + obj.videoid + '\')" href="javascript:void(0);"><img height="18px" width="18px" src="' + BASE_URL + '/images/monitor/gis/check.png"></a>';
                        return '<a onclick="showVideoDiv(\''+obj.videoid+'\',\''+obj.videoType+'\',\''+obj.videoname+'\')" href="javascript:void(0);"><img height="18px" width="18px" src="' + BASE_URL + '/images/monitor/gis/check.png"></a>';
                    }
                },{
                    name: 'top', index: 'top', width: '20%',hidden:true
                },{
                    name: 'left', index: 'left', width: '20%',hidden:true
                },{
                    name: 'videoType', index: 'left', width: '20%',hidden:true
                }
            ],
//            pager: "#videoTablePager",
//            viewrecords: true,
//            multiselect: true,
            altRows: true,
            autowidth: true,
            scrollOffset: 5,
            loadComplete:function(){
            	tableScrollResize();
            }

        });
//        $("#videoTable").setGridWidth($(window).width()-$(".probeInfo").width()-30);
        $("#videoTable").jqGrid('setGridParam', {
            data: datas
        }).trigger("reloadGrid");
        
        //向企业平面图添加视频点位
        this.initVideoPoint(datas);
    },
    initVideoPoint:function (data) {
    	//向企业平面图添加视频点位
        var arr = [];
        $.each(data, function (i, item) {
            $(item).each(function () {
                arr.push(this);
            });
        })
        var appDom = "";
        _.map(arr, function (num, key) {
            var top = num.top * (window.lastImgHeight | $(window).height() - 191 ) / 100 - 19;
            var left = num.left * (window.lastImgWidth | $(window).width()-408 ) / 100;
            appDom += (
            "<div data-blg='" + num.videoid + "' id='" + num.videoid + "' data-pName='" + num.videoname +
            "' data-type='2' " + "' data-top='" + num.top + "' " + "' data-left='" + num.left + "' " + "data-hikType='" + num.videoType + "' " +
            " class='realWkSpMonPt' data-unit='' data-notes='' style='top: " + top + "px;left: " + left + "px;'>" +
            "		<div class='demo3'></div>" +
            "	<div class='ptTitle ptTitleHide' style='z-index: 99999;'>" + num.videoname +
            "	</div>" +
            "	<div class='demo2'>" +
            "	</div>" +
            "</div>");

        });
        $("#viewArea").append(appDom);
    },

    loadVideo: function (videoid) {
        var data = monitordatas.loadVideoInfo(videoid);
        $('.videoPop').attr('ip', JSON.stringify(data));
        $('.videoPop').show("slow", "linear", function () {
            MonitorVideo.cameraObj = $("#plugin").loadCamera({
                "ip": data[0].IPADDR,
                "port": data[0].PORT,
                "username": data[0].USERNAME,
                "password": data[0].PASSWORD,
                "channel": data[0].VIDEONUM,
                "brand": data[0].BRAND,
                "width": (window.leftTopDivWidth-228),
                "height": (window.leftTopDivHeight-108)
            });

            if (!MonitorVideo.cameraObj.isInstall()) {
                layer.confirm("插件没有安装,请下载安装", {
                    btn: ['下载', '取消'], //按钮
                    shade: false //不显示遮罩
                }, function (index) {
                    window.location.href = BASE_URL + "/monitor/macmonitormap/downloadWebComponentsZW";
                    layer.close(index);
                });
                return;
            }
            MonitorVideo.cameraObj.play();//播放
        });
        $('.vidCenter').css('height', window.leftTopDivHeight-70);
        $(window).resize(function () {
            $('.vidCenter').css('height', window.leftTopDivHeight-70);
        });
        return MonitorVideo.cameraObj;
    }
};
