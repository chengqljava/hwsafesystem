$(function () {

    var eventid = getQueryString("eventid");
    var schemeid = getQueryString("schemeid");
    var evaluationid = getQueryString("evaluationid");
    var forecastid = getQueryString("forecastid");
    

    var node = '1';
    initTaskGird(schemeid, node);

    initYjxyInfo(eventid);
    $('.leftTab ul').on('click', 'li', function () {
        var kind = $(this).data('kind');
        if (kind == 'next') {
            return 0;
        }
        $('.leftTab ul li').removeClass('active');
        $(this).addClass('active');
        $('.leftTab ul li').map(function () {
            var $kind = $(this).data('kind');
            if ($kind == 'next') {
            } else {
                $(this).find('img').attr('src', BASE_URL + '/images/module/ems/emseverepro/icon_' + $kind + '2.png')
            }
        });
        $(this).find('img').attr('src', BASE_URL + '/images/module/ems/emseverepro/icon_' + kind + '1.png');

        $("#topTable").empty();

        $("#topTable").append(" <table id=\"respGrid-table\"></table>\n" +
            "                    <div id=\"respGrid-pager\"></div>");


        switch (kind) {
            case 'yjxy':
                $('#kindInfo').html('应急响应');
                node = 1;
                initYjxyInfo(eventid);
                break;
            case 'zjzhb':
                $('#kindInfo').html('组建指挥部');
                //TODO
                node = 2;
                initZjZhbGrid(eventid);
                break;
            case 'cssjjyj':
                $('#kindInfo').html('次生事件及预警');
                node = 3;
                initCsshGrid(eventid);
                break;
            case 'sjkzcl':
                $('#kindInfo').html('事件控制策略');
                initStkzclInfo(forecastid);
                node = 4;
                break;
            case 'jjq':
                $('#kindInfo').html('警戒区');
                initJjqInfo(forecastid);
                node = 5;
                break;
            case 'dlfs':
                $('#kindInfo').html('道路封锁');
                initDlfsInfo(forecastid);
                node = 6;
                break;
            case 'cllx':
                $('#kindInfo').html('撤离路线');
                node = 7;
                initLxInfo(forecastid,"0","撤离路线名称");
                break;
            case 'jylx':
                $('#kindInfo').html('救援路线');
                initLxInfo(forecastid,"1","救援路线名称");
                node = 8;
                break;
            case 'bncs':
                $('#kindInfo').html('避难场所');
                initBncsInfo(evaluationid);
                node = 9;
                break;
            case 'yjdw':
                $('#kindInfo').html('救援队伍');
                initJydwInfo(evaluationid)
                node = 10;
                break;
            case 'yljg':
                $('#kindInfo').html('医疗资源');
                initYlzyInfo(evaluationid);
                node = 11;
                break;
            case 'yjwz':
                $('#kindInfo').html('物资装备');
                initWzzbInfo(evaluationid);
                node = 12;
                break;
            case 'ysbz':
                $('#kindInfo').html('运输保障');
                node = 13;
                initYsbzInfo(evaluationid);
                break;
            case 'txbz':
                $('#kindInfo').html('通信保障');
                node = 14;
                initTxbzInfo(evaluationid);
                break;
            case 'yjzj':
                $('#kindInfo').html('应急专家');
                node = 15;
                initYjzjInfo(evaluationid);
                break;
            case 'yjjg':
                $('#kindInfo').html('应急机构');
                node = 16;
                initYjjgInfo(evaluationid);
                break;
            default:
                break;
        }
        console.log(node);
        reloadTaskGird(schemeid, node);
    });
    scrollResize();

    // 刷新滚动条
    function scrollResize() {
        $('.leftTab').niceScroll({
            cursorborder: "#4d86d6",
            cursorcolor: "#4d86d6",
            background: false,
            autohidemode: false
        }).resize();
    }
});

//应急机构
function initYjjgInfo(evaluationid) {
    var colname = ["机构主键id","机构编号","机构名称","机构职责"],
        colmodel = [
            {
                name: "ORGID",
                index: "ORGID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "ORGNO",
                index: "ORGNO",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "ORGNAME",
                index: "ORGNAME",
                width: "15%",
                align: "center",
                sortable: true
            },
            {
                name: "ORGDUTIES",
                index: "ORGDUTIES",
                width: "25%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                	if(cellvalue == "" || cellvalue == null){
                		return "--";
                	} else {
                		return cellvalue;
                	}
                }
            }
        ];
  //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"yjjg"
        },
        sortname: "ORGID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

