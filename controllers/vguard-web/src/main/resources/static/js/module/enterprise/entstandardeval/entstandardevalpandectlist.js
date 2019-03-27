$(document).ready(function () {
    //$("#tableOpers").displayOper();
    if ($(window).width() < 700) {
        $('.showBtn').css({"display": "none"});
        var len = $('.dropdown-menu li').length;
        for (var i = 0; i < len; i++) {
            $('.smallShow li button')[i].onclick = function () {
                var html = $(this).html();
                $('.clickBtn').html(html);
            };
        }
    } else {
        $('#btnli').css({"display": "none"});
        $("#btnli").empty();
        $('#btnli').remove();
    }
    changQarter();
    var currYear = new Date().getFullYear();
    $("#belongyear").val(currYear);
    var html = "<li>" + (currYear - 4) + "</li>" +
        "<li>" + (currYear - 3) + "</li>" +
        "<li>" + (currYear - 2) + "</li>" +
        "<li>" + (currYear - 1) + "</li>" +
        "<li class='active'>" + currYear + "</li>";
    $(".year").html(html);

    $(".year").on("click", "li", function () {
        $(this).addClass('active').siblings().removeClass('active');
        // setTimeByQarter($(this).text(),$("#qarter").val());
        $("#belongyear").val(parseInt($(this).text()));
        reloadGrid();
        if ($(this).index() == 0) {
            var year = parseInt($(this).text());
            var html = "<li>" + (year - 2) + "</li>" +
                "<li>" + (year - 1) + "</li>" +
                "<li class='active'>" + year + "</li>" +
                "<li>" + (year + 1) + "</li>" +
                "<li>" + (year + 2) + "</li>";
            $(".year").html(html);
        } else if ($(this).index() == 4) {
            var year = parseInt($(this).text());
            var curYear = new Date().getFullYear();
            if (year != curYear) {
                var html = "<li>" + (year - 2) + "</li>" +
                    "<li>" + (year - 1) + "</li>" +
                    "<li class='active'>" + year + "</li>" +
                    "<li>" + (year + 1) + "</li>" +
                    "<li>" + (year + 2) + "</li>";
                $(".year").html(html);
            }
        }
    });

    $(".quarter").find("li").each(function () {
        $(this).bind("click", function () {
            $(this).addClass('active').siblings().removeClass('active');
            // var year = $("#stime").val().substring(0,4);
            $("#qarter").val(parseInt($(this).text()));
            // setTimeByQarter(year,$(this).text());
            reloadGrid();
        });
    });


    var colname = ['标准化考评记录id', '车间名称', '扣分', '得分（总分1000）', '折合百分制', '一月份', '二月份', '三月份', '月度平均绩效', '最终得分(折合百分制*0.6+月度平均绩效*0.4)', '名次(环比)', '操作'];
    var colmodel = [
        {name: 'evalpandectlid', index: 'evalpandectlid', width: '5%', hidden: true},
        {
            name: 'entorgname',
            index: 'entorgname',
            width: '15%',
            align: 'left',
            formatter: function (cellvalue, options, obj) {
                return '<a href="javascript:void(0);" onclick="display(\'' + obj.evalpandectlid + '\')">' + obj.entorgname + '</a>';
            }
        },
        {name: 'deductscore', index: 'deductscore', width: '4%', align: 'left'},
        {name: 'getscore', index: 'getscore', width: '10%', align: 'left'},
        {name: 'centscore', index: 'centscore', width: '10%', align: 'left'},
        {name: 'firstmonthscore', index: 'firstmonthscore', width: '5%', align: 'left', editable: true},
        {name: 'secondmonthscore', index: 'secondmonthscore', width: '5%', align: 'left', editable: true},
        {name: 'threemonthscore', index: 'threemonthscore', width: '5%', align: 'left', editable: true},
        {name: 'monthmeanscore', index: 'monthmeanscore', width: '10%', align: 'left'},
        {
            name: 'finalscore',
            index: 'finalscore',
            width: '15%',
            align: 'left'
        },
        {
            name: 'ranking', index: 'ranking', width: '8%', align: 'center',
            formatter: function (cellvalue, options, obj) {
                return obj.ranking + "<image style='height: 14px;margin-left: 4px;position: relative;top: -2px;' src='../../../../images/main/icon_caret_"+(obj.rankingcompare?obj.rankingcompare:'0')+".png'/>";
            }
        },
        {
            name: 'act', index: 'act', width: '80px',fixed:true, align: 'left', formatter: function (cellvalue, options, obj) {
                if (cellvalue) {
                    return cellvalue;
                }
                return '<a  class="operation editInfoBtn" href="javascript:void(0);" onclick="editRow(\'' + options.rowId + '\');return false;">编辑</a><br>'
                	  +'<a  class="operation evaluationBtn" href="javascript:void(0);" onclick="editInfo(\'' + obj.evalpandectlid + '\');return false;">考评</a>';
            }
        }
    ];


    var tableHeight = $(window).height() - $('.pcheck').height() - 315;
    $(window).resize(function () {
        $("#grid-table").jqGrid('setGridHeight', $(window).height() - $('.pcheck').height() - 315);
        $("#grid-table").jqGrid('setGridWidth', $(window).width() - 40);
    });
    var lastsel = '';
    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "/enterprise/entstandardevalpandect/list",
        datatype: "json",
        cache: false,
        mtype: 'post',
        colNames: colname,
        colModel: colmodel,
        postData: {
            entid: $("#entid").val(),
            belongyear: currYear,
            belongquarter: $("#qarter").val()
        },
        sortname: 'FINALSCORE',
        sortorder: "asc",
        viewrecords: true,
        pager: "#grid-pager",
        jsonReader: {
            root: "datas",
            total: "total",
            page: "page",
            records: "records",
            repeatitems: false
        },
        rowNum: 20,
        rowList: [10, 20, 30],
        altRows: true,
        multiselect: true,
        caption: "标准化考评总览",
        //autowidth: true,
        editurl: BASE_URL + "/enterprise/entstandardevalpandect/save",
        loadComplete: function () {
            if ($(window).width() < 700) {
                $('.ui-jqgrid-htable').css({"width": "900"});
                $("#grid-table").css({"width": "900"});
                $("#grid-table").closest(".ui-jqgrid-bdiv").css({"overflow-x": "scroll"});
                $(".ui-jqgrid-hdiv").css({"overflow-x": "scroll"});
            } else {
                $("#grid-table").jqGrid('setGridWidth', $(window).width() - 40);
            }
        },
        // onSelectRow: function (id) {
        //     if (id && id !== lastsel) {
        //         // console.log(lastsel);
        //         // var rowdata = $("#grid-table").jqGrid('getRowData',lastsel);
        //         // //保存上一个编辑的数据
        //         // console.log(rowdata);
        //         // $("#grid-table").jqGrid('saveRow', lastsel,function () {
        //         //
        //         // },BASE_URL+"/enterprise/entstandardevalpandect/save",{evalpandectlid:rowdata.EVALPANDECTLID,
        //         //     firstmonthscore:rowdata.FIRSTMONTHSCORE,
        //         //     secondmonthscore:rowdata.SECONDMONTHSCORE,
        //         //     threemonthscore:rowdata.THREEMONTHSCORE,
        //         //     deductscore:rowdata.DEDUCTSCORE
        //         // });
        //
        //
        //
        //
        //         $("#grid-table").jqGrid('restoreRow', lastsel);
        //         $("#grid-table").jqGrid('editRow', id, true);
        //         lastsel = id;
        //     }
        // }
    });
    /*添加*/
    $("#evalBtn").on("click", function () {
        var ids = $("#grid-table").jqGrid('getGridParam', 'selarrrow');
        if (ids.length != 1) {
            // 弹出提示信息
            parent.parent.toast("请选择一条记录！");
            return;
        }
        var rowdata = $("#grid-table").jqGrid('getRowData', ids[0]); //选中的一条记录
        parent.parent.openWin(BASE_URL + "/views/module/enterprise/entstandardeval/entstandardevalAdd.html?evalpandectlid=" + rowdata.evalpandectlid, '添加', '60%', '75%');
    });


});
function editInfo(evalpandectlid) {
	parent.parent.openWin(BASE_URL + "/views/module/enterprise/entstandardeval/entstandardevalAdd.html?evalpandectlid=" + evalpandectlid, '添加', '60%', '75%');
}
function saveRow(id) {
    var rowdata = $("#grid-table").jqGrid('getRowData', id); //选中的一条记录
    var secondmonthscore = $("#" + id + "_secondmonthscore").val();
    var threemonthscore = $("#" + id + "_threemonthscore").val();
    var firstmonthscore = $("#" + id + "_firstmonthscore").val();
    //TODO
    $.ajax({
        url: BASE_URL + "/enterprise/entstandardevalpandect/save",
        type: 'post',
        dataType: 'json',
        data: {
            secondmonthscore: parseInt(secondmonthscore),
            threemonthscore: parseInt(threemonthscore),
            firstmonthscore: parseInt(firstmonthscore),
            deductscore: parseInt(rowdata.deductscore),
            evalpandectlid: rowdata.evalpandectlid
        },
        success: function (json) {
            if (json.success == true) {
                // parent.parent.toast(json.msg);
                reloadGrid();//刷新列表
                // refreshTree(json.exists); // 刷新左侧安全信息树
            } else {
                parent.parent.toast(json.msg);
            }
        }
    });

}

