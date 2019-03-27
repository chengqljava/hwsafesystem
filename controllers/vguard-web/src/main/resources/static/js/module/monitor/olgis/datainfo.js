var DataInfo = function () {

};
var VideoInfo = function () {

};
DataInfo.prototype = {
    getProbeData: function (entid, state) {
        var datalist = monitordatas.loadMacProbeList(entid, state);
        var mydata = [];
        if (datalist == undefined || datalist.length <= 0)return mydata;
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
                    break;
                case "4":
                    arr.status = '预警';
                    break;
                case "100":
                case "101":
                case "102":
                case "103":
                case "104":
                    arr.status = '监测报警';
                    break;
            }
            arr.time = new Date(item.UPDATETIME).format("yyyy-MM-dd HH:mm:ss");
            arr.dataid = item.PROBEID;
            arr.videoid = item.VIDEOID;
            arr.check = "";
            mydata.push(arr);
        }
        return mydata;
    },
    loadDatall: function (entid, state) {
        $.jgrid.defaults.styleUI = 'Bootstrap';
        var mydata = this.getProbeData(entid, state);
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
            colNames: ['编号', '监测点位名称', '监测数值', '状态', '时间', '探头id', '视频id', '查看'],
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
                        return '<a href=' + BASE_URL + "/olgis/gispage/addjcjkDataP/" + obj.dataid + "/" + obj.videoid + "/" + entid + ' target="frm"><img  src=' + BASE_URL + '/images/monitor/gis/check.png/></a>';
                    }
                }
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
        $("#jqGrid").jqGrid('setGridParam', {
            data: mydata
        }).trigger("reloadGrid");
        var self = this;
        var refreshProbeList = setInterval(function () {
            var entdata = self.getProbeData(entid);
            //重新给jqgrid赋值
            $("#jqGrid").jqGrid('setGridParam', {
                data: entdata
            }).trigger("reloadGrid");
        }, 5000);
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
            now = (new Date()).format("HH:mm:ss");

            date.push(now);

            var data = monitordatas.loadRealChroByProbe(dataid);
            var chroval = data[0].CHROVAL;
            dataY.push(chroval);

            if (shift) {
                date.shift();
                dataY.shift();
            }

            now = (new Date()).format("HH:mm:ss");
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