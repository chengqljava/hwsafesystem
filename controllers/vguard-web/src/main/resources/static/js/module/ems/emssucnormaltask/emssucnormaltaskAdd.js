/*新增或编辑课程管理*/
$(function () {
    var normaltaskid = getQueryString("normaltaskid");
    $("#sucnormaltaskForm").validate({
        rules: {
            normaltasktitle: {
                required: true
            },
            normaltaskcontent: {
                required: true
            },
            receiver: {
                required: true
            }
        },
        messages: {
            normaltasktitle: {
                required: "任务标题不能为空"
            },
            normaltaskcontent: {
                required: "任务内容不能为空"
            },
            receiver: {
                required: "接收人不能为空"
            }
        },
        submitHandler: function (form) {
            save();
        }
    });
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucnormaltask/load",
        dataType: "json",
        data: {
            normaltaskid: normaltaskid
        },
        success: function (data) {
            if (data) {
                var sucnormaltaskTpt = _.template($("#sucnormaltaskTpt").html());
                $("#sucnormaltaskForm").html(sucnormaltaskTpt(data));
                selUser($("#receivername"), BASE_URL + "system/govuser/list");

                //绑定删除按钮操作
                $("#relEmsAlarmTb").delegate(".delEmsAlarm", "click",function(){
                	$(this).parent().parent().remove();
                	return false;
                });

                $("#chosnEmsAlarm").off("click").on("click", function() {
                	window.top.GEventObject.dispatchEvent("LOAD_EMSALARM_EVENT");
                	window.top.GEventObject.die("LOAD_EMSALARM_EVENT");
                    window.top.GEventObject.on("LOAD_EMSALARM_EVENT", function(param) {
//                    	console.log("返回警情列表");
//                    	console.log(param);

                    	$(".emsDutyAlarmTr").remove();
                    	var emsDutyAlarmTrDom = "";
                    	_.map(JSON.parse(param.emsAlarmData), function(tmpEmsAlarm, index){
                    		emsDutyAlarmTrDom += "<tr class='emsDutyAlarmTr' data-alarmId='" + tmpEmsAlarm.WARNALARMID + "'>" +
										"<td style='width: 20%;'>" + tmpEmsAlarm.WARNALARMTITLE + "</td>" +
										"<td style='width: 20%;' >" + tmpEmsAlarm.POLICEOFFICERSEAT + "</td>" +
										"<td style='width: 20%;'>" + tmpEmsAlarm.ALARMTIME + "</td>" +
										"<td style='width: 20%;'>" + tmpEmsAlarm.ALARMPHONE + "</td>" +
										"<td style='width: 10%;'>" + tmpEmsAlarm.ALARMPERSON + "</td>" +
										"<td style='width: 10%;'><button class='delEmsAlarm btn btn-danger'>删除</button></td>" +
										"</tr>";
                    	});
                    	$("#relEmsAlarmTb").append(emsDutyAlarmTrDom);
                    });
                	parent.openWin(BASE_URL + "views/module/ems/emssucnormaltask/emsDutyalarmChosen.html",
            	            '选择警情', '70%', '55%');
                	return false;
                });
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败");
        }
    });
});

/*保存(新增或编辑)*/
function save() {
	var paraArr = $("#sucnormaltaskForm").serializeArray(),
	    $emsDutyAlarmTr = $(".emsDutyAlarmTr"),
	    alarmIdArr = [];
	if ($emsDutyAlarmTr && 0 < $emsDutyAlarmTr.length) {
		$emsDutyAlarmTr.each(function(){
			alarmIdArr.push($(this).attr("data-alarmId"));
		});
	}
	paraArr.push({"name": "emsAlarmIds", "value": alarmIdArr.join(",")});
//	console.log("参数");
//	console.log(paraArr);

    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emssucnormaltask/save",
        data: paraArr,
        success: function (data) {
            if (data.success == true) {
                parent.toast(data.msg);//弹出提示信息
                parent.loadRemindCount();
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
 * 查询政府用户
 * @param $ajax
 * @param url
 */
function selUser($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    username: "", // search term
                    nickname: params.term, // search term
                    orgid: "",
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
                            id: data.datas[i].USERID,
                            text: data.datas[i].NICKNAME,
                            orgname: data.datas[i].ORGNAME
                        }
                    )
                }

                return {
                    results: itemList,
                    pagination: {
                        more: params.page < data.total
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
        templateSelection: formatUserSelection // omitted for brevity, see the source of this page
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
 * 格式化选择结果
 * @param repo
 * @returns {*}
 */
function formatUserSelection(repo) {
    console.log(repo);
    $("#receiver").val(repo.id);

    if (repo.orgname) {
        $("#receiverorgname").val(repo.orgname);
    }
    return repo.text;
}