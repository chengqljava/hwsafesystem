$(document).ready(function () {

    var alarmFaultIds = getQueryString("alarmFaultIds");
    var alarmFaultId = getQueryString("alarmFaultId");
    var alarmMonitorIds = getQueryString("alarmMonitorIds");
    var alarmMonitorId = getQueryString("alarmMonitorId");
    $("#alarmMonitorId").val(alarmMonitorId);
    $("#alarmFaultId").val(alarmFaultId);
    $("#alarmMonitorIds").val(alarmMonitorIds);
    $("#alarmFaultIds").val(alarmFaultIds);

    $("#alermHandleForm").validate({
        rules: {
            handletime: {
                required: true
            },
            notes: {
                required: true
            }
        },
        messages: {
            handletime: {
                required: "处理时间不能为空"
            },
            notes: {
                required: "描述不能为空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });
});

/**保存*/
function save() {

    var alermHandleJson = {};

    $.each($("#alermHandleForm").serializeArray(), function () {
        alermHandleJson[this.name] = this.value;
    });

    var url;


    if ($("#alarmFaultId").val() != "") {

        url = '/monitor/macalarmfault/handleAlarm';
        delete alermHandleJson["alarmMonitorIds"];
        delete alermHandleJson["alarmFaultIds"];
        delete alermHandleJson["alarmmonitorid"];
    } else if ($("#alarmMonitorId").val() != "") {
        url = '/monitor/macalarmmonitor/handleAlarm';
        delete alermHandleJson["alarmMonitorIds"];
        delete alermHandleJson["alarmFaultIds"];
        delete alermHandleJson["alarmfaultid"];
    } else {
        url = '/monitor/monitorcondition/batchHandleAlarm';
        delete alermHandleJson["alarmmonitorid"];
        delete alermHandleJson["alarmfaultid"];
    }

    var param = {
        "alermHandleJson": JSON.stringify(alermHandleJson)
    };

    $.ajax({
        type: 'post',
        url: BASE_URL + url,
        cache: false,
        dataType: 'json',
        data: param,
        global: false,
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);//弹出提示信息
                window.top.GEventObject.fireEvent('REFERESH_EVENT', json);
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error: function () {
            parent.parent.toast("保存失败");
        }
    });
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}