$(function () {

    //获取当前所选事故id
    $("#curEvnId").val(getQueryString("eventid"));
    $("#curEvnLng").val(getQueryString("eventlongitude"));
    $("#curEvnLat").val(getQueryString("eventlatitude"));
    initEvnAnologList();

    //加载所选模拟类型下拉框数据及其相关事件
    SelectOption.loadEvnAnaType("anaModePtype", {"pId": "-1"});
    $("#anaModePtype").change(function () {
        $("#modtypeid").empty().val("");
        var curAnaModePtype = $(this).val();
        if (curAnaModePtype && "" != curAnaModePtype) {
            //默认只选择氯气
            SelectOption.loadEvnAnaType("modtypeid", {
                "pId": $(this).val(),
                "tgtId": "4028ef425f5bcb22015f5bcb22b50000"
            });
        }
    });
    $(window).resize(function () {
        autoHeight();
    });
    autoHeight();
    $('body').on('click', '#evnAnalogAdd', function () {
        $('.evnAnalogList').hide();
        $('.evnAnalogAdd').show();
        $("#history").val("new");
        autoHeight();
    });

//	时间轴上的点击事件
    $('body').on('click', '.timeMark', function () {
        var index = $(this).data('index');
        var sIndex = $('li.selected:last').data('index');
        if (index > sIndex) {
            return 0;
        }
        timeShowOrHide(index);
    });

    //由详情返回列表
    $("#toListBtn").on('click', function () {
        $(".evnAnalogList").show();
        $("#evnAnalogAdd").show();
        $("#evnanalogdetail").hide();

        $("#paramtypeTd").text();
        $("#airpressureTd").text();
        $("#airtemperatureTd").text();
        $("#windspeedTd").text();
        $("#winddirectionTd").text();
        $("#simulationtimeTd").text();
        $("#leakagetypeTd").text();
        $("#leakageTd").text();
        $("#longitudeTd").text();
        $("#latitudeTd").text();
        $("#radiusTd").text();
        $("#concentrationTd").text();

        $("#detail_grid").empty();
        $("#detail_grid").append(" <table id=\"detail_grid-table\"></table>\n" +
            "                    <div id=\"detail_grid-pager\"></div>");
        autoHeight();
        tableScrollResize();
    });


//	新增模拟返回按钮点击事件
    $("#fstTypeAnaBackBtn").on('click', function () {
        $('.evnAnalogList').show();
        $('.evnAnalogAdd').hide();
        autoHeight();
        $("#evnanaloggrid-table").jqGrid("setGridParam", {
            page: 1,
            postData: {
                eventid: $("#curEvnId").val()
            }
        }).trigger("reloadGrid");
    })
//	气象参数返回按钮点击事件
    $('#xielouTypeRetBtn').on('click', function () {
        $('#evnAnaFstType').hide();
        $('#evnAnaSecType').show();
        $('#evnAnaxielouType').hide();
        $('#evnAnashiguType').hide();
        timeShowOrHide(2);
    });

    //事故模拟详情的事件
    $(".navBar li").off("click").on("click", function () {
        $(".navBar li").removeClass("active");
        $(this).addClass("active");
        var id = $(this).data("id");
        $(".allDiv").hide();
        $("." + id + "Div").show();
    });

    /**
     * 自动填充数据
     */
    var radioFlag = true;
    $(":radio").click(function () {
        if ($(this).val() == "1") {
            if (!radioFlag) {
                $("#airpressure,#airtemperature,#windspeed,#winddirection").val("");
            }
            radioFlag = true;
        }
        if ($(this).val() == "2") {
            //气压
            $("#airpressure").val("1013");
            //气温
            $("#airtemperature").val("10");
            //风速
            $("#windspeed").val("1.5");
            //风向
            $("#winddirection").val("200");
            //初始半径
            $("#radius").val("3");
            //初始值
            $("#concentration").val("15");
            radioFlag = false;
        }
        if ($(this).val() == "3") {
            //气压
            $("#airpressure").val("1513");

            //气温
            $("#airtemperature").val("23");

            //风速
            $("#windspeed").val("2");

            //风向
            $("#winddirection").val("60");

            //模拟时间
            $("#simulationtime").val("20");

            //初始半径
            $("#radius").val("12");

            //初始值
            $("#concentration").val("100");
            radioFlag = false;
        }
    });


    //一层页面模拟表单校验
    $("#anaModeTypeForm").validate({
        rules: {
            anaModePtype: {
                required: true
            },
            modtypeid: {
                required: true
            }
        },
        messages: {
            anaModePtype: {
                required: "分析模型不能为空"
            },
            modtypeid: {
                required: "危化品名称不能为空"
            }
        },
        submitHandler: function (form) {
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').show();
            $('#evnAnaxielouType').hide();
            goToSecTypeAna();
        }
    });

    /**
     * 一层页面模拟按钮事件
     */
    function goToSecTypeAna() {
        $('.timeMark').each(function (index, item) {
            if (index < 2) {
                $(item).addClass('selected')
            }
        })
        //加载所选模拟时间下拉框数据
        SelectOption.loadEvnAnaSimtime("simulationtime");
        SelectOption.loadEvnAnaLkagetype("leakagetype");

        //获取一层页面所选危化品并赋值
        var curLeakage = $("#modtypeid").children("option:selected").text();


        //二层页面模拟表单校验
        $("#evnAnaSecForm").validate({
            rules: {
                paramtype: {
                    required: true
                },
                airpressure: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 9999.99,
                    airWindCheck: true
                },
                airtemperature: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 99.99,
                    airWindCheck: true
                },
                windspeed: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 9999.99,
                    airWindCheck: true
                },
                winddirection: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 360,
                    airWindCheck: true
                }
            },
            messages: {
                paramtype: {
                    required: "获取方式不能为空"
                },
                airpressure: {
                    required: "气压不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为9999.99",
                    airWindCheck: "请输入4位整数,小数点后最多保留2位"
                },
                airtemperature: {
                    required: "气温不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为99.99",
                    airWindCheck: "请输入4位整数,小数点后最多保留2位"
                },
                windspeed: {
                    required: "风速不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为9999.99",
                    airWindCheck: "请输入4位整数,小数点后最多保留2位"
                },
                winddirection: {
                    required: "风向不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为9.99",
                    airWindCheck: "请输入4位整数,小数点后最多保留2位"
                }
            },
            submitHandler: function (form) {
                $('#evnAnaFstType').hide();
                $('#evnAnaSecType').hide();
                $('#evnAnaxielouType').show();
                timeShowOrHide(3);
                goToTrdTypeAna(curLeakage);
                autoHeight();
            }
        });
        autoHeight();
    }

    function goToTrdTypeAna(curLeakage) {
        $("#leakage").val(curLeakage);
        $("#longitude").val($("#curEvnLng").val());
        $("#latitude").val($("#curEvnLat").val());
        $("#evnAnaTrdForm").validate({
            rules: {
                simulationtime: {
                    required: true
                },
                leakagetype: {
                    required: true
                },
                leakage: {
                    required: true
                },
                longitude: {
                    required: true,
                    validateitude: true
                },
                latitude: {
                    required: true,
                    validateitude: true
                },
                radius: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 999999.99
                },
                concentration: {
                    required: true,
                    isNumber: true,
                    min: 0.0,
                    max: 999999.99
                }
            },
            messages: {
                simulationtime: {
                    required: "模拟时间不能为空"
                },
                leakagetype: {
                    required: "泄漏类型不能为空"
                },
                leakage: {
                    required: "危化品不能为空"
                },
                longitude: {
                    required: "经度不能为空",
                    validateitude: "请输入正确格式的经度"
                },
                latitude: {
                    required: "维度不能为空",
                    validateitude: "请输入正确格式的维度"
                },
                radius: {
                    required: "初始半径不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为999999.99"
                },
                concentration: {
                    required: "初始浓度不能为空",
                    isNumber: "请输入正确格式的数字",
                    min: "最小为0.0",
                    max: "最大为999999.99"
                }
            },
            submitHandler: function (form) {
                timeShowOrHide(4);
                save(curLeakage);
                autoHeight();
                $("#trdTypeSaveBtn").show();
            }
        });
        autoHeight();
    }

    //二层页面模拟按钮
    function save(curLeakage) {
        //根据所输入各种参数进行事故模拟计算
        $.ajax({
            type: "post",
            url: BASE_URL + "ems/emssucsimulation/getEvnAnaData",
            timeout: 15000,
            data: {
                pressure: $("#airpressure").val(),
                temperature: $("#airtemperature").val(),
                windspeed: $("#windspeed").val(),
                degree: $("#winddirection").val(),
                minute: $("#simulationtime").val(),
                leaktype: $("#leakagetype").val(),
                chemical: encodeURI(curLeakage, "UTF-8"),
                lat: $("#latitude").val(),
                lon: $("#longitude").val(),
                width: $("#radius").val(),
                density: $("#concentration").val(),
                srchtype: "1"//重气模拟查询
//					pressure: "1025",
//					temperature: "30",
//					windspeed: "10",
//					degree: "100",
//					minute: "10",
//					leaktype: "1",
//					chemical: encodeURI("硫化氢", "UTF-8"),
//					lat: "34.44",
//					lon: "113.42",
//					width: "15",
//					density: "180",
//					srchtype: "1"
            },
            success: function (retData) {
                if (retData.netbusy) {
                    parent.toast("网络繁忙，请稍后重试！");
                } else {
//				alert(JSON.stringify(retData));
                    //地图上加载所有的应急场所和事故模拟覆盖物
//				retData.cenPt = {"lng": $("#longitude").val(),
//							  	 "lat": $("#latitude").val()};
                    var allAreaPtObj = parent.initEvnAnaMap(retData);
//				alert("retJSON" + JSON.stringify(allAreaPtObj));

                    //各种污染区内的点位id集合赋值
                    $("#lowAreaPtIds").val(allAreaPtObj.low.join(","));
                    $("#midAreaPtIds").val(allAreaPtObj.mid.join(","));
                    $("#highAreaPtIds").val(allAreaPtObj.high.join(","));

                    //隐藏二层页面，跳转三层页面
                    $('#evnAnaFstType').hide();
                    $('#evnAnaSecType').hide();
                    $('#evnAnaxielouType').hide();
                    $('#timeLine').hide();
                    $("#evnAnaTrdType").show();

                    //加载第三层页面防护目标场所分页表格
                    loadEvnAnaTrdGrid();
                    $("#grid-table").jqGrid("setGridParam", {
                        page: 1,
                        postData: {'placeIds':'0'}
                    }).trigger("reloadGrid");
                    //绑定筛选污染类型分页表格单选项事件
                    $("input[name='pollArea']").off("click").on("click", function () {
                        reloadEvnAnaTrdGrid();
                    });
                    $("input[name='pollArea']:eq(0)").click();
                }
                autoHeight();
            },
            error: function () {
                parent.toast("网络繁忙，请稍后重试！");
            }
        });
    }

    $("#secTypeAnaBtn").off("click").on("click", function () {
        $("#trdTypeSaveBtn").show();
    });

    //二层页面返回按钮
    $("#secTypeRetBtn").off("click").on("click", function () {
        $("#evnAnaSecType").hide();
        $("#evnAnaFstType").show();
        timeShowOrHide(1);
    });

    //三层页面保存按钮
    $("#trdTypeSaveBtn").off("click").on("click", function () {
        //保存数据库操作
        $.ajax({
            type: "post",
            url: BASE_URL + "ems/emssucsimulation/saveEvnAnaRes",
            data: {
                modtypeid: $("#modtypeid").val(),
                paramtype: $("input[name='paramtype']").val(),
                airpressure: $("#airpressure").val(),
                airtemperature: $("#airtemperature").val(),
                windspeed: $("#windspeed").val(),
                winddirection: $("#winddirection").val(),
                simulationtime: $("#simulationtime").val(),
                leakagetype: $("#leakagetype").val(),
                leakage: encodeURI($("#modtypeid").children("option:selected").text(), "UTF-8"),
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val(),
                radius: $("#radius").val(),
                concentration: $("#concentration").val(),
                lowarea: $("#lowAreaPtIds").val(),
                midarea: $("#midAreaPtIds").val(),
                higharea: $("#highAreaPtIds").val(),
                eventid: $("#curEvnId").val()
            },
            success: function (json) {
                parent.toast(json.msg);
                $("#trdTypeSaveBtn").hide();
                autoHeight();
            },
            error: function () {
                parent.toast("网络繁忙，请稍后重试！");
            }
        });
//		parent.closeWin();
    });

    //三层页面返回按钮
    $("#trdTypeRetBtn").off("click").on("click", function () {
        $("#evnAnaTrdType").hide();
        $('#timeLine').show();
        //$("#evnAnaSecType").show();
        timeShowOrHide(3);
    });
});

