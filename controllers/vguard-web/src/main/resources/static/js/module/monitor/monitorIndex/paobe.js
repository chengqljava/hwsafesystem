var CHROVAL = 0;
$(function () {
	var Jiframe = window.parent.document.getElementsByTagName('iframe')[0];
    var JSrc = $(Jiframe).attr('src').split('=')[1];
    var probeid = JSrc;
    window.probeid = probeid;
    var myDate = getNowFormatDate();
    $("#startTime").val(myDate);
    $("#endTime").val(myDate);
    $("#dataSelectId").hide();
    initDateSeach("startTime", "endTime");
    $('body').on('click', '#button-label', function () {
        if ($("#toggle-button").is(":checked")) {
            $('.handle_warning').addClass('hide');
        }
        else {
            $('.handle_warning').removeClass('hide');
        }
    });
    $('body').on('click', '.handle_warning', function () {
        $(this).addClass('hide');
        $('.jcsj').addClass('hide');
        $('.handle_info').removeClass('hide');
        $('.handle').removeClass('hide');
        $('#toggle-button').attr('disabled', true);
        $('body').off('click', '#button-label');
    })
    $('.body').on('click', 'radio_btn', function () {
        $('.radio_btn').removeClass('selected');
        $(this).addClass('selected');
    })
    $('body').on('click', '#button-label1', function () {
        if ($("#toggle-button1").is(":checked")) {
            $('.send_msg').addClass('hide');
        }
        else {
            $('.send_msg').removeClass('hide');
        }
    });

    
    loadRealtime(probeid,false);
    loadChroByProbe(probeid,true);
    $('body').on('click', '.handle', function () {
        var $this = this;
        save(probeid, $this);
    })

    $("#jt").click(function () {
        $(this).addClass('active');
        $("#zt").removeClass('active');
        $("#dataSelectId").hide();
        var myDate = getNowFormatDate();
        $("#startTime").val(myDate);
        $("#endTime").val(myDate);
        window.clearInterval(window.loadRealtimId);
        loadChroByProbe(probeid, true);
    });

    $("#zt").click(function () {
        $(this).addClass('active');
        $("#jt").removeClass('active');
        $("#dataSelectId").show();
        var myDate = new Date();
        var endDate = myDate.getTime() - 24 * 60 * 60 * 1000;
        var ztDate = getSmpFormatDateByLong(myDate, false);
        var startDateStr = getSmpFormatDateByLong(endDate, false);
        $("#startTime").val(startDateStr);
        $("#endTime").val(ztDate);
        window.clearInterval(window.loadRealtimId);
        loadChroByProbe(probeid, false);
    });

    $(".applyBtn").click(function () {
        $("#zt").removeClass('active');
        $("#jt").removeClass('active');
        window.clearInterval(window.loadRealtimId);
        loadChroByProbe(probeid,false);
    });
    $('body').on('mousedown', '#monitor_points div', function () {
        var $id = $(this).data('id');
    })
    $('body').on('mouseup', '#monitor_points div', function () {
        var $id = $(this).data('id');
    });

    window.realTimeDataList = [];
});


