/*新增或编辑课程管理*/
$(function () {

    var alarmids = getQueryString("alarmids");
    $("#dutyalarmForm").validate({
        rules : {
            eventname : {
                required : true
            },
            time : {
                required : true
            },
            address : {
                required : true
            },
            eventtypeid : {
                required : true
            },
            eventlevel : {
                required : true
            },
            reason : {
                required : true
            },
            content : {
                required : true
            },
            casualty : {
                required : true
            },
            longitude: {
                required: true,
                validateitude: true/*,
                    range:[107.16, 111.53]*/
            },
            latitude: {
                required: true,
                validateitude: true/*,
                    range:[37.64, 41.67]*/
            }

        },
        messages : {
            eventname : {
                required : "事故名称不能为空"
            },
            time : {
                required : "发生时间不能为空"
            },
            address : {
                required : "发生地址不能为空"
            },
            eventtypeid : {
                required : "事故类型不能为空"
            },
            eventlevel : {
                required : "事故等级不能为空"
            },
            reason : {
                required : "事故原因不能为空"
            },
            content : {
                required : "事故概述不能为空"
            },
            casualty : {
                required : "伤亡情况不能为空"
            },
            longitude: {
                required: "经度不能为空",
                validateitude: "请输入小数且小数位最多4位"/*,
                    range:"经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
            },
            latitude: {
                required: "纬度不能为空",
                validateitude: "请输入小数且小数位最多4位"/*,
                    range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
            }
        },
        submitHandler: function (form) {
            save();
        }
    });
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/loadevent",
        dataType: "json",
        data: {
        	warnalarmids: alarmids
        },
        success: function (data) {
            if (data) {
                var dutyalarmTpt = _.template($("#dutyalarmTpt").html());
                $("#dutyalarmForm").html(dutyalarmTpt(data));
                var downloadurl = BASE_URL + 'ems/emssucattach/download/';
                showMultipleInputFile("fileDiv", "eventfile", "file", null, downloadurl, true);

                SelectOption.loadAcclevel("eventlevel");//事故等级
                SelectTree.loadEventTypeAllTreeSelect("eventtypeid");//事故类型
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});

/*保存(新增或编辑)*/
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
        files: arrId,
        async: false,
        url: BASE_URL + "ems/emsdutyalarm/saveevent",
        data: $("#dutyalarmForm").serializeArray(),
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
        },
        error: function () {
            parent.toast("编辑失败");
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 * 定位
 */
function position(){
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude= encodeURIComponent($('#latitude').val());
    var areaName = encodeURIComponent($('#area').val());
    var isDisplay = $("#isDisplay").val();

    //当编辑地图点位时
    if ("0" == isDisplay) {
        window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
        window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function(param) {
            $('#longitude').val(param.lng);
            $('#latitude').val(param.lat);
        });
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay="+ isDisplay, "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);
}