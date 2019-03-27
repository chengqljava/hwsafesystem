/*新增或编辑课程管理*/
$(function () {

    var simulationid = getQueryString("simulationid");
    $("#eventsimulationForm").validate({
        rules: {
        	drillname:{
        		required: true
        	},
        	planname: {
                required: true
            },
            simulationaddress: {
                required: true
            }
            ,
            orgdepnames: {
                required: true
            }
            ,
            headquarter: {
                required: true
            }
            ,
            simulationtime: {
                required: true
            }
//            ,
//            joinorgnames: {
//                required: true
//            }
//            ,
//            simulationcontent: {
//                required: true
//            }
//            ,
//            preparesituation: {
//                required: true
//            }
//            ,
//            simulationdesc: {
//                required: true
//            }
//            ,
//            suitability: {
//                required: true
//            }
//            ,
//            adequacy: {
//                required: true
//            },
//            personsituation: {
//                required: true
//            },
//            dutysituation: {
//                required: true
//            },
//            metasituation: {
//                required: true
//            },
//            protectsituation: {
//                required: true
//            },
//            allcoordinatesituation: {
//                required: true
//            },
//            rescuesituation: {
//                required: true
//            }
//            ,
//            evaluation: {
//                required: true
//            }
//            ,
//            reptosup: {
//                required: true
//            }
//            ,
//            fireorg: {
//                required: true
//            },
//            resuceorg: {
//                required: true
//            }
//            ,
//            evacoordination: {
//                required: true
//            }
//            ,
//            problems: {
//                required: true
//            }
//            ,
//            impmeasures: {
//                required: true
//            }
//            ,
//            editplancontent: {
//                required: true
//            }
        },
        messages: {
        	drillname:{
        		required: "请选择演练计划"
        	},
        	planname: {
                required: "预案名称不能为空"
            },
            simulationaddress: {
                required: "请填写演练地址"
            }
            ,
            orgdepnames: {
                required: "请填写组织部门"
            }
            ,
            headquarter: {
                required: "请填写总指挥"
            }
            ,
            simulationtime: {
                required: "请填写演练时间"
            }
//            ,
//            joinorgnames: {
//                required: "请填写参与部门和单位"
//            }
//            ,
//            simulationcontent: {
//                required: "请填写实际演练部分"
//            }
//            ,
//            preparesituation: {
//                required: "请填写物资准备和人员培训情况"
//            }
//            ,
//            simulationdesc: {
//                required: "请填写演练过程描述"
//            }
//            ,
//            suitability: {
//                required: "请选择预案适宜性评审"
//            }
//            ,
//            adequacy: {
//                required: "请选择预案充分性评审"
//            },
//            personsituation: {
//                required: "请选择人员到位情况"
//            },
//            dutysituation: {
//                required: "请选择职责与操作情况"
//            },
//            metasituation: {
//                required: "请选择现场物资到位情况"
//            },
//            protectsituation: {
//                required: "请选择个人防护情况"
//            },
//            allcoordinatesituation: {
//                required: "请选择整体组织协调情况"
//            },
//            rescuesituation: {
//                required: "请选择抢险组组织协调情况"
//            }
//            ,
//            evaluation: {
//                required: "请选择实战效果评价"
//            }
//            ,
//            reptosup: {
//                required: "请选择报告上级"
//            }
//            ,
//            fireorg: {
//                required: "请选择消防部门执行情况"
//            },
//            resuceorg: {
//                required: "请选择医疗救援部门执行情况"
//            }
//            ,
//            evacoordination: {
//                required: "请选择周边政府撤离配合情况"
//            }
//            ,
//            problems: {
//                required: "请填写存在的问题"
//            }
//            ,
//            impmeasures: {
//                required: "请填写改进措施"
//            }
//            ,
//            editplancontent: {
//                required: "请填写应急预案修改内容"
//            }
        },
        submitHandler: function (form) {
            save();
        }
    });
    //查询
    $.ajax({
        type: "post",
        url: BASE_URL + "ems/emseventsimulation/load",
        dataType: "json",
        data: {
            simulationid: simulationid
        },
        success: function (data) {
            if (data) {
            	console.log(data);
                var eventsimulationTpt = _.template($("#eventsimulationTpt").html());
                $("#eventsimulationForm").html(eventsimulationTpt(data));
//                selPlan($("#planname"), BASE_URL + "ems/emsplaplaninfo/list");
//                var downloadurl = BASE_URL + 'ems/emssimulationattachment/download/';
//                showMultipleInputFile("fileDiv", "simulationFile", "file", data.attachs, downloadurl, true);

				var attachPics = data.attachPics;//图片附件
                var attachVideos = data.attachVideos;//视频附件
                var attachFiles = data.attachFiles;//资料附件
                var downloadurl = BASE_URL + 'ems/emssimulationattachment/download/';
                showMultipleInputFile("picDiv", "attachpic", "image", attachPics, downloadurl, true);
                showMultipleInputFile("videoDiv", "attachvideo", "file", attachVideos, downloadurl, true);
                showMultipleInputFile("fileDiv", "attachfile", "file", attachFiles, downloadurl, true);
                //适宜性
                SelectOption.loadSuitability("suitability");
                //充分性
                SelectOption.loadAdequacy("adequacy");
                //人员到位情况
                SelectOption.loadPersonsituation("personsituation");
                SelectOption.loadDutysituation("dutysituation");
                SelectOption.loadMetasituation("metasituation");
                SelectOption.loadProtectsituation("protectsituation");
                SelectOption.loadAllcoordinatesituation("allcoordinatesituation");
                SelectOption.loadRescuesituation("rescuesituation");
                SelectOption.loadEvaluation("evaluation");
                SelectOption.loadReptosup("reptosup");
                SelectOption.loadFireorg("fireorg");
                SelectOption.loadFireorg("resuceorg");
                SelectOption.loadEvacoordination("evacoordination");


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
        url: BASE_URL + "ems/emseventsimulation/save",
        data: $("#eventsimulationForm").serializeArray(),
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
 * 查询企业
 * @param $ajax
 * @param url
 */
function selPlan($ajax, url) {
    $ajax.select2({
        ajax: {
            type: "post",
            url: url,
            dataType: 'json',
            delay: 250,
            data: function (params) {

                return {
                    planname: params.term, // search term
                    plantype: "",
                    planstate: "",
                    districtid: "",
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
                            id: data.datas[i].PLANID,
                            text: data.datas[i].PLANNAME
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
        templateSelection: formatPlanSelection // omitted for brevity, see the source of this page
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
function formatPlanSelection(repo) {
    console.log(repo);

    $("#planid").val(repo.id);
    return repo.text;
}


function loadEmsDrillPlan(){
	/**
	 * 加载演练计划
	 */
	window.top.GEventObject.die('LOAD_EMS_DRILL_PLAN_ENENT');
	window.top.GEventObject.on('LOAD_EMS_DRILL_PLAN_ENENT', function(rowdata) {
		console.log(rowdata);
		$('#pid').val(rowdata.pid);
		$('#drillname').val(rowdata.drillname);
		$('#planid').val(rowdata.planid);
		$('#planname').val(rowdata.planname);
	});
	window.top.openWin(BASE_URL+"/views/module/ems/emseventsimulation/emsdrillplanList.html","演练计划",'55%','63%');
}


/**
 * 定位
 */
function position() {
    var longitude = encodeURIComponent($('#longitude').val());
    var latitude = encodeURIComponent($('#latitude').val());
    var areaName = encodeURIComponent($('#area').val());
    var isDisplay = $("#isDisplay").val();

    //当编辑地图点位时
    if ("0" == isDisplay) {
        window.top.GEventObject.die("LOAD_BDMAPPT_EVENT");
        window.top.GEventObject.on("LOAD_BDMAPPT_EVENT", function (param) {
            $('#longitude').val(param.lng);
            $('#latitude').val(param.lat);
        });
    }
    parent.parent.openWin(BASE_URL + "/views/module/ems/common/emsMapLoc.html?lng=" + longitude + "&lat=" + latitude + "&isDisplay=" + isDisplay, "地理定位", "50%", "50%", false);
}