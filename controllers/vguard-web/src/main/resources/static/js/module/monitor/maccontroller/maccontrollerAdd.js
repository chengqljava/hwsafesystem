/*
 * Copyright (c) 2018. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */
$(function () {
    var controllerid = getQueryString("controllerid");
    //获取服务器信息
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/maccontroller/load",
        dataType: "json",
        data: {
            controllerid: controllerid
        },
        success: function (data) {
            if (data) {
                console.log(data);
                var macdeviceinfo = data.macDeviceinfo;
                var macController = data.macController;
                var isEnt = data.isEnt;
                window.portnum = macController.portnum;
                window.protocol = macController.protocol;

                var deviceinfoTpt = _.template($("#macdeviceinfoTpt").html()),
                    maccontrollerTpt = _.template($("#maccontrollerTpt").html());

                $("#macdeviceinfoForm").html(deviceinfoTpt(macdeviceinfo));
                $("#maccontrollerForm").html(maccontrollerTpt(macController));
                if(isEnt){
                    $(".ent").hide();
                    $("#dept").attr("colSpan",3);
                }
                SelectOption.loadConnectstate("connectstate");
                SelectOption.loadUsestate("usestate");
                SelectOption.loadDevicetype("devicetypeid");
                SelectOption.loadMacBrand("brandid");
                SelectOption.loadMacBrandType("brandtypeid");
                SelectOption.loadMacSubGatewaySelect("subgatewayid");
                SelectOption.loadProtocol("protocol");
                SelectOption.loadBaudrate("baudrate");
                SelectOption.loadInterfaceType("interfacetype");
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
    $("#maccontrollerForm").validate({
        rules: {
            address: {
                required: true
            },interfacetype:{
                required: true
            },protocol:{
                required: true
            },baudrate:{
                required: true
            },subgatewayid:{
                required: true
            }
        },
        messages: {
            address: {
                required: "通讯地址不能为空"
            },interfacetype:{
                required: "请选择上传接口类型"
            },protocol:{
                required: "请选择上传协议"
            },baudrate:{
                required: "请选择波特率"
            },subgatewayid:{
                required: "请选择所属链路"
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

    var protocol = $("#protocol").val();
    var data = $("#macdeviceinfoForm").serializeArray();
    var data2 = $("#maccontrollerForm").serializeArray();
    $.each(data2,function (index, item) {
       data.push({name:item.name,value:item.value});
    });
    if(window.protocol!=null && window.protocol!=="" && protocol !== window.protocol){
        parent.confirm("修改协议将会关闭端口为" + window.portnum + "的链路,是否确定修改,关闭后请手动重启端口为" + window.portnum + "的链路", function () {
            stopPort(window.portnum);
            $.ajax({
                type : "post",
                url : BASE_URL + "monitor/maccontroller/save",
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

        });
        return;
    }

    $.ajax({
        type : "post",
        url : BASE_URL + "monitor/maccontroller/save",
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
            $('#maccontroller').hide();
            break;
        case 2:
            $('#macdeviceinfo').hide();
            $('#maccontroller').show();
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
