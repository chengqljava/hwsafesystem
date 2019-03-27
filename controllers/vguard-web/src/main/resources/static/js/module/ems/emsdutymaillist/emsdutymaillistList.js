$(document).ready(function () {
    $("#tableOpers").displayOper();

    var colname = ["通讯录id","姓名", "办公电话", "移动电话", "家庭电话", "用户类型",  "职务代码"],
        colmodel = [
            {
                name: "MAILLISTID",
                index: "MAILLISTID",
                align: "center",
                sortable: false,
                hidden: true
            }, {
                name: "NAME",
                index: "NAME",
                width: "15%",
                align: "center",
                sortable: false
            }, {
                name: "OFFICEPHONE",
                index: "OFFICEPHONE",
                width: "5%",
                align: "center",
                sortable: false
            }, {
                name: "MOBILEPHONE",
                index: "MOBILEPHONE",
                width: "5%",
                align: "center",
                sortable: false
            }, {
                name: "FAMILYPHONE",
                index: "FAMILYPHONE",
                width: "5%",
                align: "center",
                sortable: false
            }, {
                name: "ALARMUNIT",
                index: "alarmunit",
                width: "10%",
                align: "center",
                sortable: false
            }, {
                name: "ENTNAME",
                index: "ENTNAME",
                width: "5%",
                align: "center",
                sortable: false
            }, {
                name: "EVENTNAME",
                index: "EVENTNAME",
                width: "5%",
                align: "center",
                sortable: false
            },
            {
                name: "EVENTID",
                index: "EVENTID",
                width: "5%",
                align: "center",
                sortable: false,
                hidden: true
            }];
    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "ems/emsdutyalarm/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {},
        sortname: "warnalarmid",
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
        multiselect: true,
        caption: "值守接警信息",
        autowidth: true
    });

    //查询按钮事件
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    //添加接警信息
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emsdutyalarmAdd.html?warnalarmid=-1",
            '添加警情信息', '70%', '55%');
    });

    //添加接警信息
    $("#eventBtn").off("click").on("click", function () {

        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");

        console.log(curSelRowArr);
        if (1 > curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请至少选择一条数据！");
            return;
        }
        var alarmids = [];
        var isCanOpen = true;
        _.each(curSelRowArr, function (index) {
            var dutyalaramdata = $("#grid-table").jqGrid("getRowData", index);
            console.log(dutyalaramdata);
            if(dutyalaramdata.EVENTID!==""){
                isCanOpen = false;
                return;
            }
            alarmids.push(dutyalaramdata.WARNALARMID);
        });
        if(!isCanOpen){
            parent.toast("请选择未关联事故的警情！");
            return;
        }



        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emssuceventAdd.html?warnalarmids=" + alarmids.join(","),
            '生成事故', '70%', '90%');
    });

    //修改接警信息
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }
        var warnalarmid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).WARNALARMID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/ems/emsdutyalarm/emsdutyalarmAdd.html?warnalarmid=" + warnalarmid,
            '修改警情信息', '70%', '55%');

    });
});

/**
 * 详细查看场所类型
 */
function display(warnalarmid) {
    //返回当前grid中复选框所选择的数据的id
    parent.openWin(BASE_URL + "views/module/ems/emsdutyalarm/emsdutyalarmDisplay.html?warnalarmid=" + warnalarmid,
        "警情信息详情", "40%", "30%");
}

/**
 * 刷新时加载查询条件
 */
function reloadGrid() {
    var title = $("#title").val();
    var reciveperson = $("#reciveperson").val();
    var alarmphone = $("#alarmphone").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            title: title || "",
            reciveperson: reciveperson || "",
            alarmphone: alarmphone || ""
        }
    }).trigger("reloadGrid");
}