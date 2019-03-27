/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

/**
 */
$(function () {

    var businessinfoid = getQueryString("businessinfoid");
    $("#entbusinessinfoForm").validate({
        rules: {
            entname: {
                required: true
            }
        },
        messages: {
            entname: {
                required: "请填写企业名称"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/entbusinessinfo/loadEntInfo",
        dataType: "json",
        data: {
            "businessinfoid": businessinfoid
        },
        success: function (data) {
            if (data) {
                var entbusinessinfoTpt = _.template($("#entbusinessinfoTpt")
                    .html());
                $("#entbusinessinfoForm").html(entbusinessinfoTpt(data));
                showUploadFile("fileUploadDiv", 'image', true, true);// 显示文件上传控件
            }
        },
        error: function () {
            toast("加载失败");
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

    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "enterprise/entbusinessinfo/saveEntInfo",
        files: arrId,
        dataType: "json",
        data: $("#entbusinessinfoForm").serializeArray(),
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });

}
