$(document).ready(function () {

    SelectTree.loadEmsResOrgSelect("parentname");
    
    var validateOpts = {
            rules: {
                orgno: {
                    required: true,
                    remote: {
                        url: BASE_URL + '/ems/emsresorg/existsOrgno',     //后台处理程序
                        type: "post",               //数据发送方式
                        dataType: "json",           //接受数据格式
                        data: {                     //要传递的数据
                            orgid: function () {
                                return $("#orgid").val();
                            },
                            orgno: function () {
                                return $("#orgno").val();
                            }
                        }
                    }
                },
                orgname: {
                    required: true
                },
                districtname: {
                    required: true
                },
                longitude: {
                    required: true,
                    validateitude: true/*,
                    range: [107.16, 111.53]*/
                },
                latitude: {
                    required: true,
                    validateitude: true/*,
                    range: [37.64, 41.67]*/
                },
                orgduties: {
                    maxlength: 250
                }
            },
            messages: {
                orgno: {
                    required: "机构编号不能为空",
                    remote: "机构编号已存在!"
                },
                orgname: {
                    required: "机构名称不能为空"
                },
                districtname: {
                    required: "所在区域不能为空"
                },
                longitude: {
                    required: "经度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range: "经度输入范围在 {107.16} 到 {111.53} 之间的数值"*/
                },
                latitude: {
                    required: "纬度不能为空",
                    validateitude: "请输入小数且小数位最多4位"/*,
                    range: "纬度输入范围在 {37.64} 到 {41.67} 之间的数值"*/
                },
                orgduties: {
                    maxlength: "最多输入250个字"
                }
            },
            submitHandler: function (form) {
                save();
            }
        };
    
    //获取最新经纬度限制范围
    $.getJSON(BASE_URL + "/config/gisPtAreaRange.json", function(data) {
    	if (data && 0 != data.lngStart) {
    		validateOpts.rules.longitude.range = [data.lngStart, data.lngEnd];
    		validateOpts.rules.latitude.range = [data.latStart, data.latEnd];
    		validateOpts.messages.longitude.range = "经度输入范围在 {" + data.lngStart + "} 到 {" + data.lngEnd + "} 之间的数值";
    		validateOpts.messages.latitude.range = "纬度输入范围在 {" + data.latStart + "} 到 {" + data.latEnd + "} 之间的数值";
    	}
    	$("#orgform").validate(validateOpts);
    });
});


/**保存*/
function save() {
    $.ajax({
        type: 'post',
        url: BASE_URL + '/ems/emsresorg/save',
        cache: false,
        dataType: 'json',
        data: $("#orgform").serializeArray(),
        global: false,
        success: function (json) {
            if (json.success == true) {
                parent.toast(json.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//刷新列表
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(json.msg);
            }
        },
        error: function () {
            parent.toast("保存失败");
        }
    });
}

/**
 * 定位
 */
function position() {
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude = encodeURIComponent($('#latitude').val());
    var areaName = encodeURIComponent($('#districtid').val());

    window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
    window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function (param) {
        $('#longitude').val(param.lng);
        $('#latitude').val(param.lat);
    });
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=0", "地理定位", "50%", "50%", false);
//    parent.parent.openWin(BASE_URL+"/olgis/gisOperBuss/position?module=gis&type=edit&longitude="+longitude+"&latitude="+latitude+"&areaName="+areaName+"&register=null",'地理定位','50%','50%',false);  
}

