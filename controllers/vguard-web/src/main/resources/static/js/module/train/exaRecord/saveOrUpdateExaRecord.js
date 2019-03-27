/**
 * 新增和修改考试记录信息
 */
var trnrecordFlag = false;
$(function () {
    // 分布区域的点击事件
    $('.areaKind').on('click','span',function(){
        var kind = $(this).data('kind');
        if($("#usersnum").val() == 0 ){
    		parent.toast("请先选择培训记录!");
    		return;
    	} 
        $('.areaKind span').removeClass('active');
        $(this).addClass('active');
        $('#ksjy').hide();
        $('#ksry').hide();
        if(kind == 'ksjy'){
            $('#ksjy').show();
        } else if(kind == 'ksry'){
    		$('#ksry').show();
        }
        tableScrollResize();
    })
	
    var recordid = GetQueryString("recordid");
    $("#exaRecordForm").validate({
        rules: {
        	etstrnrecordid: {
                required: true
            },
            examname: {
                required: true
            },
            teacher: {
                required: true
            },
            period: {
                required: true,
                isInteger: true
            },
            examsite: {
                required: true
            },
            examtime: {
                required: true
            },
            examcontent: {
                required: true,
                maxlength: 120
            },
            score: {
                required: true,
                isInteger: true
            },
            passmark: {
            	required: true,
                isInteger: true
            },
            examtype: {
            	required: true
            },
            note: {
                maxlength: 120
            }
        },
        messages: {
        	etstrnrecordid: {
                required: "培训名称不能为空"
            },
            examname: {
                required: "考试名称不能为空"
            },
            teacher: {
                required: "监考老师不能为空"
            },
            period: {
                required: "考试学时不能为空",
                isInteger:"只能输入整数"
            },
            examsite: {
                required: "考试地点不能为空"
            },
            examtime: {
                required: "考试时间不能为空"
            },
            examcontent: {
                required: "考试内容不能为空",
                maxlength: "最多输入120个字"
            },
            score: {
                required: "试卷总分不能为空",
                isInteger: "请输入整数"
            },
            passmark: {
            	required: "及格分数线不能为空",
                isInteger: "请输入整数"
            },
            examtype: {
            	required: "考试方式不能为空"
            },
            note: {
                maxlength: "最多输入120个字"
            }

        },
        submitHandler: function (form) {
        	if (trnrecordFlag) {
        		parent.toast("请选择未考试过的培训记录!");
        		return;
			}
        	parent.confirm("请确认'考试人员'信息填写完整，已完整点击'确认'，未完整点击'取消'再次填写。", function () {
        		save();
        	});
        }
    });

    $.ajax({
        type: "post",
        url: BASE_URL + "train/etsexarecord/load",
        dataType: "json",
        data: {
            recordid: recordid
        },
        success: function (data) {
            if (data) {
                var exaRecordTpt = _.template($("#exaRecordTpt").html());
                $("#exaRecordForm").html(exaRecordTpt(data));
                $("#savebtn").show();
                //培训记录下拉选
//                SelectOption.loadTrnrecord("trnrecordid");
                SelectTwo.initSelect2($('#trnrecordid'), BASE_URL + "train/etstrnrecord/loadtrnrecordselect", '请选择培训记录', formatRepo, formatRepoSelection);
                //考试方式
                SelectOption.loadExamType("examtype");
                //加载附件
                var etsAttachPics = data.etsAttachPics;//图片附件
                var etsAttachFiles = data.etsAttachFiles;//视频附件
                var downloadurl = BASE_URL + 'train/etsattach/download/';
                showMultipleInputFile("picDiv","exampic","image",etsAttachPics, downloadurl, true);
                showMultipleInputFile("fileDiv","examfile","file",etsAttachFiles, downloadurl, true);
                
                var etsExaScores = data.etsExaScores;
                $("#usersnum").val(etsExaScores.length);
                if(etsExaScores.length>0){                	
                	initUserTable('usertable', etsExaScores);
                }
                $("#trnrecordid").bind('change',function(){
                	$("#usertable").html("");
                	$("#usersnum").val(0);
                	initTrnUser(data.trnrecordid);
                })
                autoHeight();
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

    $("#save").on('click',function(){
    	save();
    })
});

function initTrnUser(trnrecordid){
	var recordid = $("#trnrecordid").val();
    $.ajax({
        type: "post",
        url: BASE_URL + "train/etstrnuser/load",
        dataType: "json",
        data: {
            recordid: recordid
        },
        success: function (data) {
            if (data) {
            	if(trnrecordid == recordid ||  data.etsTrnRecord.isornotexam == 0){            		
            		var userList = data.userList;
            		$("#usersnum").val(userList.length);
            		if(userList.length>0){                	
            			initTrnUserTable('usertable', userList);
            		}
            		$("#examtime").val(getFormatDateByLong(data.etsTrnRecord.traintime, 'yyyy-MM-dd'));
            		trnrecordFlag = false;
            	} else {
            		parent.toast("此培训已进行过考试，如效果不达标，请再次培训并考试!");
            		trnrecordFlag = true;
            	}
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
}

/**
 * 初始化人员列表
 * @param code
 * @param etsExaScores
 */
function initTrnUserTable(code, userList) {
    $.each(userList, function (i, etsExaUser) {
    	var username = etsExaUser.username || '';
    	var telnumber = etsExaUser.telnumber || '';
    	var deptname = etsExaUser.deptname || '';
        $('#' + code).append(' <tr id="user' + i + '">' +
            '<td align="center" style="width:15%;">' +
            '<input type="text" class="form-control" id="username' + i + '" name="username" readonly value="' + username + '"/>' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="telnumber' + i + '" name="telnumber" readonly value="' + telnumber + '"/>' +
            '</td>' +
            '<td align="center" style="width:15%;">' +
            '<input type="text" class="form-control" id="deptname' + i + '" name="deptname" readonly value="' + deptname + '"/>' +
            '</td>' +
            '<td style="width:15%;">' +
            '<input type="number" class="form-control" id="socre' + i + '" name="socre" value=""/>' +
            '</td>' +
            '<td style="width:30%;">' +
            '<input type="text" class="form-control" maxlength="100" id="note' + i + '" name="note" value=""/>' +
            '</td>' +
            '</tr>'
        );
        tableScrollResize();
        $("#socre" + i).rules("add", {
            isInteger: true,
            messages: {
                isInteger: "请输入整数"
            }
        });
    });
}

/**
 * 初始化人员列表
 * @param code
 * @param etsExaScores
 */
function initUserTable(code, etsExaScores) {
    $.each(etsExaScores, function (i, etsExaUser) {
    	var username = etsExaUser.username || '';
    	var telnumber = etsExaUser.telnumber || '';
    	var deptname = etsExaUser.deptname || '';
        var socre = etsExaUser.socre || '';
        var note = etsExaUser.note || '';
        $('#' + code).append(' <tr id="user' + i + '">' +
            '<td align="center" style="width:15%;">' +
            '<input type="text" class="form-control" id="username' + i + '" name="username" readonly value="' + username + '"/>' +
            '</td>' +
            '<td align="center" style="width:20%;">' +
            '<input type="text" class="form-control" id="telnumber' + i + '" name="telnumber" readonly value="' + telnumber + '"/>' +
            '</td>' +
            '<td align="center" style="width:15%;">' +
            '<input type="text" class="form-control" id="deptname' + i + '" name="deptname" readonly value="' + deptname + '"/>' +
            '</td>' +
            '<td style="width:15%;">' +
            '<input type="number" class="form-control" id="socre' + i + '" name="socre" placeholder="请输入考试得分" value="' + socre + '"/>' +
            '</td>' +
            '<td style="width:30%;">' +
            '<input type="text" class="form-control" maxlength="100" id="note' + i + '" name="note" value="' + note + '"/>' +
            '</td>' +
            '</tr>'
        );
        $("#socre" + i).rules("add", {
            isInteger: true,
            messages: {
                isInteger: "请输入整数"
            }
        });
    });
    $('#tableContent').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
}

function tableScrollResize(){
	$('#tableContent').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).resize();
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
    $("#trnrecordid").val(repo.id);
    $("#etstrnrecordid").val(repo.id);
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

    var users = [];
    $('#usertable').children().each(function () {
        var user = {};
        var isCanAdd = false;
        $(this).children().children("input").each(function () {
            if ($(this).attr('name') == 'username') {
                if ($(this).val()) {
                    user.username = $(this).val();
                    isCanAdd = true;
                } else {
                    return;
                }

            } else if ($(this).attr('name') == 'telnumber') {
                user.telnumber = $(this).val() || "";
            }  else if ($(this).attr('name') == 'deptname') {
                user.deptname = $(this).val() || "";
            }  else if ($(this).attr('name') == 'socre') {
                user.socre = $(this).val() || "";
            }  else if ($(this).attr('name') == 'note') {
                user.note = $(this).val() || "";
            }

        });
        if (isCanAdd) {
            users.push(user);
        } else {
            return;
        }
        isCanAdd = false;
    });

    var formData = $("#exaRecordForm").serializeArray();
    var userFormData = {name: 'scores', value: JSON.stringify(users).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push({name: 'notes',vlaue: $("#notes").val()});
    formData.push(userFormData);
    $.ajaxFileUpload({
        type: "post",
        url: BASE_URL + "train/etsexarecord/save",
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

