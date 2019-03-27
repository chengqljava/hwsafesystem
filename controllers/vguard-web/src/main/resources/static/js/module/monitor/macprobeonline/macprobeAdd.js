/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
$(function () {
    var probeid = getQueryString("probeid");
    //获取服务器信息
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macprobe/loadprobeonline",
        dataType: "json",
        data: {
            probeid: probeid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macdeviceinfo = data.macDeviceinfo;
                var macProbe = data.macProbe;
                var macGasmonitor = data.macGasmonitor;
                var isEnt = data.isEnt;
                var entid = macdeviceinfo.ENTID;
                macGasmonitor.controllerid = macProbe.controllerid;

                var deviceinfoTpt = _.template($("#macdeviceinfoTpt").html()),
                    macprobeTpt = _.template($("#macprobeTpt").html()),
                    macgasmonitorTpt = _.template($("#macgasmonitorTpt").html());

                $("#macdeviceinfoForm").html(deviceinfoTpt(macdeviceinfo));
                $("#macprobeForm").html(macprobeTpt(macProbe));
                $("#macgasmonitorForm").html(macgasmonitorTpt(macGasmonitor));

                SelectOption.loadConnectstate("connectstate");
                SelectOption.loadUsestate("usestate");
                SelectOption.loadDevicetype("devicetypeid");
                SelectOption.loadMacBrand("brandid");
                SelectOption.loadMacBrandType("brandtypeid");
                SelectOption.loadProtocol("protocol");
                SelectOption.loadContoller("controllerid");
                SelectOption.loadMonitorGatherTypeResult("probetype");
                SelectOption.loadBaudrate("baudrate");
                SelectOption.loadInterfaceType("interfacetype");
                if (isEnt) {
                    $(".ent").hide();
                    $("#dept").attr("colSpan", 3);
                    SelectOption.loadPlacearea("placeareaid", {businessinfoid: entid});
                } else {
                    SelectTwo.initSelect2($('#entid'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
                }
                $("#lastStepBtn").off('click').on('click', function () {
                    timeShowOrHide(1);
                });
                $("#lastTwoStepBtn").off('click').on('click', function () {
                    timeShowOrHide(2);
                });
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

    $('body').on('click', '.timeMark', function () {
        var index = $(this).data('index');
        var sIndex = $('li.selected:last').data('index');
        if (index > sIndex) {
            return 0;
        }
        timeShowOrHide(index);
    });
    $("#macdeviceinfoForm").validate({
        rules: {
            devicename: {
                required: true
            },
            entid: {
                required: true
            },
            devicetypeid: {
                required: true
            },
            brandid: {
                required: true
            },
            brandtypeid: {
                required: true
            }
        },
        messages: {
            devicename: {
                required: "设备名称不能为空"
            },
            entid: {
                required: "请选择所属企业"
            },
            devicetypeid: {
                required: "请选择设备类型"
            },
            brandid: {
                required: "请选择品牌系列"
            },
            brandtypeid: {
                required: "请选择规格型号"
            }
        },
        submitHandler: function (form) {
            timeShowOrHide(2);
        }
    });
    $("#macprobeForm").validate({
        rules: {
            probename: {
                required: true
            },
            gatherequpname: {
                required: true
            },
            probeaddress: {
                required: true
            }, probetype: {
                required: true
            }, unit: {
                required: true
            }, lowalarmvalue: {
                required: true
            }, highalarmvalue: {
                required: true
            }, superlowalarmvalue: {
                required: true
            }, superhighalarmvalue: {
                required: true
            }, rangemax: {
                required: true
            }, rangelow: {
                required: true
            }

        },
        messages: {
            probename: {
                required: "点位名称不能为空"
            },
            gatherequpname: {
                required: "点位编码不能为空"
            },
            probeaddress: {
                required: "探测器地址不能为空"
            }, probetype: {
                required: "点位类型不能为空"
            }, unit: {
                required: "计量单位不能为空"
            }, lowalarmvalue: {
                required: "低报阈值不能为空"
            }, highalarmvalue: {
                required: "高报阈值不能为空"
            }, superlowalarmvalue: {
                required: "超低报阈值不能为空"
            }, superhighalarmvalue: {
                required: "超高报阈值不能为空"
            }, rangemax: {
                required: "量程上限不能为空"
            }, rangelow: {
                required: "量程下限不能为空"
            }
        },
        submitHandler: function (form) {
            timeShowOrHide(3);
        }
    });
    $("#macgasmonitorForm").validate({
        rules: {
            address: {
                required: true
            },interfacetype:{
                required: true
            },protocol:{
                required: true
            },baudrate:{
                required: true
            },controllerid:{
                required: true
            }
        },
        messages: {
            address: {
                required: "通讯地址不能为空"
            },interfacetype:{
                required: "请选择上传接口类型"
            },protocol:{
                required: "请选择上传协议"
            },baudrate:{
                required: "请选择波特率"
            },controllerid:{
                required: "请选择所属二次仪表"
            }
        },
        submitHandler: function (form) {
            save();
        }
    })


});


/**
 * 保存
 *
 * @returns
 */

function save() {


    var data = $("#macdeviceinfoForm").serializeArray();
    var data2 = $("#macprobeForm").serializeArray();
    var data3 = $("#macgasmonitorForm").serializeArray();
    $.each(data2, function (index, item) {
        data.push({name: item.name, value: item.value});
    });
    $.each(data3, function (index, item) {
        data.push({name: item.name, value: item.value});
    });
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macprobe/saveprobeonline",
        data: data,
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//刷新列表
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });

}


//时间轴显示控制方法
function timeShowOrHide(index) {
    $('.timeMark').each(function (i, item) {
        if (i < index) {
            $(item).addClass('selected');
        }
        else {
            $(item).removeClass('selected');
        }
    })
    switch (index) {
        case 1:
            $('#macdeviceinfo').show();
            $('#macprobe').hide();
            $('#macgasmonitor').hide();
            break;
        case 2:
            $('#macdeviceinfo').hide();
            $('#macprobe').show();
            $('#macgasmonitor').hide();
            break;
        case 3:
            $('#macdeviceinfo').hide();
            $('#macprobe').hide();
            $('#macgasmonitor').show();
            break;
    }
}

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#entid").val(repo.id);

    SelectOption.loadPlacearea("placeareaid", {businessinfoid: repo.id});

    return repo.text;
}


/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
