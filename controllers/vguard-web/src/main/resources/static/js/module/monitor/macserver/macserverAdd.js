/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
$(function () {
    var serverid = getQueryString("serverid");
    //获取服务器信息
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macserver/load",
        dataType: "json",
        data: {
            serverid: serverid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macdeviceinfo = data.macDeviceinfo;
                var macServer = data.macServer;
                var isEnt = data.isEnt;

                var deviceinfoTpt = _.template($("#macdeviceinfoTpt").html()),
                    macserverTpt = _.template($("#macserverTpt").html());

                $("#macdeviceinfoForm").html(deviceinfoTpt(macdeviceinfo));
                $("#macserverForm").html(macserverTpt(macServer));
                if(isEnt){
                    $(".ent").hide();
                    $("#dept").attr("colSpan",3);
                }

                SelectOption.loadConnectstate("connectstate");
                SelectOption.loadUsestate("usestate");
                SelectOption.loadDevicetype("devicetypeid");
                SelectOption.loadMacBrand("brandid");
                SelectOption.loadMacBrandType("brandtypeid");
                SelectTwo.initSelect2($('#entname'), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo", '请选择企业', formatRepo, formatRepoSelection);
                $("#lastStepBtn").off('click').on('click',function () {
                    timeShowOrHide(1);
                });


            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

    $('body').on('click', '.timeMark', function () {
        var index = $(this).data('index');
        var sIndex = $('li.selected:last').data('index');
        if (index > sIndex) {
            return 0;
        }
        timeShowOrHide(index);
    });
    $("#macdeviceinfoForm").validate({
        rules: {
            devicename: {
                required: true
            },
            entid:{
                required:true
            },
            devicetypeid:{
                required:true
            },
            brandid:{
                required:true
            },
            brandtypeid:{
                required:true
            }
        },
        messages: {
            devicename: {
                required: "设备名称不能为空"
            },
            entid:{
                required:"请选择所属企业"
            },
            devicetypeid:{
                required:"请选择设备类型"
            },
            brandid:{
                required:"请选择品牌系列"
            },
            brandtypeid:{
                required:"请选择规格型号"
            }
        },
        submitHandler: function (form) {
           timeShowOrHide(2);
        }
    });
    $("#macserverForm").validate({
        rules: {
            inip1: {
                required: true
            }
        },
        messages: {
            inip1: {
                required: "内网地址不能为空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    })


});


/**
 * 保存
 *
 * @returns
 */

function save() {


    var data = $("#macdeviceinfoForm").serializeArray();
    var data2 = $("#macserverForm").serializeArray();
    $.each(data2,function (index, item) {
       data.push({name:item.name,value:item.value});
    });
    $.ajax({
        type : "post",
        url : BASE_URL + "monitor/macserver/save",
        data : data,
        success : function(data) {
            if(data.success==true){
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//刷新列表
                parent.closeWin();// 关闭弹出框
            }else{
                parent.toast(data.msg);
            }
        },
        error : function() {
            parent.toast("保存失败");
        }
    });

}



//时间轴显示控制方法
function timeShowOrHide(index) {
    $('.timeMark').each(function (i, item) {
        if (i < index) {
            $(item).addClass('selected');
        }
        else {
            $(item).removeClass('selected');
        }
    })
    switch (index) {
        case 1:
            $('#macdeviceinfo').show();
            $('#macserver').hide();
            break;
        case 2:
            $('#macdeviceinfo').hide();
            $('#macserver').show();
            break;

    }
}
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


/**
 * 获取当前url访问路径后缀参数值
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
