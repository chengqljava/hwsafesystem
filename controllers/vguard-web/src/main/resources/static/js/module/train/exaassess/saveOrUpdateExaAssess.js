/**
 * 新增和修改考试记录信息
 */

var trnrecordFlag = false;
$(function () {

    var assessid = GetQueryString("assessid");
    $("#assessInfoForm").validate({
        rules: {
        	trnRecordid: {
                required: true
            },
            assesstime: {
                required: true
            },
            person: {
                required: true
            },
            teacher: {
                required: true
            },
            examcontent: {
                required: true
            },
            examsite: {
                required: true
            }
        },
        messages: {
        	trnRecordid: {
                required: "培训记录不能为空"
            },
            assesstime: {
                required: "评估时间不能为空"
            },
            person: {
                required: "评估人不能为空"
            },
            teacher: {
                required: "员工学习情况不能为空"
            },
            examcontent: {
                required: "讲师授课情况不能为空"
            },
            examsite: {
                required: "培训整体情况不能为空"
            }
        },
        submitHandler: function (form) {
        	if (trnrecordFlag) {
        		parent.toast("请选择未评估过的培训记录!");
        		return;
			}
        	save();
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "train/etsexaassess/load",
        dataType: "json",
        data: {
        	assessid: assessid
        },
        success: function (data) {
            if (data) {
                var assessInfoTpt = _.template($("#assessInfoTpt").html());
                $("#assessInfoForm").html(assessInfoTpt(data));
                //培训记录下拉选
                SelectTwo.initSelect2($('#recordid'), BASE_URL + "train/etstrnrecord/loadtrnrecordselect", '请选择培训记录', formatRepo, formatRepoSelection);
                //评估等级
                SelectOption.loadAssessLevel("teacher");
                SelectOption.loadAssessLevel("examcontent");
                SelectOption.loadAssessLevel("examsite");
                if(!data.assesstime){
                	$("#assesstime").val(getFormatDateByLong(new Date(), 'yyyy-MM-dd'));
                }
                //加载附件
                var etsAttachFiles = data.etsAttachFiles;//资料附件
                var downloadurl = BASE_URL + 'train/etsattach/download/';
                showMultipleInputFile("fileDiv","examfile","file",etsAttachFiles, downloadurl, true);
                $("#recordid").bind('change',function(){
                	initTrnRecord(data.recordid);
                })
                autoHeight();
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
});

function initTrnRecord(trnrecordid){
	var recordid = $("#recordid").val();
    $.ajax({
        type: "post",
        url: BASE_URL + "train/etsexaassess/loadtrnrecord",
        dataType: "json",
        data: {
            recordid: recordid
        },
        success: function (data) {
            if (data) {
            	$("#trnteacher").text("");
            	$("#traintime").text("");
            	$("#trainsite").text("");
            	$("#tranclass").text("");
            	$("#usersnum").text("");
            	$("#examtype").text("");
            	$("#tranmaincon").text("");
            	if(trnrecordid == recordid || data.etsTrnRecord.isornotassess == 0){            		
            		var etsTrnRecord = data.etsTrnRecord;
            		var etsExaRecord = data.etsExaRecord;
            		$("#trnteacher").text(etsTrnRecord.teacher != null ? etsTrnRecord.teacher:"");
            		$("#traintime").text(getFormatDateByLong(etsTrnRecord.traintime, 'yyyy-MM-dd'));
            		$("#trainsite").text(etsTrnRecord.trainsite != null ? etsTrnRecord.trainsite:"");
            		$("#tranclass").text(etsTrnRecord.tranclass != null ? etsTrnRecord.tranclass:"");
            		$("#usersnum").text(etsTrnRecord.period != null ? etsTrnRecord.period:"");
            		$("#examtype").text(etsExaRecord.examtype != null ? etsExaRecord.examtype:"");
            		$("#tranmaincon").text(etsTrnRecord.tranmaincon != null ? etsTrnRecord.tranmaincon:"");
            		trnrecordFlag = false;
            	} else {
            		parent.toast("此培训已进行过效果评估！");
            		trnrecordFlag = true;
            	}
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#recordid").val(repo.id);
    $("#trnRecordid").val(repo.id);
    return repo.text;
}

/**
 * 保存
 * @returns
 */
function save() {

    var uplist = $("input[name^=file]");
    var arrId = [];
    for (var i = 0; i < uplist.length; i++) {
        if (uplist[i].value) {
            arrId[i] = uplist[i].id;
        }
    }

    var formData = $("#assessInfoForm").serializeArray();
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "train/etsexaassess/save",
        files: arrId,
        data: formData,
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
            parent.toast("提交失败");
        }
    });

}

