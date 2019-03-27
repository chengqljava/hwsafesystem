var DataInfo = function () {

};
DataInfo.prototype = {
    getProbeData: function (entid, state) {
        var datalist = monitordatas.loadMacProbeList(entid, state);
        var mydata = [];
        if (datalist == undefined || datalist.length <= 0)return mydata;

        // $(".thrDimViewArea").remove(".realWkSpMonPt");
        var appDom = "";
        for (var key in datalist) {
            var item = datalist[key];
            var arr = {};
            arr.id = key;
            arr.name = item.PROBENAME;
            arr.density = item.CHROVAL + "(" + item.UNIT + ")";
            switch (item.STATE) {
                case "0":
                    arr.status = '正常';
                    break;
                case "2":
                    arr.status = '待标定';
                    break;
                case "3":
                case "99":
                case "7":
                    arr.status = '故障报警';
                    arr.isneedHanlder = true;
                    break;
                case "4":
                    arr.status = '预警';
                    arr.isneedHanlder = true;
                    break;
                case "100":
                case "101":
                case "102":
                    arr.status = '监测报警';
                    arr.isneedHanlder = true;
                    break;
            }
            arr.time = new Date(item.UPDATETIME).format("yyyy-MM-dd hh:mm:ss");
            arr.dataid = item.PROBEID;
            arr.videoid = item.VIDEOID;
            arr.check = "";
            arr.notes = item.NOTES || "无";
            arr.unit = item.UNIT || "无";
            arr.mactype = item.MACTYPE;
            arr.top = item.TOP;
            arr.left = item.LEFT;
            arr.probegroup = item.PROBEGROUP;
            mydata.push(arr);
        }
        return mydata;
    },
    loadDatall: function (entid, state) {
        $.jgrid.defaults.styleUI = 'Bootstrap';
        var mydata = this.getProbeData(entid, state);
        this.loadEntProbeCount(entid);
        // alert(JSON.stringify(mydata));
        $(window).bind('resize', function () {
            $(window).unbind("onresize");
            $("#dataTable").setGridHeight($("#info").height());
            $(window).bind("onresize", this);
        });
        var tHeight = $("#info").height();

        $("#dataTable").jqGrid({
            datatype: "local",
            height: tHeight,
            // rowNum: 11,
            rowList: [10, 20, 30],
            colNames: ['编号', '监测点位名称', '监测数值', '状态', '时间', '探头id', '视频id', '查看', '备注', '单位'],
            colModel: [
                {name: 'id', index: 'id', sorttype: "int", align: "center", width: '11%'},
                {name: 'name', index: 'name', width: '30%'},
                {name: 'density', index: 'density', width: '30%'},
                {name: 'status', index: 'status', width: '40%'},
                {name: 'time', index: 'time', width: '50%'},
                {name: 'dataid', index: 'dataid', hidden: true},
                {name: 'videoid', index: 'videoid', hidden: true},
                {
                    name: 'check', index: 'check', align: "center", width: '12%',
                    formatter: function (cellvalue, options, obj) {
                        return '<a onclick="showData(\'' + obj.dataid + '\',\'' + obj.notes + '\',\'' + obj.unit + '\',' + obj.isneedHanlder + ')" href="javascript:void(0)"><img  src=' + BASE_URL + '/images/monitor/gis/check.png></a>';
                    }
                },
                {name: 'notes', index: 'notes', hidden: true},
                {name: 'unit', index: 'unit', hidden: true}
            ],
            pager: "#dataTablePager",
            viewrecords: true,
            multiselect: true,
            altRows: true,
            autowidth: true

        });
        $("#dataTable").jqGrid("clearGridData");
        $("#dataTable").jqGrid('setGridParam', {
            data: mydata
        }).trigger("reloadGrid");
        var self = this;
        // console.log(mydata);

        //需要清除平面图的所有探头，然后添加探头


        var refreshProbeList = setInterval(function () {
            var entdata = self.getProbeData(entid, state);
            self.loadEntProbeCount(entid);
            // alert(JSON.stringify(entdata));
            $("#dataTable").jqGrid("clearGridData");
            //重新给jqgrid赋值
            $("#dataTable").jqGrid('setGridParam', {
                data: entdata
            }).trigger("reloadGrid");
        }, 5000);
        return refreshProbeList;
    },
    loadEntProbeCount:function (businessinfoid) {
        $.ajax({
            type: "post",
            url: BASE_URL + "monitor/macrealtime/loadEntProbeCount",
            dataType: "json",
            data: {businessinfoid:businessinfoid},
            success: function (data) {
                if (data) {
                    var totalProbeCount = 0;
                    var normalProbeCount = 0;
                    var faultProbeCount = 0;
                    var monitorProbeCount = 0;
                    $.each(data,function (i, item) {
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
                }
            },
            error: function () {
                parent.toast("初始化信息加载失败");
            }
        });
    },
    loadVideoPlayer: function (videoids) {
        if (videoids == "null" || videoids == "") {
            $('.videoFrm').css('display', 'none');
            $('.vidCenter').addClass('nosp');
        } else {
            var videoid = videoids.split(',');
            var data = monitordatas.loadVideoInfo(videoid[0]);
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
        }
    },
    loadDataCurve: function (ec, dataid) {
        var myLineChart = ec.init(document.getElementById('chart'));
        var data = monitordatas.loadRealChroByProbe(dataid);
        var chroval = data[0].CHROVAL;
        var probename = data[0].PROBENAME;

        var date = [];
        var now;

        var dataY = [chroval];

        function addData(shift) {
            now = (new Date()).format("hh:mm:ss");

            date.push(now);

            var data = monitordatas.loadRealChroByProbe(dataid);
            var chroval = data[0].CHROVAL;
            dataY.push(chroval);

            if (shift) {
                date.shift();
                dataY.shift();
            }

            now = (new Date()).format("hh:mm:ss");
        }

        for (var i = 1; i < 7; i++) {
            addData();
        }
        var option = {
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data: [probename]
            },
            xAxis: [
                {
                    type: 'category',
                    name: '时间',
                    boundaryGap: false,
                    data: date
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '浓度值',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: probename,
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {type: 'default'}
                        }
                    },
                    data: dataY
                }
            ],
            color: ['rgb(28,220,168)']
        };
        myLineChart.setOption(option);
        var realimeTicket = setInterval(function () {
            addData(true);
            myLineChart.setOption({
                xAxis: {
                    data: date
                },
                series: [{
                    data: dataY
                }]
            });

        }, 5000);
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}