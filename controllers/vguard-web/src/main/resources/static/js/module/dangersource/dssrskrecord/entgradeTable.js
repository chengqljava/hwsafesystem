/*新增或编辑场所环境*/
$(function () {
    var businessinfoid = getQueryString("businessinfoid");
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskrecord/loadEntTable",
        dataType: "json",
        data: {
            businessinfoid: businessinfoid
        },
        success: function (data) {
            if (data) {
                var entgradeTableTpt = _.template($("#entgradeTableTpt").html());
                $("#entgradeTableForm").html(entgradeTableTpt(data));
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });


});

function showDetail(rskrecordid) {
    console.log(rskrecordid);
}

function line(x1, y1, x2, y2, color) {
    var tmp
    if (x1 >= x2) {
        tmp = x1;
        x1 = x2;
        x2 = tmp;
        tmp = y1;
        y1 = y2;
        y2 = tmp;
    }
    for (var i = x1; i <= x2; i++) {
        x = i;
        y = (y2 - y1) / (x2 - x1) * (x - x1) + y1;
        a(x, y, color);
    }
}

function a(x, y, color) {
    $("#entgradeTableForm").append("<img border='0' style='position: absolute; left: "
        + (x + 20) + "; top: " + (y + 20) + ";background-color: "
        + color + "' width=1 height=1>")
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
