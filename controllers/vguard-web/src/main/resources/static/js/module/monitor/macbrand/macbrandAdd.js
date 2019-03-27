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

    var brandid = getQueryString("brandid");
    $("#macbrandForm").validate({
        rules: {
            brandname: {
                required: true
            },
            brandnum: {
                required: true
            }
        },
        messages: {
            brandname: {
                required: "品牌名称不能为空"
            },
            brandnum: {
                required: "品牌编码不能空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macbrand/load",
        dataType: "json",
        data: {
            "id": brandid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macbrandTpt = _.template($("#macbrandTpt")
                    .html());
                var isEnt = data.isEnt;
                $("#macbrandForm").html(macbrandTpt(data));
                if(isEnt){
                    $("#ent").hide();
                }else{
                    SelectTwo.initSelect2($('#entname'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
                }

            }
        },
        error: function () {
            parent.toast("加载失败");
        }
    });

});

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#entid").val(repo.id);
    return repo.text;
}

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
        url: BASE_URL + "monitor/macbrand/save",
        data: $("#macbrandForm").serializeArray(),
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