//应急专家
function initYjzjInfo(evaluationid) {
    var colname = ["专家id","姓名","性别","联系电话"],
        colmodel = [
            {
                name: "EXPERTID",
                index: "EXPERTID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "NAME",
                index: "NAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "SEX",
                index: "SEX",
                width: "10%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                	if(obj.SEX == "0"){
                		return "男";
                	} else {
                		return "女";
                	}
                }
            },
            {
                name: "PHONE",
                index: "PHONE",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
  //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"yjzj"
        },
        sortname: "EXPERTID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

//通讯保障
function initTxbzInfo(evaluationid) {
    var colname = ["通讯保障id","团队名称","主管单位","联系人"],
        colmodel = [
            {
                name: "FIRMID",
                index: "FIRMID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "FIRMNAME",
                index: "FIRMNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "CHARGEDEPT",
                index: "CHARGEDEPT",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "CONTACTPER",
                index: "CONTACTPER",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
  //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"txbz"
        },
        sortname: "UPDATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

//运输保障
function initYsbzInfo(evaluationid) {
    var colname = ["运输工具id","运输工具编号","运输工具名称","存放地点"],
        colmodel = [
            {
                name: "TRANSTOOLID",
                index: "TRANSTOOLID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TRANSTOOLCODE",
                index: "TRANSTOOLCODE",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TRANSTOOLNAME",
                index: "TRANSTOOLNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "DEPOSITPLACE",
                index: "DEPOSITPLACE",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
  //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"ysbz"
        },
        sortname: "TRANSTOOLID",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

function initJydwInfo(evaluationid) {
    var colname = ["应急id","队伍名称","队伍类型","装备描述","特长"],
        colmodel = [
            {
                name: "TEAMID",
                index: "TEAMID",
                width: "10%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "TEAMNAME",
                index: "TEAMNAME",
                width: "10%",
                align: "center",
                sortable: true
            },
            {
                name: "TEAMTYPEID",
                index: "TEAMTYPEID",
                width: "10%",
                align: "center",
                sortable: true,
                formatter : function(cellvalue, options, obj){
                    return SelectOption.getTeamType(obj.TEAMTYPEID);
                }
            },
            {
                name: "EQUIPMENTDESC",
                index: "EQUIPMENTDESC",
                width: "15%",
                align: "center",
                sortable: true
            },
            {//使用“专业描述”字段
                name: "PROFESSIONDESC",
                index: "PROFESSIONDESC",
                width: "15%",
                align: "center",
                sortable: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"jydw"
        },
        sortname: "FILLTIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

function initBncsInfo(evaluationid) {
    var colname = ["主键id","避难场所名称","防护目标类型","地址","可容纳人数","经度","维度"],
        colmodel = [
            {
                name: "SHELTERID",
                index: "SHELTERID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "SHELTERNAME",
                index: "SHELTERNAME",
                width: "10%",
                align: "center",
                sortable: false,
            },
            {
                name: "RESOURCETYPENAME",
                index: "RESOURCETYPENAME",
                width: "15%",
                align: "center",
                sortable: false
            },
            {
                name:'ADDRESS',
                index:'ADDRESS',
                width:'10%',
                align: "center",
                sortable: false
            },
            {
                name:'PERSONNUM',
                index:'PERSONNUM',
                width:'10%',
                align: "center",
                sortable: false
            },
            {
                name: "LONGITUDE",
                index: "LONGITUDE",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            },
            {
                name: "LATITUDE",
                index: "LATITUDE",
                width: "15%",
                align: "center",
                sortable: false,
                hidden: true
            }
        ];
//分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"bncs"
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}
function initYlzyInfo(evaluationid) {
    var colname = [ "主键id", "医疗机构名称", "医疗机构类型", "医疗机构等级", "经度", "维度" ], colmodel = [
        {
            name : "DEPTID",
            index : "DEPTID",
            width : "5%",
            align : "center",
            sortable : false,
            hidden : true
        }, {
            name : "DEPTNAME",
            index : "DEPTNAME",
            width : "15%",
            align : "center",
            sortable : false,

        }, {
            name : "RESOURCETYPENAME",
            index : "RESOURCETYPENAME",
            width : "15%",
            align : "center",
            sortable : false
        }, {
            name : "DEPTGRADENAME",
            index : "DEPTGRADENAME",
            width : "15%",
            align : "center",
            sortable : false
        }, {
            name : "LONGITUDE",
            index : "LONGITUDE",
            width : "15%",
            align : "center",
            sortable : false,
            hidden : true
        }, {
            name : "LATITUDE",
            index : "LATITUDE",
            width : "15%",
            align : "center",
            sortable : false,
            hidden : true
        } ];
    //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"ylzy"
        },
        sortname: "CREATETIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

function initWzzbInfo(evaluationid) {



    var colname = [ "仓库id", "资源名称", "资源类型", "主管单位", "库容"];
    colmodel = [ {
        name : 'EMSDEPOSID',
        index : 'EMSDEPOSID',
        width : '5%',
        align : "center",
        sortable : false,
        hidden : true
    }, {
        name : 'STOREHOUSE',
        index : 'STOREHOUSE',
        width : '5%',
        align : "center",
        sortable : false
    }, {
        name : 'MATERIALTYPE',
        index : 'MATERIALTYPE',
        width : '5%',
        align : "center",
        sortable : false,
        formatter : function(cellvalue, options, obj) {
            return SelectOption.getMaeMaterialtype(obj.MATERIALTYPE);
        }
    }, {
        name : 'MEASURE',
        index : 'MEASURE',
        width : '5%',
        align : "center",
        sortable : false
    }, {
        name : 'CAPACITY',
        index : 'CAPACITY',
        width : '5%',
        align : "center",
        sortable : false
    }];

    //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadResourceData",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "evaluationid":evaluationid,
            "resourceType":"wzzb"
        },
        sortname: "FILLTIME",
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

function initLxInfo(forecastid,lxtype,lxname) {
    //生成撤离路线列表分页表格
    var colname = ["主键",lxname,"开始经度","开始纬度"],
        colmodel = [
            {
                name: "ROUTEID",
                index: "ROUTEID",
                sortable: false,
                hidden: true
            },
            {
                name: "ROUTENAME",
                index: "ROUTENAME",
                width: "100%",
                align: "center",
                sortable: false,
                formatter:function(cellvalue, options, obj) {
                    if (obj.ROUTENAME) {
                        return cellvalue;
                    } else {
                        return "";
                    }
                }
            },
            {
                name: "STARTLON",
                index: "STARTLON",
                sortable: false,
                hidden: true
            },
            {
                name: "STARTLAT",
                index: "STARTLAT",
                sortable: false,
                hidden: true
            }
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });
    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucissscheme/loadroutelist",
        datatype: "json",
        cache: false,
        mtype: "POST",
        sortname: "ROUTEID",
        sortorder: "desc",
        colNames: colname,
        colModel: colmodel,
        postData: {
            "forecastid":forecastid,
            "routetype":lxtype//撤离路线
        },
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        autowidth: true,
        loadComplete: function() {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}

function initDlfsInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucissscheme/loadroadblocklist",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
            if (data.blockList && data.blockList.length>0) {
                $("#topTable").append("<table id='roadTable' class='table table-bordered'><tr><td >道路名称</td><td>封锁点经度</td><td>封锁点纬度</td></tr>");
                _.each(data.blockList, function (item) {
                    $("#roadTable").append("<tr><td >" + item.roadname + "</td><td>" + item.roadlon + "</td><td>" + item.roadlat + "</td></tr>");
                });
                $("#topTable").append("</table>");
            } else {
            	$("#topTable").append("在事发影响范围内无道路封锁");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}


function initJjqInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucissscheme/loadzonelist",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
            if (data.zone) {
                $("#topTable").append("在事发影响范围内设立(" + data.zone.zonename + ")警戒区，警戒区影响面积为(" + data.zone.acreage + ")平方千米。");
            } else {
            	$("#topTable").append("在事发影响范围内未设立警戒区");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}


function initStkzclInfo(forecastid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucigrforecast/load",
        dataType: "json",
        async: false,
        data: {
        	forecastid: forecastid
        },
        success: function (data) {
            if (data) {
                $("#topTable").empty();

                $("#topTable").append(data.eventcontrol || "没有事态控制策略");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
}

function initZjZhbGrid(eventid) {
    //根据schemaId在窗口上面区域查询最新的组建指挥部内容------------------start-----------------------------------------
    var colnames = ['机构id', '机构编号', '机构名称', '行政区域', '机构职责', '内设部门', '机构成员', '地图定位', '所属单位'];
    var colmodels = [
        {name: 'ORGID', index: 'ORGID', width: '5%', hidden: true},
        {name: 'ORGNO', index: 'ORGNO', width: '10%', align: 'left'},
        {
            name: 'ORGNAME', index: 'ORGNAME', width: '10%', align: 'left',
            formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="displayOrg(\'' + obj.ORGID + '\')">' + obj.ORGNAME + '</a>';
            }
        },
        {name: 'DISTRICTNAME', index: 'DISTRICTNAME', width: '15%', align: 'left'},
        {name: 'ORGDUTIES', index: 'ORGDUTIES', width: '30%', align: 'center'},
        {
            name: 'DEPTCOUNT', index: 'DEPTCOUNT', width: '10%', align: 'center',
            // formatter:function(cellvalue, options, obj) {
            // return '<a href="javascript:void(0);" onclick="displayDepts(\''+obj.ORGID+'\')">'+obj.DEPTCOUNT+'</a>';
            // }
        },
        {
            name: 'USERCOUNT', index: 'USERCOUNT', width: '10%', align: 'center',
            // formatter:function(cellvalue, options, obj) {
            // return '<a href="javascript:void(0);" onclick="displayUsers(\''+obj.ORGID+'\')">'+obj.USERCOUNT+'人</a>';
            // }
        },
        {
            name: 'LONGITUDE', index: 'LONGITUDE', width: '10%', align: 'center',
            formatter: function (cellvalue, options, obj) {
                if (obj.LONGITUDE && obj.LATITUDE) {
                    return '<a href="javascript:void(0);" onclick="loactionGIS(\'' + obj.LONGITUDE + '\',\'' + obj.LATITUDE + '\',\'' + obj.DISTRICTID + '\')">已定位</a>';
                } else {
                    return '未定位';
                }
            }, hidden: true
        },
        {name: 'UNITNAME', index: 'UNITNAME', width: '20%', align: 'left'}
    ];

    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsplaorg/orglist",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colnames,
        colModel: colmodels,
        postData: {
            "eventid": eventid
        },
        sortname: 'ORGNO',
        sortorder: "asc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: false,
        autowidth: true,
        loadComplete: function () {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
    //--------------------------------end--------------------------------------------------------------------------

}

function initCsshGrid(eventid) {
    //根据schemaId在窗口上面区域查询最新的次生事件内容------------------start-----------------------------------------
    var colname = ['事故ID', '事故类型', '事故名称', '可能后果', '现场处理方案'];
    var colmodel = [
        {name: 'proaccid', index: 'proaccid', hidden: true},
        {name: 'eventtypeid', index: 'eventtypeid', align: 'left', hidden: true},
        {
            name: 'accidentname', index: 'accidentname', align: 'left',
            formatter: function (cellvalue, option, obj) {
                return "<a href = 'javascript:void(0)' onclick='displayEmsProcc(\"" + obj.proaccid + "\")'>" + obj.accidentname + "</a>";
            }
        },
        {name: 'probeconseq', index: 'probeconseq', align: 'left'},
        {name: 'acchandes', index: 'acchandes', align: 'left'}
    ];

    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    var searchParamJson = {"eventid": eventid};

    var searchParam = {"searchParamJson": JSON.stringify(searchParamJson)};

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/ems/emsplaproacc/proacclist",
        datatype: "json",
        cache: false,
        mtype: 'get',
        colNames: colname,
        colModel: colmodel,
        postData: searchParam,
        sortname: 'UPDATETIME',
        sortorder: "desc",
        viewrecords: true,
        pager: "#respGrid-pager",
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
        autowidth: true,
        loadComplete: function () {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
    //--------------------------------end--------------------------------------------------------------------------

}


/**
 * 初始化加载当前方案下的任务分页表格
 * @param schemaId
 */
function initTaskGird(schemaId, node) {
    var colname = ['主键', '方案ID', '方案节点', '接收人id', '接收人', '下发时间', '完成时间', '任务状态', '任务跟踪', '任务内容'];
    var colmodel = [
        {name: 'TASKID', index: 'TASKID', width: '5%', hidden: true},
        {name: 'SCHEMEID', index: 'SCHEMEID', width: '5%', hidden: true},
        {name: 'NODE', index: 'NODE', width: '5%', hidden: true},
        {name: 'TASKRECEIVER', align: 'center', index: 'TASKRECEIVER', width: '5%', hidden: true},
        {name: 'RECEIVERNAME', align: 'center', index: 'RECEIVERNAME', width: '5%'},
        {
            name: 'RECEIVETIME', align: 'center', index: 'RECEIVETIME', formatter: function (cellvalue, options, obj) {
                return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
            }, width: '5%'
        },
        {
            name: 'FINISHTIME', align: 'center', index: 'FINISHTIME', formatter: function (cellvalue, options, obj) {
                if (cellvalue) {
                    return getFormatDateByLong(cellvalue, "yyyy-MM-dd hh:mm:ss");
                } else {
                    return "-";
                }
            }, width: '5%'
        },
        {
            name: 'TASKSTATUS',
            align: 'center',
            index: 'TASKSTATUS',
            width: '5%',
            formatter: function (cellvalue, options, obj) {
                if ("0" == cellvalue) {
                    return "未开始";
                } else if ("1" == cellvalue) {
                    return "进行中";
                } else if ("2" == cellvalue) {
                    return "已完成";
                }
            }
        },
        {
            name: '', width: '5%', align: 'center', formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="traceTask(\'' + obj.TASKID + '\',\'' + obj.TASKRECEIVER + '\')">跟踪</a>';
            }
        },
        {name: 'TASKCONTENT', index: 'TASKCONTENT', width: '5%', hidden: true}
    ];

    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#grid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#grid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emssucisstask/list",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            "schemaId": schemaId,
            "curNode": node
        },
        sortname: 'RECEIVETIME',
        sortorder: "desc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        rownumbers: true,
        rownumWidth: 40,
        scroll: true,
        multiselect: false,
        //caption: "应急队伍列表",
        autowidth: true,
        loadComplete: function () {
            $("#grid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
}


function initYjxyInfo(eventid) {
    var colname = ['主键id', '预案id', '分级响应名称', '分级标准', '应急响应信息'];
    var colmodel = [
        {name: 'responseid', index: 'responseid', hidden: true},
        {name: 'planid', index: 'planid', hidden: true},
        {
            name: 'responsename', index: 'responsename',
            formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="displayResp(\'' + obj.responseid + '\')">' + obj.responsename + '</a>';
            }
        },
        {name: 'standard', index: 'standard'},
        {name: 'responsemsg', index: 'responsemsg'}
    ];

    var tableHeight = $(window).height() * 0.5 - 160;
    $(window).resize(function () {
        $("#respGrid-table").jqGrid('setGridHeight', $(window).height() * 0.5 - 160);
        $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
    });

    $("#respGrid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsplaresponse/resplist",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            "eventid": eventid
        },
        sortname: 'ordernum',
        sortorder: "asc",
        viewrecords: true,
        pager: "#respGrid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 10,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: false,
        width: "100%",
        autowidth: true,
        loadComplete: function () {
            $("#respGrid-table").jqGrid('setGridWidth', $(window).width() - 230);
        }
    });
    //------------------------------------end--------------------------------------------------------------------------

}

/**
 * 根据任务id弹出相应的任务下的消息通信窗口
 *
 * @param taskId
 */
function traceTask(taskId, receiver) {
    parent
        .openWin(
            BASE_URL
            + "views/module/ems/map/aiplan/common/aiPlanNodeTskTrace.html?taskId="
            + taskId + "&receiver=" + receiver, "任务跟踪", "50%",
            "66%");
}

function reloadTaskGird(schemeid, node) {
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
        	schemaId: schemeid,
        	curNode: node
        }
    }).trigger("reloadGrid");
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

