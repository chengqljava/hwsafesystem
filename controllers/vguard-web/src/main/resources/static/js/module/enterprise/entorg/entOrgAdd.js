/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 * 部门新增和编辑
 */
$(function () {
    var entorgid = getQueryString("entorgid");
    $("#entorgForm").validate({
        rules: {
            entorgname: {
                required: true
            }, entorgtype: {
                required: true
            },pentorgid:{
                required:true
            }
        },
        messages: {
            entorgname: {
                required: "企业名称不能为空"
            }, entorgtype: {
                required: "请选择部门性质"
            },pentorgid:{
                required:"请选择所属部门"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entorg/load",
        dataType: "json",
        data: {
            "entorgid": entorgid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var entorgTpt = _.template($("#entorgTpt")
                    .html());
                $("#entorgForm").html(entorgTpt(data));
                SelectTree.loadEntOrgTree("pentorgid");
                SelectOption.loadEntOrgType("entorgtype");
                if(data.entorgtype === '2'){
                    $(".chejian").show();
                }
                $("#entorgtype").bind("change", function () {
                    var entorgtype = $(this).val();

                    if (entorgtype === '1') {
                        $(".chejian").hide();
                    } else if(entorgtype === '2'){
                        $(".chejian").show();
                    }
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.iframeAuto(index);
                });

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
        url: BASE_URL + "enterprise/entorg/save",
        data: $("#entorgForm").serializeArray(),
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
