var VideoInfo = function () {};
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
            $("#videoTable").setGridHeight($(window).height()-445);
        });
        var tHeight = $(window).height()-445;

        $("#videoTable").jqGrid({
            datatype: "local",
            height: tHeight,
            rowList: [10, 20, 30],
            colNames: ['序号', '名称', '编号', 'id', '查看'],
            colModel: [
                {name: 'id', index: 'id', sorttype: "int", align: "center", width: '15%'},
                {name: 'name', index: 'name', width: '20%'},
                {name: 'site', index: 'site', width: '20%'},
                {name: 'videoid', index: 'videoid', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '12%',
                    formatter: function (cellvalue, options, obj) {
                        return '<a onclick="showVideoDiv(\'' + obj.videoid + '\',\'' + options.rowId + '\',\'' + entid + '\')" href="javascript:void(0);"><img height="18px" width="18px" src="' + BASE_URL + '/images/monitor/gis/check.png"></a>';
                    }
                },
            ],
            pager: "#videoTablePager",
            viewrecords: true,
            multiselect: true,
            altRows: true,
            autowidth: true

        });
        $("#videoTable").setGridWidth($(window).width()-$(".probeInfo").width()-30);
        $("#videoTable").jqGrid('setGridParam', {
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
                "width": (window.leftTopDivWidth - 205),
                "height": (window.leftTopDivHeight - 100)
            });

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

        //上下区域的高度
        $('.vidCenter').css('height', $(window).height() * 0.6);
        $('.vidCenter1').css('height', $(window).height() * 0.4);
        $(window).resize(function () {
            $('.vidCenter').css('height', $(window).height() * 0.6);
            $('.vidCenter1').css('height', $(window).height() * 0.4);
        });

    }
};