/**
 * 获取第三层页面防护目标场所分页表格所需参数
 * @returns
 */
function getDetailAnalogPara() {
    var curPollArea = $("input[name='pollAreadetail']:checked").val(),
        param = {};
    param.history = $("#history").val(); 
    if ("0" == curPollArea) {
        param.placeIds = $("#lowAreaPtIds").val();
    } else if ("1" == curPollArea) {
        param.placeIds = $("#midAreaPtIds").val();
    } else if ("2" == curPollArea) {
        param.placeIds = $("#highAreaPtIds").val();
    }
    return param;
}


/**
 * 获取第三层页面防护目标场所分页表格所需参数
 * @returns
 */
function getEvnAnaTrdGridPara() {
    var curPollArea = $("input[name='pollArea']:checked").val(),
        param = {};
    param.history = $("#history").val(); 
    if ("0" == curPollArea) {
        param.placeIds = $("#lowAreaPtIds").val();
    } else if ("1" == curPollArea) {
        param.placeIds = $("#midAreaPtIds").val();
    } else if ("2" == curPollArea) {
        param.placeIds = $("#highAreaPtIds").val();
    }
    return param;
}


/**
 * 加载第三层页面防护目标场所分页表格
 * @returns
 */
function loadDetailAnalogGrid() {
    var colname = ['场所主键', '场所类型主键', '场所类型', '场所名称', '人口数', '电话', '经度', '纬度'];
    var colmodel = [
        {name: 'PLACEID', index: 'PLACEID', hidden: true},
        {name: 'TYPEID', index: 'TYPEID', hidden: true},
        {name: 'TYPENAME', index: 'TYPENAME', align: 'left'},
        {name: 'NAME', index: 'NAME', align: 'left'},
        {name: 'POPULATION', index: 'POPULATION', align: 'left'},
        {name: 'TEL', index: 'TEL', align: 'left'},
        {name: 'LONGITUDE', index: 'LONGITUDE', align: 'left', hidden: true},
        {name: 'LATITUDE', index: 'LATITUDE', align: 'left', hidden: true}
    ];

    $(window).resize(function () {
        $("#detail_grid-table").jqGrid('setGridHeight', 120);
        $("#detail_grid-table").jqGrid('setGridWidth', $(window).width() -40);
    });

    $("#detail_grid-table").jqGrid({
        height: "120px",
        url: BASE_URL + "ems/emssucplace/list",
        datatype: "json",
        cache: false,
        mtype: 'get',
        colNames: colname,
        colModel: colmodel,
        postData: getDetailAnalogPara(),
        sortname: 'POPULATION',
        sortorder: "desc",
        viewrecords: true,
        pager: "#detail_grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatit: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
//            if ($(window).width() < 700) {
//                $('.ui-jqgrid-htable').css({"width": "480"});
//                $("#detail_grid-table").css({"width": "480"});
//                $("#detail_grid-table").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
//                $(".table-line .tableTitle").find("button").css({"margin-right": "0px", "margin-top": "7px"});
//            } else {
//                $("#detail_grid-table").jqGrid('setGridWidth', $(window).width() - 40);
//            }

            $("#detail_grid-table").jqGrid('setGridHeight', 120);
            $("#detail_grid-table").jqGrid('setGridWidth', $(window).width() - 40);
            tableScrollResize();
        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
            var rows = $("#detail_grid-table").jqGrid("getRowData", rowid);
            var ptId = $("#detail_grid-table").jqGrid("getRowData", rowid).PLACEID;
//            var marker = parent.window.evnAnaPtDic.get(ptId).marker;
            window.parent.showFHMBInfo(ptId);
        }
    });
}


