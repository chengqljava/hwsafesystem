/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

$(function () {
    //显示操作权限按钮
    $("#tableOpers").displayOper();
    window.startPorts = [];
    getStartedPort();


    //生成服务器列表分页表格
    var colname = ["SUBGATEWAYID","通讯链路名称", "所属网关", "端口号", "端口类型","波特率","轮训间隔","备注","监听状态"],
        colmodel = [
            {
                name: "SUBGATEWAYID",
                index: "SUBGATEWAYID",
                width: "5%",
                align: "left",
                sortable: false,
                hidden: true
            },{
                name: "PORTNAME",
                index: "PORTNAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "DEVICENAME",
                index: "DEVICENAME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "PORTNUM",
                index: "PORTNUM",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "PORTTYPE",
                index: "PORTTYPE",
                width: "10%",
                align: "left",
                sortable: true,
                formatter:function (cellvalue, options, obj) {
                    return SelectOption.getPortType(obj.PORTTYPE);
                }
            },
            {
                name: "BAUDRATE",
                index: "BAUDRATE",
                width: "10%",
                align: "left",
                sortable: true,
                formatter:function (cellvalue, options, obj) {
                    return SelectOption.getBaudrate(obj.BAUDRATE);
                }
            },
            {
                name: "INTERVALTIME",
                index: "INTERVALTIME",
                width: "10%",
                align: "left",
                sortable: true
            },
            {
                name: "NOTES",
                index: "NOTES",
                width: "10%",
                align: "left",
                sortable: true
            },{
                name: "PORTSTATUS",
                index: "PORTSTATUS",
                width: "10%",
                align: "left",
                sortable: true,
                formatter:function(cellvalue, options, obj) {
                    var isStart =false;
                    console.log(window.startPorts);
                    $.each(window.startPorts,function (index,port) {
                       if(port === parseInt(obj.PORTNUM)){
                           isStart = true;
                       }
                    });
                    if(isStart){
                        return "<a href='javascript:void(0)' onclick='stopPort(\""+obj.PORTNUM+"\")'>已启动</a>";
                    }else{
                        return "<a href='javascript:void(0)' onclick='startPort(\""+obj.PORTNUM+"\")'>未启动</a>";
                    }

                }
            },
        ];

    //分页表格响应式处理
    var tableHeight = $(window).height() - $(".pcheck").height() - 190 - 33;
    $(window).resize(function () {
        $("#grid-table").jqGrid("setGridHeight", $(window).height() - $('.pcheck').height() - 190 - 33);
        $("#grid-table").jqGrid("setGridWidth", $(window).width() * 0.99);
    });

    $("#grid-table").jqGrid({
        height: tableHeight,
        url: BASE_URL + "monitor/macsubgateway/list",
        datatype: "json",
        cache: false,
        mtype: "POST",
        colNames: colname,
        colModel: colmodel,
        postData: {
            devicetypename:''
        },
        sortname: "CREATETIME",
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
        caption: "通讯链路列表",
        autowidth: true
    });

    //新增设备类型
    $("#addBtn").off("click").on("click", function () {
        parent.openWin(BASE_URL
            + "views/module/monitor/macsubgateway/macsubgatewayAdd.html?subgatewayid=-1",
            '新增通讯链路', '50%', '50%');
    });





    //编辑设备类型
    $("#editBtn").off("click").on("click", function () {
        //返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (1 != curSelRowArr.length) {
            // 弹出提示信息
            parent.toast("请选择一条数据进行编辑！");
            return;
        }

        var subgatewayid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SUBGATEWAYID;
        //TODO 弹出编辑框
        parent.openWin(BASE_URL
            + "views/module/monitor/macsubgateway/macsubgatewayAdd.html?subgatewayid=" + subgatewayid,
            '编辑通讯链路', '50%', '50%');

    });

    //点击查询
    $("#searchbtn").off("click").on("click", function () {
        reloadGrid();
    });

    $("#startBtn").off("click").on("click",function () {
       startAllServer();
    });

    //删除
    $("#delBtn").off("click").on("click", function () {
        // 返回当前grid中复选框所选择的数据的id
        var curSelRowArr = $("#grid-table").jqGrid("getGridParam", "selarrrow");
        if (curSelRowArr.length!=1) {
            // 弹出提示信息
            parent.toast("请选择一条需要删除的数据！");
            return;
        }
        var subgatewayid = $("#grid-table").jqGrid("getRowData", curSelRowArr[0]).SUBGATEWAYID;

        $.ajax({
            url: BASE_URL + "monitor/macsubgateway/havesubgateway",
            type: "post",
            dataType: "json",
            data: {
                subgatewayid:subgatewayid
            },
            success: function (json) {
                if (json.success == true) {
                    //弹出提示框
                    parent.toast(json.msg);

                } else {
                    parent.confirm("确认删除该通讯链路吗?", function () {
                        $.ajax({
                            url: BASE_URL + "monitor/macsubgateway/delete",
                            type: "post",
                            dataType: "json",
                            data: {
                                subgatewayid:subgatewayid
                            },
                            success: function (json) {
                                if (json.success == true) {
                                    parent.toast(json.msg);
                                    reloadGrid();// 刷新列表
                                } else {
                                    parent.toast(json.msg);
                                }
                            }
                        });
                    });
                }
            }
        });
    });


    $("#resetbtn").off("click").on("click", function () {
    });
});

function getStartedPort() {
    $.ajax({
        url: BASE_URL + "datagather/getStartedPorts",
        type: "get",
        dataType: "json",
        data: {
        },
        success: function (json) {
            window.startPorts = json;
        }
    });
}


/**
 * 启动监听程序
 */
function stopPort(port) {
    $.ajax({
        url: BASE_URL + "datagather/stopByPort",
        type: "post",
        dataType: "json",
        data: {
            port:port
        },
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);
                var startPorts = [];
                $.each(window.startPorts,function (index, item) {
                    if(parseInt(item) !== parseInt(port)){
                        startPorts.push(item);
                    }
                });
                window.startPorts = startPorts;
                console.log(window.startPorts+"STOP");
                reloadGrid();// 刷新列表
            } else {
                parent.toast(json.msg);
            }
        }
    });
}

/**
 * 启动监听程序
 */
function startPort(port) {
    $.ajax({
        url: BASE_URL + "datagather/startByPort",
        type: "post",
        dataType: "json",
        data: {
            port:port
        },
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);
                window.startPorts.push(parseInt(port));
                console.log(window.startPorts+"START");
                reloadGrid();// 刷新列表
            } else {
                parent.toast(json.msg);
            }
        }
    });
}

/**
 * 启动监听程序
 */
function startAllServer() {
    $.ajax({
        url: BASE_URL + "datagather/startAllServer",
        type: "post",
        dataType: "json",
        data: {
        },
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);
                getStartedPort();
                reloadGrid();// 刷新列表
            } else {
                parent.toast(json.msg);
            }
        }
    });
}


/**
 * 详细查看
 */
function display(demarcateid, name) {
    parent.openWin(BASE_URL + "views/module/monitor/macdemarcate/macdemarcateDisplay.html?demarcateid=" + demarcateid,
        name, "50%", "45%");
}

/**
 * 刷新加载服务器分页表格数据
 */
function reloadGrid() {
    var servername = $("#servername").val();
    $("#grid-table").jqGrid("setGridParam", {
        page: 1,
        postData: {
            servername: servername || ""
        }
    }).trigger("reloadGrid");
}