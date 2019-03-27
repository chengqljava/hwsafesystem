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
                	parent.toast("该企业没有视频或探头数据！");
//                    window.wxc.xcConfirm("该企业没有视频或探头数据！", window.wxc.xcConfirm.typeEnum.info);
                } else {
                    data = map;
                }
            },
            error: function (err) {
            	parent.toast("网络繁忙，请稍后再试！");
                //window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
            }
        });
        return data;
    },
    updateGrid:function () {
        var data = this.loadVideoInfo();
        var datas =data.videolist;
        var entid = this.businessinfoid;
        $.jgrid.defaults.styleUI = 'Bootstrap';
        
        var tableHeight = $(window).height() - $(".pcheck").height() - 122 - 33;
        $(window).resize(function () {
            $("#videoTable").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 122 - 33);
            $("#videoTable").jqGrid("setGridWidth", $(window).width() * 0.9);
            $("#box").width($(window).width());
			$("#plugin").width($(window).width() - 200);
//            $("#plugin").height($(window).height() - 40 - 38 - 40 - ($(window).height() - $(".pcheck").height() - 122 - 33) - 60);
//            $("#plugin").width($(window).width() - 200);
        });
//        $(window).bind('resize', function () {
//            $("#videoTable").setGridHeight($(window).height()-500);
//        });
//        var tHeight = $(window).height()-500;
        $("#videoTable").jqGrid({
            datatype: "local",
            height: tableHeight,
            rowList: [10, 20, 30],
            colNames: ['编号', '名称',  'id', '查看','高度','宽度'],
            colModel: [
                {name: 'videonum', index: 'videonum', width: '5%'},
                {name: 'videoname', index: 'videoname', width: '15%'},
                {name: 'videoid', index: 'videoid', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '10%',
                    formatter: function (cellvalue, options, obj) {
                        return '<a onclick="showVideo(\'' + obj.videoid + '\',\''+obj.videoname+'\')" href="javascript:void(0);"><img height="18px" width="18px" src="' + BASE_URL + '/images/monitor/gis/check.png"></a>';
                    }
                },{
                    name: 'top', index: 'top', width: '20%',hidden:true
                },{
                    name: 'left', index: 'left', width: '20%',hidden:true
                }
            ],
            pager: "#videoTablePager",
            viewrecords: true,
            multiselect: true,
            altRows: true,
            autowidth: true,
            loadComplete: function() {
    			if($(window).width() < 400) {
    				$('.ui-jqgrid-htable').css({"width":"900"});
    				$("#videoTable").css({"width":"900"});
    				$("#videoTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
    				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
    			} else {
    				$("#videoTable").jqGrid('setGridWidth', $(window).width() * 0.9);
    			}
    			
    			$("#box").width($(window).width());
    			$("#plugin").width($(window).width() - 200);
    			
    			//默认显示第一个摄像头视频
    	        var allRowObjArr =  $("#videoTable").jqGrid("getRowData");
    	        if (allRowObjArr && 0 < allRowObjArr.length) {
    	        	showVideoDiv(allRowObjArr[0].videoid, allRowObjArr[0].videoname, function() {
    	        		$("html, body").animate({scrollTop: 0}, "slow");
    	        	});
    	        }
    		}
        });
//        $("#videoTable").setGridWidth($(window).width()-$(".probeInfo").width()-30);
        $("#videoTable").jqGrid('setGridParam', {
            data: datas
        }).trigger("reloadGrid");
        this.initVideoPoint(datas);
    },
    initVideoPoint:function (data) {
        var arr = [];
        $.each(data, function (i, item) {
            $(item).each(function () {
                arr.push(this);
            });
        })
        var appDom = "";
        _.map(arr, function (num, key) {
            var top = num.top * (window.lastImgHeight | $(window).height() - 180) / 100;
            var left = num.left * (window.lastImgWidth | $(window).width()-408) / 100;
            appDom += (
            "<div  data-blg='" + num.videoid + "' id='" + num.videoid + "' data-pName='" + num.videoname +
            "' data-type='" + num.mactype + "' " + "' data-top='" + num.top + "' " + "' data-left='" + num.left + "' " +
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
    loadVideo: function(videoid) {
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
                "width": $(window).width() - 200,
                "height": $(window).height() * 0.7
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
//        $('.vidCenter').css('height', window.leftTopDivHeight-70);
//        $(window).resize(function () {
//            $('.vidCenter').css('height', window.leftTopDivHeight-70);
//        });
        return MonitorVideo.cameraObj;
    }
};

function loadVideoInfo(businessinfoid) {
    var data;
    $.ajax({
        type: 'post',
        url: BASE_URL + '/monitor/macvideo/load',
        cache: false,
        dataType: 'json',
        data: {"businessinfoid":businessinfoid},
        global: false,
        async: false,
        success: function (map) {
            if (map.length == 0 || map == null) {
            	parent.toast("该企业没有视频或探头数据！");
//                window.wxc.xcConfirm("该企业没有视频或探头数据！", window.wxc.xcConfirm.typeEnum.info);
            } else {
                data = map;
            }
        },
        error: function (err) {
        	parent.toast("网络繁忙，请稍后再试！");
            //window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
        }
    });
    return data;
}


function updateGridVideo(entid) {
    var data = loadVideoInfo(entid);
    var datas =data.videolist;
    $.jgrid.defaults.styleUI = 'Bootstrap';
    
    var tableHeight = $(window).height() - $(".pcheck").height() - 122 - 33;
    $(window).resize(function () {
        $("#videoTable").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 122 - 33);
        $("#videoTable").jqGrid("setGridWidth", $(window).width() * 0.9);
        $("#box").width($(window).width());
		$("#plugin").width($(window).width() - 200);
    });
    $("#videoTable").jqGrid({
        datatype: "local",
        height: tableHeight,
        rowList: [10, 20, 30],
        colNames: ['编号', '名称',  'id', '查看','高度','宽度'],
        colModel: [
            {name: 'videonum', index: 'videonum', width: '5%'},
            {name: 'videoname', index: 'videoname', width: '15%'},
            {name: 'videoid', index: 'videoid', hidden: true},
            {
                name: 'check', index: 'check', align: "center", width: '10%',
                formatter: function (cellvalue, options, obj) {
                    return '<a onclick="showVideo(\'' + obj.videoid + '\',\''+obj.videoname+'\')" href="javascript:void(0);"><img height="18px" width="18px" src="' + BASE_URL + '/images/monitor/gis/check.png"></a>';
                }
            },{
                name: 'top', index: 'top', width: '20%',hidden:true
            },{
                name: 'left', index: 'left', width: '20%',hidden:true
            }
        ],
        pager: "#videoTablePager",
        viewrecords: true,
        multiselect: true,
        altRows: true,
        autowidth: true,
        loadComplete: function() {
			if($(window).width() < 400) {
				$('.ui-jqgrid-htable').css({"width":"900"});
				$("#videoTable").css({"width":"900"});
				$("#videoTable").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "scroll","height":"350"});
				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
			} else {
				$("#videoTable").jqGrid('setGridWidth', $(window).width() * 0.9);
			}
			
			$("#box").width($(window).width());
			$("#plugin").width($(window).width() - 200);
			
			//默认显示第一个摄像头视频
	        var allRowObjArr =  $("#videoTable").jqGrid("getRowData");
	        if (allRowObjArr && 0 < allRowObjArr.length) {
	        	showVideoDiv(allRowObjArr[0].videoid, allRowObjArr[0].videoname, function() {
	        		$("html, body").animate({scrollTop: 0}, "slow");
	        	});
	        }
		}
    });
    $("#videoTable").jqGrid('setGridParam', {
        data: datas
    }).trigger("reloadGrid");
    initVideoPoint(datas);
}