/**
 * 加载第三层页面防护目标场所分页表格
 * @returns
 */
function loadEvnAnaTrdGrid() {
    var colname = ['场所主键', '场所类型主键', '场所类型', '场所名称', '人口数', '电话', '经度', '纬度'];
    var colmodel = [
        {name: 'PLACEID', index: 'PLACEID', hidden: true},
        {name: 'TYPEID', index: 'TYPEID', hidden: true},
        {name: 'TYPENAME', index: 'TYPENAME', align: 'left'},
        {name: 'NAME', index: 'NAME', align: 'left'},
        {name: 'POPULATION', index: 'POPULATION', align: 'left'},
        {name: 'TEL', index: 'TEL', align: 'left'},
        {name: 'LONGITUDE', index: 'LONGITUDE', align: 'left', hidden: true},
        {name: 'LATITUDE', index: 'LATITUDE', align: 'left', hidden: true}
    ];

    $(window).resize(function () {
        $("#grid-table").jqGrid('setGridHeight', 120);
        $("#grid-table").jqGrid('setGridWidth', $(window).width() - 40);
    });

    $("#grid-table").jqGrid({
        height: "120px",
        url: BASE_URL + "ems/emssucplace/list",
        datatype: "json",
        cache: false,
        mtype: 'get',
        colNames: colname,
        colModel: colmodel,
        postData: getEvnAnaTrdGridPara(),
        sortname: 'POPULATION',
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatit: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: true,
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
//            if ($(window).width() < 700) {
//                $('.ui-jqgrid-htable').css({"width": "480"});
//                $("#grid-table").css({"width": "480"});
//                $("#grid-table").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
//				$(".ui-jqgrid-hdiv").css({ "overflow-x" : "scroll"});
//                $(".table-line .tableTitle").find("button").css({"margin-right": "0px", "margin-top": "7px"});
//            } else {
//                $("#grid-table").jqGrid('setGridWidth', $(window).width() * 0.99);
//            }
        	$("#grid-table").jqGrid('setGridWidth', $(window).width() - 40);
            $("#grid-table").jqGrid('setGridHeight', 120);
            tableScrollResize();
        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
            var rows = $("#grid-table").jqGrid("getRowData", rowid);
            var ptId = $("#grid-table").jqGrid("getRowData", rowid).PLACEID;
//            var marker = parent.window.evnAnaPtDic.get(ptId).marker;
            window.parent.showFHMBInfo(ptId);
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
            $('#evnAnaFstType').show();
            $('#evnAnaSecType').hide();
            $('#evnAnaxielouType').hide();
            $('#evnAnashiguType').hide();
            break;
        case 2:
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').show();
            $('#evnAnaxielouType').hide();
            $('#evnAnashiguType').hide();
            break;
        case 3:
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').hide();
            $('#evnAnaxielouType').show();
            $('#evnAnashiguType').hide();
            break;
        case 4:
            $('#evnAnaFstType').hide();
            $('#evnAnaSecType').hide();
            $('#evnAnaxielouType').hide();
            $('#evnAnashiguType').show();
            break;
    }
    autoHeight();
}

// 自适应高度
function autoHeight() {
    var height = $("body").height() + 20;
    console.log(height);
    //获取iframe的id  
    var frameId = window.frameElement && window.frameElement.id || '';
//  通过iframe的id设置高度
    $(window.parent.document).find("#" + frameId).css('height', height);
}

/*刷新第三层页面防护目标场所分页表格*/
function reloadEvnAnaTrdGrid() {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: getEvnAnaTrdGridPara()
    }).trigger("reloadGrid");
}

