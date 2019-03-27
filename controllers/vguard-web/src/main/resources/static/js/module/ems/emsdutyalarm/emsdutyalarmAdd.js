/*新增或编辑课程管理*/
$(function () {

    var warnalarmid = getQueryString("warnalarmid");
    $("#dutyalarmForm").validate({
        rules: {
            warnalarmtitle: {
                required: true,
                maxlength: 50
            },
            alarmperson: {
                required: true,
                maxlength: 25
            },
            alarmphone: {
            	required: true,
            	checkPhoneNum: true
//            	isPhone:true
            },
            alarmtime: {
            	required: true
            },
            policeofficerseat: {
            	required: true
            },
            warnalarmtype:{
            	required: true
            },
            alarmchannel: {
                required: true
            },
            longitude: {
                required: true
            },
            latitude: {
                required: true
            },
            pollutionmsg: {
                required: true
            },
            alarmcontent: {
                required: true
            }

        },
        messages: {
            warnalarmtitle: {
                required: "标题不能为空",
                maxlength: "最多输入50字"
            },
            alarmperson: {
                required: "报警人不能为空",
                maxlength: "最多输入25个字"
            },
            alarmphone: {
            	required: "报警电话不能为空",
            	checkPhoneNum: "请输入正确格式的电话号码"
//            	isPhone:"请输入正确的手机号码格式"
            },
            alarmtime: {
            	required: "报警时间不能为空",
            },
            businessinfoid: {
                required: "请选择关联企业"
            },
            policeofficerseat: {
            	required: "坐席号不能为空"
            },
            warnalarmtype:{
            	required: "报警类别不能为空"
            },
            alarmchannel: {
                required: "报警渠道不能为空"
            },
            longitude: {
                required: "请选择警情地点"
            },
            latitude: {
                required: "请选择警情地点"
            },
            pollutionmsg: {
                required: "关键词不能为空"
            },
            alarmcontent: {
                required: "警情内容不能为空"
            }
        },
        submitHandler: function (form) {
        	console.log("1");
            save();
        }
    });
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/load",
        dataType: "json",
        data: {
            warnalarmid: warnalarmid
        },
        success: function (data) {
            if (data) {
                var dutyalarmTpt = _.template($("#dutyalarmTpt").html());
                $("#dutyalarmForm").html(dutyalarmTpt(data));
            	if (data.alarmchannel == '5') {
//            		$("#callAlarm1").show();
//            		$("#callAlarm2").show();
//            		$("#callAlarm3").show();
            		$("#callAlarm").hide();
            	}else if (data.alarmchannel == '6'){
//            		$("#callAlarm1").hide();
//            		$("#callAlarm2").hide();
//            		$("#callAlarm3").hide();
            		$("#callAlarm").hide();
            	} else if( data.alarmchannel == '1') {
            		$("#dutyAlarm1").hide();
            		$("#dutyAlarm2").hide();
//            		$("#callAlarm4").hide();
//            		$("#callAlarm5").hide();
            	} else {
            		$("#callAlarm").hide();
//            		$("#callAlarm1").hide();
//            		$("#callAlarm2").hide();
//            		$("#callAlarm3").hide();
            	}
                
                SelectOption.loadWarnAlarmType("warnalarmtype");
                selBusinessinfo($("#entname"), BASE_URL + "enterprise/entbusinessinfo/searchEntSimpleInfo");
                selEvent($("#eventname"), BASE_URL + "ems/emssucevent/list");
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});


function alarmType(type){
//	if (type == '5') {
//		$("#callAlarm1").show();
//		$("#callAlarm2").show();
//		$("#callAlarm3").show();
//	}else{
//		$("#callAlarm1").hide();
//		$("#callAlarm2").hide();
//		$("#callAlarm3").hide();
//	}
}

/*保存(新增或编辑)*/
function save() {
	console.log("1");
	var source = "dutyalarm";
	var sourceData = {name: 'source', value: source};
	var dataForm =  $("#dutyalarmForm").serializeArray();
	dataForm.push(sourceData);
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emsdutyalarm/save",
        data: dataForm,
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.getActiveIFrame().reloadGrid();//重新加载
                parent.closeWin();// 关闭弹出框
            } else {
                parent.toast(data.msg);
            }
            autoHeight();
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
 * 查询企业
 * @param $ajax
 * @param url
 */
function selBusinessinfo($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    entname: params.term, // search term
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.length; i++) {
                    itemList.push({
                            id: data[i].ID,
                            text: data[i].TEXT,
                            longitude: data[i].LONGITUDE,
                            latitude: data[i].LATITUDE
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "请选择",
        language: "zh-CN",
        templateResult: formatRepo, // omitted for brevity, see the source of this page
        templateSelection: formatEntSelection // omitted for brevity, see the source of this page
    });
}


/**
 * 查询企业
 * @param $ajax
 * @param url
 */
function selEvent($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    name: params.term, // search term
                    stime: "", // search term
                    etime: "", // search term
                    rows: "10",
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                // parse the results into the format expected by Select2
                // since we are using custom formatting functions we do not need to
                // alter the remote JSON data, except to indicate that infinite
                // scrolling can be used
                params.page = params.page || 1;

                var itemList = [];
                for (var i = 0; i < data.datas.length; i++) {
                    itemList.push({
                            id: data.datas[i].EVENTID,
                            text: data.datas[i].EVENTNAME,
                            data: data.datas[i]
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.totalpage
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        }, // let our custom formatter work
        minimumInputLength: 1,
        allowClear: true,//允许删除
        placeholder: "请选择",
        language: "zh-CN",
        templateResult: formatEventRepo, // omitted for brevity, see the source of this page
        templateSelection: formatEventSelection // omitted for brevity, see the source of this page
    });
}


/**
 * 格式化查询结果
 * @param repo
 */
function formatRepo(repo) {
    console.log(repo);
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

/**
 * 格式化查询结果
 * @param repo
 */
function formatEventRepo(repo) {
    console.log(repo);
    if (repo.loading) return repo.text;

    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>" +
        "事故类型:" + repo.data.EVENTTYPENAME + "\n" +
        "事故地点:" + repo.data.ADDRESS;

    return markup;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatEventSelection(repo) {
    console.log(repo);
    $("#eventid").val(repo.id);
    return repo.text;
}

/**
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatEntSelection(repo) {
    console.log(repo);
    if(repo.longitude){
        $("#longitude").val(repo.longitude);
        $("#latitude").val(repo.latitude);
    }
    $("#businessinfoid").val(repo.id);
    return repo.text;
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