function loadRealtime(probeid, isInterval) {
    $.ajax({
        type: 'post',
        url: BASE_URL + 'monitor/macprobe/loadproberealtime',
        cache: false,
        dataType: 'json',
        data: {
            probeid: probeid
        },
        global: false,
        success: function (data) {
            if (data) {
                var macRealtime = data.macRealtime;
                $("#probename").text(data.probename);
                var state
                if (macRealtime.STATE == 0) {
                    state = "正常"
                } else if (macRealtime.STATE == 3) {
                    state = "探头故障"
                } else if (macRealtime.STATE == 7) {
                    state = "通讯故障"
                } else if (macRealtime.STATE == 99) {
                    state = "网络故障"
                } else if (macRealtime.STATE == 100) {
                    state = "满量程"
                } else if (macRealtime.STATE == 101) {
                    state = "低报"
                } else if (macRealtime.STATE == 102) {
                    state = "高报"
                } else if (macRealtime.STATE == 103) {
                    state = "超低报"
                } else if (macRealtime.STATE == 104) {
                    state = "超高报"
                }
                var alarmBtn =
                    '<span style="float: right;margin-right: 20px;">' +
                    '确认报警 <input type="checkbox" id="toggle-button" name="switch">' +
                    '<label for="toggle-button" id="button-label" class="not">' +
                    '<span class="circle"></span>' +
                    '<span class="text on"></span>' +
                    '<span class="text off"></span>' +
                    '</label>' +
                    '</span>';
                $("#state").text(state);
                if (macRealtime.STATE > 99) {
                    $("#state").html(state + alarmBtn);
                }
                $("#chroval").text(macRealtime.CHROVAL+macRealtime.UNIT);
                $("#updatetime").text(getSmpFormatDateByLong(new Date().getTime(), true));
                console.log(data.macRealtime.CHROVAL,CHROVAL);
                if(data.macRealtime.CHROVAL == CHROVAL){
                	
                }
                else{
                	CHROVAL = data.macRealtime.CHROVAL;
                	probeChart(data.macRealtime.CHROVAL, data.rangemax, data.rangelow, data.highalarmvalue, data.lowalarmvalue,data.macRealtime.UNIT);
                }
                if (isInterval) {
                    //添加到实时曲线中去
                    window.realTimeDataList.push({
                        PROBENAME: data.probename,
                        CREATETIME: new Date().getTime(),
                        CHROVAL: macRealtime.CHROVAL

                    });
                    if (window.realTimeDataList.length > 50) {
                        window.realTimeDataList.splice(0, 1);
                    }
                    window.dataChartDiv = dataChart(window.realTimeDataList);
                }
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}


function loadChroByProbe(probeid, isInterval) {
    var starttime = $("#startTime").val();
    var endtime = $("#endTime").val();
    $.ajax({
        type: 'post',
        url: BASE_URL + 'monitor/machistory1h/loadchrobyprobe',
        cache: false,
        dataType: 'json',
        data: {
            probeid: probeid,
            starttime: starttime,
            endtime: endtime
        },
        global: false,
        success: function (data) {
            if (isInterval) {
                window.loadRealtimId = window.setInterval('loadRealtime(window.probeid,true)', 5000);
            }
            if (data) {
                // if (data.chrobyprobeList.length > 0) {
                    window.realTimeDataList = data.chrobyprobeList;
                    window.dataChartDiv = dataChart(data.chrobyprobeList);
                    $("#data_charts").show();
                    $("#data_charts_text").hide();
                // } else {
                //     $("#data_charts").hide();
                //     $("#data_charts_text").text("暂无数据！");
                // }

            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}

/**
 * 保存
 * @returns
 */
function save(probeid, $this) {
    var notes = $("#notes").val();
    var handleway = $("#handleway").val();
    var handletime = $("#handletime").val();
    if (notes == '' || handleway == '' || handletime == '') {
        parent.toast('报警原因、处理措施和时间不能为空！')
    }
    else {
        $.ajax({
            type: "post",
            url: BASE_URL + "monitor/macalarmmonitor/handlealarmbyprob",
            data: {
                probeid: probeid,
                notes: notes,
                handleway: handleway,
                handletime: handletime
            },
            success: function (data) {
                if (data.success == true) {
                    $('.handle_info').addClass('hide');
                    $('.jcsj').removeClass('hide');
                    $($this).addClass('hide');
                    parent.toast(data.msg);//弹出提示信息
                } else {
                    parent.toast(data.msg);
                }
                // dataChart(window.realTimeDataList);
                // $(window).resize(function(){
                if(window.dataChartDiv){
                    window.dataChartDiv.resize();
                }
                // })
            },
            error: function () {
                parent.toast("编辑失败");
            }
        });
    }
}
function initDateSeach(startTime,endTime){
	// 日期插件
    $('#daterange-btn').daterangepicker({
    	ranges: {
            '最近7天': [moment().subtract(6,'days'), moment()],
            '最近30天': [moment().subtract(29,'days'), moment()],
            '最近60天': [moment().subtract(60,'days'), moment()]
        }, 
    	 locale: {
             format: 'YYYY/MM/DD',
             applyLabel: "确认",
             cancelLabel: "取消",
             fromLabel: "开始时间",
             toLabel: "结束时间",
             weekLabel: '周',
             customRangeLabel : '自定义时间',
             daysOfWeek:["日","一","二","三","四","五","六"],
             monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
         },
        startDate: moment(),
        endDate: moment(),
        maxDate: new Date(),
        firstDay: 1
    	},
    	function (start, end, label) {
    		$("#"+startTime).val(start.format('YYYY-MM-DD'));
    		$("#"+endTime).val(end.format('YYYY-MM-DD'));
			$('#daterange-btn span').html(start.format('YYYY/MM/DD') + '-' + end.format('YYYY/MM/DD'));
	        window.clearInterval(window.loadRealtimId);
	        loadChroByProbe(probeid, false);
     	}
    );
}