/*刷新第三层页面防护目标场所分页表格*/
function reloadDetailAnalogGrid() {
    $("#detail_grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: getDetailAnalogPara()
    }).trigger("reloadGrid");
}

function initEvnAnologList() {
    var colname = ['事故模拟主键', '危化品', '分析模型类别', '创建时间'];
    var colmodel = [
        {name: 'SIMULATIONID', index: 'SIMULATIONID', hidden: true},
        {name: 'LEAKAGE', index: 'LEAKAGE', align: 'left'},
        {
            name: 'LEAKAGETYPE', index: 'LEAKAGETYPE', align: 'left', formatter: function (cellvalue, options, obj) {
                return SelectOption.getEvnAnaLkagetypeName(obj.LEAKAGETYPE);
            }
        },
        {
            name: 'CREATETIME', index: 'CREATETIME', align: 'left', formatter: function (cellvalue, options, obj) {
                if (cellvalue) {
                    return getFormatDateByLong(obj.CREATETIME, "yyyy-MM-dd hh:mm:ss");
                } else {
                    return "-";
                }
            }
        }
    ];

    $(window).resize(function () {
        $("#evnanaloggrid-table").jqGrid('setGridHeight', 180);
        $("#evnanaloggrid-table").jqGrid('setGridWidth', $(window).width() - 40);
    });

    $("#evnanaloggrid-table").jqGrid({
        height: 180,
        url: BASE_URL + "ems/emssucsimulation/loadbyeventid",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            eventid: $("#curEvnId").val()
        },
        sortname: 'createtime',
        sortorder: "desc",
        viewrecords: true,
        pager: "#evnanaloggrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatit: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: false,
        //caption: "受影响的场所列表",
        autowidth: true,
        scrollOffset: 1,
        loadComplete: function () {
//            if ($(window).width() < 700) {
//                $('.ui-jqgrid-htable').css({"width": "480"});
//                $("#evnanaloggrid-table").css({"width": "480"});
//                $("#evnanaloggrid-table").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
//                $(".table-line .tableTitle").find("button").css({"margin-right": "0px", "margin-top": "7px"});
//            } else {
//                $("#evnanaloggrid-table").jqGrid('setGridWidth', $(window).width() * 0.99);
//            }

            $("#evnanaloggrid-table").jqGrid('setGridHeight', 180);
            $("#evnanaloggrid-table").jqGrid('setGridWidth', $(window).width() - 40);
            tableScrollResize();
        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
            var rows = $("#evnanaloggrid-table").jqGrid("getRowData", rowid);
            var ptId = $("#evnanaloggrid-table").jqGrid("getRowData", rowid).SIMULATIONID;
            $("#evnanalogdetail").show();
            $("#evnAnalogAdd").hide();
            $(".evnAnalogList").hide();
            

            //在地图上加载模拟结果
            //加载事故模拟结果覆盖物----------------------------------------------------------------
            //清除历史点位覆盖物和防护目标点位并定义所有事故模拟结果覆盖物
            $.ajax({
                type: "post",
                url: BASE_URL + "ems/emssucsimulation/loadEvnAnaData",
                data: {
                    tgtEvnAnaId: ptId
                },
                async: false,
                success: function (retData) {
                    var allAreaPtObj = window.parent.showAnalogIndexMap(retData);
                    console.log(allAreaPtObj);
                    $("#lowAreaPtIds").val(allAreaPtObj.low.join(","));
                    $("#midAreaPtIds").val(allAreaPtObj.mid.join(","));
                    $("#highAreaPtIds").val(allAreaPtObj.high.join(","));
                    $("#history").val("history");
                    loadDetailAnalogGrid();

                    $("input[name='pollAreadetail']").off("click").on("click", function () {
                        reloadDetailAnalogGrid();
                    });
                    //显示参数详情
                    var emsSucSimulation = retData.emsSucSimulation;

                    $("#paramtypeTd").text(emsSucSimulation.paramtype);
                    $("#airpressureTd").text(emsSucSimulation.airpressure);
                    $("#airtemperatureTd").text(emsSucSimulation.airtemperature);
                    $("#windspeedTd").text(emsSucSimulation.windspeed);
                    $("#winddirectionTd").text(emsSucSimulation.winddirection);
                    $("#simulationtimeTd").text(emsSucSimulation.simulationtime);
                    $("#leakagetypeTd").text(emsSucSimulation.leakagetype);
                    $("#leakageTd").text(emsSucSimulation.leakage);
                    $("#longitudeTd").text(emsSucSimulation.longitude);
                    $("#latitudeTd").text(emsSucSimulation.latitude);
                    $("#radiusTd").text(emsSucSimulation.radius);
                    $("#concentrationTd").text(emsSucSimulation.concentration);

                }
            });

        }
    });
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