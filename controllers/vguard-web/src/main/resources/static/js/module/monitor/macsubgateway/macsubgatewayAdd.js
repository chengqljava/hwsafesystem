/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * 设备维修
 */
$(function () {

    var subgatewayid = getQueryString("subgatewayid");
    $("#macsubgatewayForm").validate({
        rules: {
            gatewayid: {
                required: true
            },
            portname: {
                required: true
            },
            portnum: {
                required: true,
                remote: {
                    url: BASE_URL + '/monitor/macsubgateway/existsportnum',     //后台处理程序
                    type: "post",               //数据发送方式
                    dataType: "json",           //接受数据格式
                    data: {                     //要传递的数据
                        portnum: function () {
                            return $("#portnum").val();
                        },
                        subgatewayid: subgatewayid
                    }
                }
            },porttype:{
                required: true
            },baudrate:{
                required: true
            },intervaltime:{
                required: true
            }
        },
        messages: {
            gatewayid: {
                required: "所属网关不能为空"
            },
            portname: {
                required: "端口名称不能空"
            },
            portnum: {
                required: "端口号不能为空",
                remote: "端口号已存在"
            },porttype:{
                required: "请选择端口类型"
            },baudrate:{
                required: "请选择波特率"
            },intervaltime:{
                required: "轮训间隔不能为空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macsubgateway/load",
        dataType: "json",
        data: {
            "subgatewayid": subgatewayid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macsubgatewayTpt = _.template($("#macsubgatewayTpt")
                    .html());
                $("#macsubgatewayForm").html(macsubgatewayTpt(data));

                SelectOption.loadMacGatewaySelect("gatewayid");
                SelectOption.loadPortType("porttype");
                SelectOption.loadBaudrate("baudrate");

                window.portnum = data.portnum;

            }
        },
        error: function () {
            parent.toast("加载失败");
        }
    });

});

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

/**
 * 保存
 *
 * @returns
 */

function save() {

    var portnum = $("#portnum").val();
    if (window.portnum != null && window.portnum !== "" && parseInt(portnum) !== parseInt(window.portnum)) {
        parent.confirm("修改端口将会关闭端口为" + window.portnum + "的链路,是否确定修改,关闭后请手动重启端口为" + portnum + "的链路", function () {
            //TODO 关闭监听
            stopPort(portnum);
            $.ajax({
                type: "post",
                url: BASE_URL + "monitor/macsubgateway/save",
                data: $("#macsubgatewayForm").serializeArray(),
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

        });
        return;
    }

    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macsubgateway/save",
        data: $("#macsubgatewayForm").serializeArray(),
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

/**
 * 启动监听程序
 */
function stopPort(port) {
    $.ajax({
        url: BASE_URL + "datagather/stopByPort",
        type: "post",
        dataType: "json",
        data: {
            port: port
        },
        success: function (json) {
        }
    });
}
