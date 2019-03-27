/**
 * Created by Administrator on 2017/12/25.
 */
$(document).ready(function () {
    var businessinfoid = getQueryString("businessinfoid");
    if(businessinfoid==null){
        $.ajax({
            type: "post",
            url: BASE_URL + "enterprise/entbusinessinfo/load",
            data: {

            },
            success: function (data) {
                businessinfoid = data;
                initData(businessinfoid);
            },
            error: function () {
                parent.toast("加载失败");
            }
        });
    }else{
        initData(businessinfoid);
    }




});

function initData(businessinfoid){
    //获取企业基本信息
    initEntBaseInfo(businessinfoid);
    //获取企业平面图列表
    initPlanImg(businessinfoid);
    //获取资格资质列表
    initEntPermitImg(businessinfoid);
    //获取危险特性信息
    initEntDangerCharaInfo(businessinfoid);
    //获取安全生产投入信息
    initSafeInvestInfo(businessinfoid);
    //获取获奖信息
    initSafeRewardInfo(businessinfoid);
    //获取安全生产管理机构信息
    initSafeOrgInfo(businessinfoid);
    //获取安全生产责任人信息
    initSafePersonInfo(businessinfoid);
    //获取安全生产管理人员信息
    initSafeManagerInfo(1,businessinfoid);
    //获取特种作业人员信息
//    initEntoperatorInfo(1,businessinfoid);
    //获取特种设备作业人员信息
    initEntequipoperatorInfo(businessinfoid);
    //获取安全生产标准化建设信息
    initEntsafestandardInfo(businessinfoid);
    //获取安全生产管理资料
    initEntsafeprodataInfo(businessinfoid);
    //获取压力容器
//    initEntequipprevesselInfo(businessinfoid);
    //获取压力管道
//    initEntequipconduitInfo(businessinfoid);
    //获取压力阀
//    initEntequipsafevalveInfo(businessinfoid);
    //获取叉车
//    initEntequipforkfiltInfo(businessinfoid);
    //获取锅炉
//    initEntequipbolierInfo(businessinfoid);
//    起重机械
//    initEntequipliftingmacinfo(businessinfoid);
    //电梯
//    initEntequipelevatorInfo(businessinfoid);
    //获取安全风险较大作业信息
    initEntsaferiskinfo(businessinfoid);
    //危化品基础信息和证书信息
    initEntdanexclusiveInfo(businessinfoid);
    //行政处罚信息
    initentsafepunishInfo(1,businessinfoid);
    //隐患信息
    inithdigovregistraInfo(1,businessinfoid);
    //应急信息
    initemssuceventInfo(1,businessinfoid);

    initentsafemgrprojInfo(businessinfoid);

    //安全生产管理机构图
    initEntSafeorgAttach(businessinfoid);
    //应急疏散图
    initEntFirebugoutAttach(businessinfoid);
    //排污许可
    // initEpiSewageLicenceInfo(businessinfoid);
    //固体废物记录
    // initSolidwasterRecord(businessinfoid);
    //环评及行政许可
    // initContructionInfo(businessinfoid);

    //环境敏感点记录
    // initEpiSensitiveRecordInfo(businessinfoid);

    //环保应急预案
    initEpiemgPlan(businessinfoid);

    imgBecome();

    $(window).resize(imgBecome);

    function imgBecome() {
        var width = $('.companyImg img').eq(0).width() * 0.75;
        $('.companyImg img').css({
            "height": width
        });
        $(".hjxxdiv").niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: "#c7c7c7",
            hidecursordelay: 400,
            railoffset:true,
            autohidemode: false
        }).resize();
        $(".navbar").niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: "#c7c7c7",
            hidecursordelay: 400,
            railoffset:true,
            autohidemode: false
        }).resize();
    }

    setTimeout(function () {
        $(".hjxxdiv").niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: "#c7c7c7",
            hidecursordelay: 400,
            railoffset:true,
            autohidemode: false
        }).show();
    }, 2000)
    $('#nav').onePageNav();
}


function initentsafemgrprojInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafemgrproj/loadAttachs/' + businessinfoid,
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
//            console.log(data);

            var entsafemgrprojTpt = _.template($("#entsafemgrprojTpt").html());
            data.baseUrl = BASE_URL;
            $("#entsafemgrproj").html(entsafemgrprojTpt(data));


        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function inithdigovregistraInfo(startnum,businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/hidden/hidhiddendanger/hidlist',
        cache: false,
        dataType: 'json',
        data: {
            entid: getQueryString("businessinfoid"),
            page: startnum || 1,
            rows: 5
        },
        global: false,
        success: function (data) {
//            console.log(data);

            var hdigovregistraTpt = _.template($("#hdigovregistraTpt").html());
            $("#hdigovregistra").html(hdigovregistraTpt(data));

            $("#hjxxtable").niceScroll({
                cursorborder: "#4d86d6",
                cursorcolor: "#4d86d6",
                background: "#c7c7c7",
                hidecursordelay: 400,
                railoffset:true
            }).show().resize();

            if (data.total == 1) {
                $("#hdiPager").hide();
            } else {
                Page({
                    num: data.total, //页码数
                    startnum: startnum || 1, //指定页码
                    elem: $('#page2'), //指定的元素
                    callback: function (n) { //回调函数
                        //console.log(n);

                        inithdigovregistraInfo(n,businessinfoid);
                    }
                });
            }


        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initentsafepunishInfo(startnum,businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafepunish/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: startnum || 1,
            rows: 5
        },
        global: false,
        success: function (data) {
//            console.log(data);

            var entsafepunishTpt = _.template($("#entsafepunishTpt").html());
            $("#entsafepunish").html(entsafepunishTpt(data));

            if (data.total == 1) {
                $("#punishPager").hide();
            } else {
                Page({
                    num: data.total, //页码数
                    startnum: startnum || 1, //指定页码
                    elem: $('#page3'), //指定的元素
                    callback: function (n) { //回调函数
                        //console.log(n);
                        initentsafepunishInfo(n,businessinfoid);
                    }
                });
            }

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initemssuceventInfo(startnum,businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/ems/emssucevent/loadByBusinessinfoid',
        cache: false,
        dataType: 'json',
        data: {
            businessinfoid: businessinfoid,
            page: startnum || 1,
            rows: 5
        },
        global: false,
        success: function (data) {
//            console.log(data);

            var emssuceventTpt = _.template($("#emssuceventTpt").html());
            $("#emssucevent").html(emssuceventTpt(data));

            if (data.total == 1) {
                $("#eventPager").hide();
            } else {
                Page({
                    num: data.total, //页码数
                    startnum: startnum || 1, //指定页码
                    elem: $('#page1'), //指定的元素
                    callback: function (n) { //回调函数
                        //console.log(n);
                        initemssuceventInfo(n,businessinfoid);
                    }
                });
            }

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 输送管道
 * @param danexclusiveid
 */
function initentrunningpipInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entrunningpip/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var entrunningpipTpt = _.template($("#entrunningpipTpt").html());
            $("#entrunningpip").html(entrunningpipTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 储罐
 * @param danexclusiveid
 */
function initentstoragetankInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entstoragetank/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var entstoragetankTpt = _.template($("#entstoragetankTpt").html());
            $("#entstoragetank").html(entstoragetankTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


/**
 * 库区
 * @param danexclusiveid
 */
function initentwarehouseInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entwarehouse/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var entwarehouseTpt = _.template($("#entwarehouseTpt").html());
            $("#entwarehouse").html(entwarehouseTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


/**
 * 化工装置
 * @param danexclusiveid
 */
function initentcheengdeviceInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entcheengdevice/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log("化工装置", data.datas);

            var entcheengdeviceTpt = _.template($("#entcheengdeviceTpt").html());
            $("#entcheengdevice").html(entcheengdeviceTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


/**
 * 危险化工工艺
 * @param danexclusiveid
 */
function initentdancheproInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entdanchepro/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var entdancheproTpt = _.template($("#entdancheproTpt").html());
            $("#entdanchepro").html(entdancheproTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


/**
 * 三同时
 * @param danexclusiveid
 */
function initEntthreemeanInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entthreemean/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var entthreemeanTpt = _.template($("#entthreemeanTpt").html());
            $("#entthreemean").html(entthreemeanTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 危险作业
 * @param danexclusiveid
 */
function initEnthazardousjobInfo(danexclusiveid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/enthazardousjob/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);

            var enthazardousjobTpt = _.template($("#enthazardousjobTpt").html());
            $("#enthazardousjob").html(enthazardousjobTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 危险化学品
 * @param danexclusiveid
 */
function initEntdanchemicalInfo(danexclusiveid, supervision) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entdanchemical/list',
        cache: false,
        dataType: 'json',
        data: {
            danexclusiveid: danexclusiveid,
            page: 1,
            rows: 1000,
            supervision: supervision
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);
            if (supervision == 1) {
                var entsuperdanchemicalTpt = _.template($("#entsuperdanchemicalTpt").html());
                $("#entsuperdanchemical").html(entsuperdanchemicalTpt(data));
            } else {
                var entdanchemicalTpt = _.template($("#entdanchemicalTpt").html());
                $("#entdanchemical").html(entdanchemicalTpt(data));
            }
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 危化品专属信息
 */
function initEntdanexclusiveInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entdanexclusive/loadEntdanexcluiveInfo/' + businessinfoid,
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
//            console.log(data);
            var entdanexclusiveTpt = _.template($("#entdanexclusiveTpt").html());
            $("#entdanexclusive").html(entdanexclusiveTpt(data));
            var entDanexclusive = data.entDanexclusive;
            //获取危险化学品类型
            initEntdanchemicalInfo(entDanexclusive.danexclusiveid || "-1", "");
            //获取重点监管危险化学品类型
            initEntdanchemicalInfo(entDanexclusive.danexclusiveid || "-1", 1);
            //获取危险作业
            initEnthazardousjobInfo(entDanexclusive.danexclusiveid || "-1");
            //判断是否有三同时
            if (entDanexclusive.three == 1) {
                //获取三同时信息
                initEntthreemeanInfo(entDanexclusive.danexclusiveid || "-1");
            }
            //判断是否选择了危险化工工艺
            if (entDanexclusive.cheprocess) {
                initentdancheproInfo(entDanexclusive.danexclusiveid || "-1");
            }

            //化工装置
            if (entDanexclusive.cheinstallations == 1) {
                initentcheengdeviceInfo(entDanexclusive.danexclusiveid || "-1");
            }
            //库区
            initentwarehouseInfo(entDanexclusive.danexclusiveid || "-1");
            //储罐
            initentstoragetankInfo(entDanexclusive.danexclusiveid || "-1");
            //输送管道
            initentrunningpipInfo(entDanexclusive.danexclusiveid || "-1");


            var value = 0;
            if (entDanexclusive.cheinstallations) {
                value++;
            }

            if (entDanexclusive.storagemedium) {
                value++;
            }

            if (entDanexclusive.pipage) {
                value++;
            }

            if (entDanexclusive.mainfacility) {
                value++;
            }

            if (entDanexclusive.cheprocess) {
                value++;
            }

            if (entDanexclusive.emeequipment) {
                value++;
            }

            $("#entdanexclusiveprogress").attr("value", value);

            $("#entdanexclusivexvalue").text((value / 7 * 100).toFixed(1) + "%");


        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntsaferiskinfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsaferiskinfo/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data.datas);
            var entsaferiskinfoTpt = _.template($("#entsaferiskinfoTpt").html());
            $("#entsaferiskinfo").html(entsaferiskinfoTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipbolierInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipbolier/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipbolierTpt = _.template($("#entequipbolierTpt").html());
            $("#entequipbolier").html(entequipbolierTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipforkfiltInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipforkfilt/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipforkfiltTpt = _.template($("#entequipforkfiltTpt").html());
            $("#entequipforkfilt").html(entequipforkfiltTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipsafevalveInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipsafevalve/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipsafevalveTpt = _.template($("#entequipsafevalveTpt").html());
            $("#entequipsafevalve").html(entequipsafevalveTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipconduitInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipconduit/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipconduitTpt = _.template($("#entequipconduitTpt").html());
            $("#entequipconduit").html(entequipconduitTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipprevesselInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipprevessel/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipprevesselTpt = _.template($("#entequipprevesselTpt").html());
            $("#entequipprevessel").html(entequipprevesselTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipliftingmacinfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipliftingmac/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipliftingmacTpt = _.template($("#entequipliftingmacTpt").html());
            $("#entequipliftingmac").html(entequipliftingmacTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipelevatorInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipelevator/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipelevatorTpt = _.template($("#entequipelevatorTpt").html());
            $("#entequipelevator").html(entequipelevatorTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntsafeprodataInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafeprodata/list',
        cache: false,
        dataType: 'json',
        data: {
            businessinfoid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entsafeprodataTpt = _.template($("#entsafeprodataTpt").html());
            $("#entsafeprodata").html(entsafeprodataTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntsafestandardInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafestandard/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entsafestandardTpt = _.template($("#entsafestandardTpt").html());
            $("#entsafestandard").html(entsafestandardTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntequipoperatorInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entequipoperator/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entequipoperatorTpt = _.template($("#entequipoperatorTpt").html());
            $("#entequipoperator").html(entequipoperatorTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntoperatorInfo(startnum,businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entoperator/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: getQueryString("businessinfoid"),
            page: startnum || 1,
            rows: 5
        },
        global: false,
        success: function (data) {

            var entoperatorTpt = _.template($("#entoperatorTpt").html());
            $("#entoperator").html(entoperatorTpt(data));

            if (data.total == 1) {
                $("#entoperatorPager").hide();
            } else {
                Page({
                    num: data.total, //页码数
                    startnum: startnum || 1, //指定页码
                    elem: $('#entoperatorpage'), //指定的元素
                    callback: function (n) { //回调函数
//                        console.log(n);
                        initEntoperatorInfo(n,businessinfoid);
                    }
                });
            }

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initSafeManagerInfo(startnum,businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafemanager/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: startnum || 1,
            rows: 5
        },
        global: false,
        success: function (data) {

            var entsafemanagerTpt = _.template($("#entsafemanagerTpt").html());
            $("#aqscglry").html(entsafemanagerTpt(data));

            if (data.total == 1) {
                $("#entsafemanagerPager").hide();
            } else {
                Page({
                    num: data.total, //页码数
                    startnum: startnum || 1, //指定页码
                    elem: $('#entsafemanagerpage'), //指定的元素
                    callback: function (n) { //回调函数
//                        console.log(n);
                        initSafeManagerInfo(n,businessinfoid);
                    }
                });
            }


        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initSafePersonInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafeperson/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entsafepersonTpt = _.template($("#entsafepersonTpt").html());
            $("#aqsczrr").html(entsafepersonTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initSafeOrgInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafeorg/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entsafeorgTpt = _.template($("#entsafeorgTpt").html());
            $("#aqscgljg").html(entsafeorgTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initSafeRewardInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafereward/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entrewardinfoTpt = _.template($("#entrewardinfoTpt").html());
            $("#hjxx").html(entrewardinfoTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initSafeInvestInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entsafeinvestinfo/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {

            var entsafeinvestinfoTpt = _.template($("#entsafeinvestinfoTpt").html());
            $("#aqsctrxx").html(entsafeinvestinfoTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntProharm() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entproharm/loadProHarm/' + getQueryString("businessinfoid"),
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
//            console.log("entProharm", data.entProharm);
            var entProharmTpt = _.template($("#entProharmTpt").html());
            $("#entProharm").html(entProharmTpt(data));
            var entProharm = data.entProharm;
            var value = 0;
            if (entProharm.manageorg) {
                value++;
            }

            if (entProharm.managefulltime) {
                value++;
            }

            if (entProharm.physicals) {
                value++;
            }
            if (entProharm.manageparttime) {
                value++;
            }
            if (entProharm.empqty) {
                value++;
            }
            if (entProharm.womanqty) {
                value++;
            }

            if (entProharm.contactqty) {
                value++;
            }

            if (entProharm.womancontactqty) {
                value++;
            }

            if (entProharm.proharmqty) {
                value++;
            }

            if (entProharm.womanharmqty) {
                value++;
            }

            if (entProharm.declare) {
                value++;
            }

            if (entProharm.declarecode) {
                value++;
            }

            if (entProharm.healthfile) {
                value++;
            }

            if (entProharm.inputperson) {
                value++;
            }

            if (entProharm.telephone) {
                value++;
            }

            $("#entproharmprogress").attr("value", value);
            $("#entproharmvalue").text((value / 15 * 100).toFixed(1) + "%");

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntDangerCharaInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entdangerchara/showEntDangerChara/' + businessinfoid,
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
//            console.log(data.entDangerchara);
            var entdangercharaTpt = _.template($("#entdangercharaTpt").html());
            $("#wxtx").html(entdangercharaTpt(data));
            //判断企业是否有职业危害健康信息
            var entDangerchara = data.entDangerchara;
            if (entDangerchara.occdisease == 1) {
                initEntProharm();
            } else {
                $("#zybwhjk").hide();
                $("#entProharm").hide();
                $("#entProharmLi").hide();
            }

            //判断企业是否存在特种设备
            if (entDangerchara.speequipment == 1) {

            } else {
                //隐藏特种设备
            }
            //判断企业是否存在危险设备


            //计算采集率
            var resultmax = 16;
            var value = 0;
            if (entDangerchara.danger) {
                value++;
                if (entDangerchara.danger == 1) {
                    resultmax++;
                    if (entDangerchara.dangertype) {
                        value++;
                    }
                }
            }

            if (entDangerchara.chemical) {
                value++;
                if (entDangerchara.chemical == 1) {
                    resultmax++;
                    if (entDangerchara.chemicaltype) {
                        value++;
                    }
                }
            }
            if (entDangerchara.empchemical) {
                value++;
            }
            if (entDangerchara.occdisease) {
                value++;
            }
            if (entDangerchara.stive) {
                value++;
                if (entDangerchara.stivetype == 1) {
                    resultmax++;
                    if (entDangerchara.stivetype) {
                        value++;
                    }
                }
            }
            if (entDangerchara.speequipment) {
                value++;
                if (entDangerchara.speequipment == 1) {
                    resultmax++;
                    if (entDangerchara.speequipment) {
                        value++;
                    }
                }
            }

            if (entDangerchara.danequipment) {
                value++;
                if (entDangerchara.danequipment == 1) {
                    resultmax++;
                    if (entDangerchara.danequiptype) {
                        value++;
                    }
                }
            }
            if (entDangerchara.dryingroom) {
                value++;
            }
            if (entDangerchara.plant) {
                value++;
            }
            if (entDangerchara.warehouse) {
                value++;
            }
            if (entDangerchara.workshop) {
                value++;
            }
            if (entDangerchara.interspace) {
                value++;
            }
            if (entDangerchara.mess) {
                value++;
            }
            if (entDangerchara.gasbottle) {
                value++;
            }
            if (entDangerchara.liquidrefrigeration) {
                value++;
            }
            if (entDangerchara.personintensive) {
                value++;
            }
            $("#wxtxprogress").attr("value", value);
            $("#wxtxprogress").attr("max", value);
            $("#wxtxvalue").text(value / resultmax * 100 + "%");

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initEntPermitImg(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entpermitphoto/list',
        cache: false,
        dataType: 'json',
        data: {
            page: 1,
            rows: 100,
            entid: businessinfoid
        },
        global: false,
        success: function (data) {
        	console.log(data);
            data.baseUrl = BASE_URL;
            var entpermitTpt = _.template($("#entpermitTpt").html());
            $("#qyzgxx").html(entpermitTpt(data));

            $('#qualificationAll').viewer({
                'toolbar': false,
                'title': false
            });

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

function initPlanImg(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entplan/list',
        cache: false,
        dataType: 'json',
        data: {
            page: 1,
            rows: 100,
            entid: businessinfoid
        },
        global: false,
        success: function (data) {
            data.baseUrl = BASE_URL;
            var entplanTpt = _.template($("#entplanTpt").html());
            $("#qypmt").html(entplanTpt(data));

            $('#companyImg').viewer({
                'toolbar': false,
                'title': false
            });

        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 初始化企业基本信息
 */
function initEntBaseInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/enterprise/entbaseinfo/showBaseInfo/' + businessinfoid,
        cache: false,
        dataType: 'json',
        global: false,
        success: function (data) {
        	$('#entName').html(data.entBusinessinfo.entname);
            var entbusinessinfoTpt = _.template($("#entbusinessinfoTpt").html());
            $("#entbusinessinfo").html(entbusinessinfoTpt(data));

            $("#hyjgtable").niceScroll({
                cursorborder: "#4d86d6",
                cursorcolor: "#4d86d6",
                background: "#c7c7c7",
                railoffset:true,
                hidecursordelay: 400
            }).show().resize();

            var hyjgxxTpt = _.template($("#hyjgxxTpt").html());
            $("#hyjgxx").html(hyjgxxTpt(data));

            var jbxxTpt = _.template($("#jbxxTpt").html());
            $("#jbxx").html(jbxxTpt(data));

            var entBusinessinfo = data.entBusinessinfo;
            var entBaseinfo = data.entBaseinfo;
            loadDirectorTypeAllSelect(entBusinessinfo.city, entBusinessinfo.area, entBusinessinfo.street, entBusinessinfo.community, entBusinessinfo.directortypeid);


            //导出
            $("#output").click(function () {
                // var index = layer.load(1, {
                //     shade: [0.5,'#fff'] //0.1透明度的白色背景
                // });
                html2canvas($("#main"), {
                    onrendered: function (canvas) {

                        var contentWidth = canvas.width;
                        var contentHeight = canvas.height;

                        //一页pdf显示html页面生成的canvas高度;
                        var pageHeight = contentWidth / 595.28 * 841.89;
                        //未生成pdf的html页面高度
                        var leftHeight = contentHeight;
                        //pdf页面偏移
                        var position = 0;
                        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                        var imgWidth = 555.28;
                        var imgHeight = 555.28 / contentWidth * contentHeight;

                        var pageData = canvas.toDataURL('image/jpeg', 1.0);

                        var pdf = new jsPDF('', 'pt', 'a4');
                        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                        //当内容未超过pdf一页显示的范围，无需分页
                        if (leftHeight < pageHeight) {
                            pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
                        } else {
                            while (leftHeight > 0) {
                                pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
                                leftHeight -= pageHeight;
                                position -= 841.89;
                                //避免添加空白页
                                if (leftHeight > 0) {
                                    pdf.addPage();
                                }
                            }
                        }
                        // layer.close(index);
                        pdf.save('content.pdf');
                    }
                })
            });
            //计算采集率
            var result = 0;
            if (entBusinessinfo.industryorgname) {
                result = result + 1;
            }
            if (entBusinessinfo.subjection) {
                result = result + 1;
            }
            if (entBaseinfo.econindustryname) {
                result = result + 1;
            }
            if (entBusinessinfo.directortypeid) {
                result = result + 2;
            }
            if (entBaseinfo.isstandard) {
                result = result + 1;
            }
            if (entBusinessinfo.islittle) {
                result = result + 1;
            }
            if (entBusinessinfo.isscale) {
                result = result + 1;
            }
            $("#hyjgprogress").attr("value", result);
            $("#hyjgvalue").text((result / 8 * 100).toFixed(2)+"%");

            result = 0;
            if (entBusinessinfo.legalperson) {
                result++;
            }
            if (entBusinessinfo.phone) {
                result++;
            }
            if (entBusinessinfo.validstartdate) {
                result++;
            }
            if (entBusinessinfo.registernum) {
                result++;
            }
            if (entBusinessinfo.postcode) {
                result++;
            }
            if (entBusinessinfo.naissancedate) {
                result++;
            }
            if (entBaseinfo.economictypename) {
                result++;
            }
            if (entBusinessinfo.registermoney) {
                result++;
            }
            if (entBaseinfo.entscale) {
                result++;
            }
            if (entBaseinfo.placearea) {
                result++;
            }
            if (entBaseinfo.empqty) {
                result++;
            }
            if (entBaseinfo.insurenumber) {
                result++;
            }
            if (entBaseinfo.fixedmoney) {
                result++;
            }
            if (entBaseinfo.yearincome) {
                result++;
            }
            if (entBusinessinfo.longitude) {
                result++;
            }
            if (entBusinessinfo.latitude) {
                result++;
            }
            if (entBusinessinfo.enttype) {
                result++;
            }
            if (entBusinessinfo.address) {
                result++;
            }
            if (entBusinessinfo.mainproduct) {
                result++;
            }
            if (entBaseinfo.mainmaterial) {
                result++;
            }
            $("#jbxxprogress").attr("value", result);
            $("#jbxxvalue").text((result / 20 * 100).toFixed(2)+"%");
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


function loadDirectorTypeAllSelect(city, area, street, community, directortypeid) {
    if (directortypeid != null && directortypeid != "") {
        $.ajax({
            type: "post",
            url: BASE_URL + '/system/sysdirectortype/loadDirectorById',
            dataType: 'json',
            data: {
                "directortypeid": directortypeid,
                "citycode": city,//市
                "areacode": area,//区县
                "streetcode": street,//街道办
                "communitycode": community//社区
            },
            global: false,
            async: false,
            success: function (json) {
                if (json != null) {
                    $('#directortypeid').text(json.resultname);//行业主管分类
                    $('#managertypename').text(json.managertypename);//监管分类
                }
            },
            error: function () {

            }
        });
    } else {
        $('#directortypename').val("");
    }
}

//初始化安全生产管理机构图
function initEntSafeorgAttach(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/ent/entsafeorgattach/list',
        cache: false,
        dataType: 'json',
        data: {
            businessinfoid: businessinfoid
        },
        global: false,
        success: function (json) {
            var data = {};
            data.datas = json;
            data.baseUrl = BASE_URL;
//            console.log(data);
            var entsafeorgattachTpt = _.template($("#entsafeorgattachTpt").html());
            $("#entsafeorgattach").html(entsafeorgattachTpt(data));
            $("#entsafeorgattachImg").viewer({
                'toolbar': false,
                'title': false
            });
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}


//初始化消防应急疏散图
function initEntFirebugoutAttach(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/ent/entfirebugoutattach/list',
        cache: false,
        dataType: 'json',
        data: {
            businessinfoid: businessinfoid
        },
        global: false,
        success: function (json) {
            var data = {};
            data.datas = json;
            data.baseUrl = BASE_URL;
//            console.log(data);
            var entfirebugoutattachTpt = _.template($("#entfirebugoutattachTpt").html());
            $("#entfirebugoutattach").html(entfirebugoutattachTpt(data));
            $("#entfirebugoutattachImg").viewer({
                'toolbar': false,
                'title': false
            });
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}
//排污许可
function initEpiSewageLicenceInfo(businessinfoid){
    $.ajax({
        type: 'post',
        url: BASE_URL + '/epi/episewagelicence/loadList',
        cache: false,
        dataType: 'json',
        data: {
        	entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data);
            var sewageLicenceTpt = _.template($("#sewageLicenceTpt").html());
            $("#sewageLicence").html(sewageLicenceTpt(data));

            $("#episewageattachmentImg").viewer({
                'toolbar': false,
                'title': false
            });
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}
//环境敏感点记录
function initEpiSensitiveRecordInfo(businessinfoid) {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/epi/episensitiverecord/list',
        cache: false,
        dataType: 'json',
        data: {
        	entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
//            console.log(data);
            var sensitiveRecordTpt = _.template($("#sensitiveRecordTpt").html());
            $("#sensitiveRecord").html(sensitiveRecordTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 固体废物记录
 */
function initSolidwasterRecord(businessinfoid){
	$.ajax({
        type: 'post',
        url: BASE_URL + 'epi/episolidwasterecord/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
            var solidwsaterRecordTpt = _.template($("#solidwsaterRecordTpt").html());
            $("#solidwsaterRecord").html(solidwsaterRecordTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 环评及行政许可
 */
function initContructionInfo(businessinfoid){
	$.ajax({
        type: 'post',
        url: BASE_URL + 'epi/epiconstructioninfo/loadList',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
        	data.baseUrl = BASE_URL;
        	var constructionInfoTpt = _.template($("#constructionInfoTpt").html());
        	$("#constructionInfo").html(constructionInfoTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}

/**
 * 环保应急预案
 */
function initEpiemgPlan(businessinfoid){
	$.ajax({
        type: 'post',
        url: BASE_URL + 'epi/epiemgplan/list',
        cache: false,
        dataType: 'json',
        data: {
            entid: businessinfoid,
            page: 1,
            rows: 1000
        },
        global: false,
        success: function (data) {
            var emgplanTpt = _.template($("#emgplanTpt").html());
            $("#emgplan").html(emgplanTpt(data));
        },
        error: function () {
            parent.toast("获取失败");
        }
    });
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}