function initVideoPoint(data) {
    var arr = [];
    $.each(data, function (i, item) {
        $(item).each(function () {
            arr.push(this);
        });
    })
    var appDom = "";
    _.map(arr, function (num, key) {
        var top = num.top * (window.lastImgHeight | $(window).height() - 180) / 100;
        var left = num.left * (window.lastImgWidth | $(window).width()-408) / 100;
        appDom += (
        "<div  data-blg='" + num.videoid + "' id='" + num.videoid + "' data-pName='" + num.videoname +
        "' data-type='" + num.mactype + "' " + "' data-top='" + num.top + "' " + "' data-left='" + num.left + "' " +
        " class='realWkSpMonPt' data-unit='' data-notes='' style='top: " + top + "px;left: " + left + "px;'>" +
        "		<div class='demo3'></div>" +
        "	<div class='ptTitle ptTitleHide' style='z-index: 99999;'>" + num.videoname +
        "	</div>" +
        "	<div class='demo2'>" +
        "	</div>" +
        "</div>");

    });
    $("#viewArea").append(appDom);
}

/**
 * 显示所选视频通道视频
 * @param videoid
 * @param videoname
 * @param callback
 */
function showVideo(videoid, videoname) {
	showVideoDiv(videoid, videoname, function() {
		$(".main").animate({scrollTop: 0}, "slow");
	});
}