function editRow(id) {

    $("#grid-table").jqGrid('setRowData', id,
        {
            act: '<a href="javascript:void(0);" class="operation editInfoBtn" onclick="saveRow(' + id + ');return false;">保存</a>'
        });

    var rowdata = $("#grid-table").jqGrid('getRowData', id); //选中的一条记录
    console.log(rowdata);
    $("#grid-table").jqGrid('editRow', id);
    console.log(this);
}

/*加载*/
function reloadGrid() {
    $("#grid-table").jqGrid('setGridParam', {
        page: 1,
        postData: {entid: $("#entid").val(), belongyear: $("#belongyear").val(), belongquarter: $("#qarter").val()}
    }).trigger("reloadGrid");
}


/*详细查询*/
function display(evalpandectlid) {
    parent.parent.openWin(BASE_URL + "/views/module/enterprise/entstandardeval/entstandardevalDiaplay.html?evalpandectlid=" + evalpandectlid, '详细', '60%', '75%');
}


/*删除方法*/
function del(param) {
    //弹出提示框
    parent.parent.confirm('确认删除吗?', function () {
        $.ajax({
            url: BASE_URL + "/enterprise/entsafestandard/delete",
            type: 'post',
            dataType: 'json',
            data: param,
            success: function (json) {
                if (json.success == true) {
                    parent.parent.toast(json.msg);
                    reloadGrid();//刷新列表
                    refreshTree(json.exists); // 刷新左侧安全信息树
                } else {
                    parent.parent.toast(json.msg);
                }
            }
        });
    })
}

