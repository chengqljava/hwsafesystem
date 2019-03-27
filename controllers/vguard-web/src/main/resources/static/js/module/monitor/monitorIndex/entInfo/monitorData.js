/**
 * Created by Administrator on 2017-11-09.
 */
var faultCount = 0;
var MonitorData = function (businessinfoid) {
    this.businessinfoid = businessinfoid;
};
MonitorData.prototype = {
    //获取探头和实时数据
    loadProbesAndRealDatas :function (state) {
        var data;
        $.ajax({
            type: 'post',
            url: BASE_URL + '/monitor/macrealtime/loadProbeAndRealData',
            cache: false,
            dataType: 'json',
            data: {"businessinfoid": this.businessinfoid,"state":state},
            global: false,
            async: false,
            success: function (map) {
                if (map == null) {
                	parent.toast("该企业没有探头数据！");
//                    window.wxc.xcConfirm("该企业没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
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
    updateGrid:function (state) {
        var monitorData = this;
        var data = this.loadProbesAndRealDatas(state);
        var entProbeCount = data.entProbeCount;
        var datas = data.datas;
        
        //为返回值添加编号统计
        if (datas && 0 < datas.length) {
        	_.map(datas, function(tmpData, index) {
        		tmpData.PROBENUM = (parseInt(index) + 1);
        	});
        }
        
        $.jgrid.defaults.styleUI = 'Bootstrap';
        $(window).bind('resize', function () {
            $(window).unbind("onresize");
            $("#dataTable").setGridHeight($("#info").height() - 40);
            $(window).bind("onresize", this);
        });
        var tHeight = $("#info").height() - 40;
        $("#dataTable").jqGrid({
            datatype: "local",
            height: tHeight,
             rowNum: 100,
//            rowList: [10, 20, 30],
            colNames: ['编号', '监测点位名称', '检测值', '状态', '时间', '探头id',  '查看', '备注', '单位','高度','宽度'],
            colModel: [
                {name: 'PROBENUM', index: 'PROBENUM', width: '11%'},
                {name: 'PROBENAME', index: 'name', width: '30%'},
                {name: 'CHROVAL', index: 'CHROVAL', width: '30%'},
                {name: 'STATE', index: 'STATE', width: '40%',
                formatter:function (cellvalue, options, obj) {
                    return monitorData.getStateName(obj.STATE);
                }},
                {name: 'UPDATETIME', index: 'UPDATETIME', width: '50%',
                formatter:function (cellvalue,options,obj) {
                    return new Date(obj.UPDATETIME).format("yyyy-MM-dd hh:mm:ss")

                }},
                {name: 'PROBEID', index: 'PROBEID', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '12%',
                    formatter: function (cellvalue, options, obj) {
                        return '<a onclick="showData(\'' + obj.PROBEID + '\',\'' + obj.NOTES + '\',\'' + obj.UNIT + '\',' + obj.STATE + ')" href="javascript:void(0)"><img  src=' + BASE_URL + '/images/monitor/gis/check.png></a>';
                    }
                },
                {name: 'NOTES', index: 'NOTES', hidden: true},
                {name: 'UNIT', index: 'UNIT', hidden: true},
                {name:'TOP',index:'TOP',hidden:true},
                {name:'LEFT',index:'LEFT',hidden:true}
            ],
            pager: "#dataTablePager",
            viewrecords: true,
//            multiselect: true,
            altRows: true,
            autowidth: true,
            scrollOffset: 5,
            loadComplete:function(){
            	tableScrollResize();
            }

        });
        $("#dataTable").jqGrid("clearGridData");
        $("#dataTable").jqGrid('setGridParam', {
            data: datas
        }).trigger("reloadGrid");

        //初始化表头的设备数量
        var totalProbeCount = 0;
        var normalProbeCount = 0;
        var faultProbeCount = 0;
        var monitorProbeCount = 0;
        $.each(entProbeCount,function (i, item) {
            totalProbeCount+=item.PROBECOUNT;
            switch (item.STATE){
                case "0":
                    normalProbeCount+=item.PROBECOUNT;
                    break;
                case "3":
                case "7":
                case "99":
                    faultProbeCount+=item.PROBECOUNT;
                    break;
                case "4":
                case "100":
                case "101":
                case "102":
                case "103":
                case "104":
                    monitorProbeCount+=item.PROBECOUNT;
                    break;
            }
        });
        $("#totalProbeCount").html(totalProbeCount);
        $("#normalProbeCount").html(normalProbeCount);
        $("#faultProbeCount").html(faultProbeCount);
        $("#monitorProbeCount").html(monitorProbeCount);
        if(faultProbeCount>0 && faultProbeCount>faultCount){
        	var audio = document.getElementById("alarm");
            audio.play();            
            $('#button-label').click(function(){
                $('#button-label').toggleClass('not');
                if($('#button-label').attr('class') != 'not'){
                	audio.pause();
                }else{
                	audio.play();
                }
            });
            faultCount = faultProbeCount;
        }

        //初始化点位的显示
        // this.initProbePoint(datas);
        return datas;

    },
    initProbePoint:function (datas) {


        var arr = [];
        $.each(datas, function (i, item) {
            $(item).each(function () {
                arr.push(this);
            });
        });
        var appDom = "";
        _.map(arr, function (num, key) {
            switch (num.STATE) {
                case "3":
                case "99":
                case "7":
                case "4":
                case "100":
                case "101":
                case "102":
                case "103":
                case "104":
                    num.isneedHanlder = true;
                    break;
            }
            var top = num.TOP * (window.lastImgHeight | $(window).height() - 191) / 100 - 19;
            var left = num.LEFT * (window.lastImgWidth | $(window).width()-408) / 100;

            if (num.isneedHanlder == true || num.isneedHanlder === "true") {

                appDom += (
                "<div data-blg='" + num.PROBEID + "' id='" + num.PROBEID + "' data-pName='" + num.PROBENAME +
                "' data-type='1' " + "' data-top='" + num.TOP + "' " + "' data-left='" + num.LEFT + "' " +
                " class='realWkSpMonPt' data-unit='" + num.UNIT + "' data-isneedhandle='" + num.isneedHanlder + "' data-notes='" + num.NOTES + "' style='top: " + top + "px;left: " + left + "px;'>" +
                "		<div class='demo1'></div>" +
                "	<div class='ptTitle ptTitleHide' style='z-index: 99999;'>" + num.PROBENAME +
                "	</div>" +
                "	<div class='pointWarning'>" +
                "	</div>" +
                "	<div class='redPoint'>" +
                "	</div>" +
                "</div>");

                setInterval(warning, 40);
                function warning(i) {
                	$('.realWkSpMonPt .pointWarning').each(function(){
                		var size = $(this).height();
                        var opacity = $(this).css('opacity');
                        opacity -= 0.01;
                        if (opacity < 0.7) {
                            opacity = 0.9;
                        }
                        $(this).css({
                            'margin-left': -size / 2,
                            'margin-top': -size / 2,
                            'opacity': opacity,
                        })
                	})
//                    var size = $('.pointWarning').height();
//                    var opacity = $('.pointWarning').css('opacity');
//                    opacity -= 0.01;
//                    if (opacity < 0.7) {
//                        opacity = 0.9;
//                    }
//                    size += 1;
//                    if (size > 50) {
//                        size = 0;
//                        opacity = 1;
//                    }
//                    $('.pointWarning').css({
//                        'height': size,
//                        'width': size,
//                        'margin-left': -size / 2,
//                        'margin-top': -size / 2,
//                        'opacity': opacity,
//                    })
                }
            } else {
                appDom += (
                "<div data-blg='" + num.PROBEID + "' id='" + num.PROBEID + "' data-pName='" + num.PROBENAME + "'" +
                " data-pType='" + num.PROBEGROUP + "' data-type='1' " + "' data-top='" + num.TOP + "' " + "' data-left='" + num.LEFT + "' " +
                " class='realWkSpMonPt' data-unit='" + num.UNIT + "' data-isneedhandle='" + num.isneedHanlder + "' data-notes='" + num.NOTES + "' style='top: " + top + "px;left: " + left + "px;'>" +
                "		<div class='demo1'></div>" +
                "	<div class='ptTitle ptTitleHide' style='z-index: 99999;'>" + num.PROBENAME +
                "	</div>" +
                "	<div class='demo2'>" +
                "	</div>" +
                "</div>");
            }

        });
        $("#viewArea").append(appDom);
    },
    getStateName:function (state) {
        var stateName = "";
        switch (state){
            case "0":
                stateName = "正常";
                break;
            case "3":
                stateName = "探头故障";
                break;
            case "7":
                stateName = "通讯故障";
                break;
            case "99":
                stateName = "网络故障";
                break;
            case "4":
                stateName = "预警";
                break;
            case "100":
                stateName = "满量程";
                break;
            case "101":
                stateName = "低报";
                break;
            case "102":
                stateName = "高报";
                break;
            case "103":
                stateName = "超低报";
                break;
            case "104":
                stateName = "超高报";
                break;
        }
        return stateName;
    }
};
