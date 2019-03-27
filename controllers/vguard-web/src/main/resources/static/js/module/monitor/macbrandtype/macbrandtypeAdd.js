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

    var brandtypeid = getQueryString("brandtypeid");
    $("#macbrandtypeForm").validate({
        rules: {
            brandid: {
                required: true
            },
            devicetypeid: {
                required: true
            },
            brandtypename: {
                required: true
            },
            brandtypenum: {
                required: true
            }
        },
        messages: {
            brandid: {
                required: "请选择所属品牌"
            },
            devicetypeid: {
                required: "请选择设备类型"
            },
            brandtypename: {
                required: "型号名称不能为空"
            },
            brandtypenum: {
                required: "型号编码不能空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macbrandtype/load",
        dataType: "json",
        data: {
            "id": brandtypeid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macbrandtypeTpt = _.template($("#macbrandtypeTpt")
                    .html());
                $("#macbrandtypeForm").html(macbrandtypeTpt(data));

                SelectOption.loadDevicetype("devicetypeid");
                SelectOption.loadMacBrand("brandid");

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
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macbrandtype/save",
        data: $("#macbrandtypeForm").serializeArray(),
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