//刷新左侧安全信息树
function refreshTree(flag) {
    if (flag) {
        var index = parent.parent.getSelfIndex();
        parent.parent.frames["layui-layer-iframe" + index].$('#ent_safestandard').val("true");
        parent.parent.frames["layui-layer-iframe" + index].loadSafemenutree();
    } else {
        var index = parent.parent.getSelfIndex();
        parent.parent.frames["layui-layer-iframe" + index].$('#ent_safestandard').val("false");
        parent.parent.frames["layui-layer-iframe" + index].loadSafemenutree();
    }
}


/**
 * 季度切换
 */
function changQarter() {
    var curYear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;
    var curQarter = getQarter2Month(curMonth);
    switch (curQarter) {
        case 1:
            $("#one").addClass("active");
            break;
        case 2:
            $("#two").addClass("active");
            break;
        case 3:
            $("#three").addClass("active");
            break;
        case 2:
            $("#four").addClass("active");
            break;
    }
    $("#" + curQarter).addClass("active");
    $("#qarter").val(curQarter);
}


/**
 * 根据季度设置时间
 * @param qarter
 */
function setTimeByQarter(year, qarter) {
    if (qarter == 1) {
        $("#stime").val(year + "-01-01");
        $("#etime").val(year + "-03-31");
    } else if (qarter == 2) {
        $("#stime").val(year + "-04-01");
        $("#etime").val(year + "-06-30");
    } else if (qarter == 3) {
        $("#stime").val(year + "-07-01");
        $("#etime").val(year + "-09-30");
    } else if (qarter == 4) {
        $("#stime").val(year + "-10-01");
        $("#etime").val(year + "-12-31");
    }
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month) {
    if (1 <= month && month <= 3) {
        return 1;
    } else if (4 <= month && month <= 6) {
        return 2;
    } else if (7 <= month && month <= 9) {
        return 3;
    } else {
        return 4;
    }
}