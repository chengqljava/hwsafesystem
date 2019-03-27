/**
 * 新增和修改培训记录信息
 */
$(function () {
	$('.areaKind').on('click','span',function(){
        var kind = $(this).data('kind');
        $('.areaKind span').removeClass('active');
        $(this).addClass('active');
        $('#pxjy').hide();
        $('#pxqdb').hide();
        if(kind == 'pxjy'){
            $('#pxjy').show();
        } else if(kind == 'pxqdb'){
            $('#pxqdb').show();
        }
        tableScrollResize();
    })
    
    
    var recordid = GetQueryString("recordid");
    $("#trnRecordForm").validate({
        rules: {
            traniname: {
                required: true
            },
            teacher: {
                required: true
            },
            period: {
                required: true,
                isInteger: true
            },
            traintype: {
                required: true
            },
            trainsite: {
                required: true
            },
            traintime: {
                required: true
            },
            traincontent: {
                required: true,
                maxlength: 120
            },
            note: {
                maxlength: 100
            }
        },
        messages: {
            traniname: {
                required: "培训名称不能为空"
            },
            teacher: {
                required: "培训老师不能为空"
            },
            period: {
                required: "培训时长不能为空",
                isInteger:"只能输入整数"
            },
            traintype: {
                required: "培训方式不能为空"
            },
            trainsite: {
                required: "培训地点不能为空"
            },
            traintime: {
                required: "培训时间不能为空"
            },
            traincontent: {
                required: "培训介绍不能为空",
                maxlength: "最多输入120个字"
            },
            note: {
                maxlength: "最多输入100个字"
            }

        },
        submitHandler: function (form) {
        	parent.confirm("请确认'培训签到表'是否填写完整，已完整点击'确认'，未完整点击'取消'再次填写。", function () {
        		save();
            });
        }
    });


    $.ajax({
        type: "post",
        url: BASE_URL + "train/etstrnrecord/load",
        dataType: "json",
        data: {
            recordid: recordid
        },
        success: function (data) {
            if (data) {
                var trnRecordTpt = _.template($("#trnRecordTpt").html());
                $("#trnRecordForm").html(trnRecordTpt(data));
                var etsAttachPics = data.etsAttachPics;//图片附件
                var etsAttachVideos = data.etsAttachVideos;//视频附件
                var etsAttachFiles = data.etsAttachFiles;//资料附件
                var downloadurl = BASE_URL + 'train/etsattach/download/';
                showMultipleInputFile("picDiv", "trainpic", "image", etsAttachPics, downloadurl, true);
                showMultipleInputFile("videoDiv", "trainvideo", "file", etsAttachVideos, downloadurl, true);
                showMultipleInputFile("fileDiv", "trainfile", "file", etsAttachFiles, downloadurl, true);
                if (data.traintime == "" ||  data.traintime == null) {
                	$("#traintime").val(getNowFormatDate());
				}
                SelectOption.loadTrainTypeResult('traintype');
                if (GetQueryString("privcode") != "PXJL_S_GOV") {
                	SelectOption.loadTranClass('tranclass');
				}
                flag = data.planid;
                SelectTwo.initSelect2($('#planid'), BASE_URL + "train/etstrnplan/simplePlan", '请选择培训计划', formatRepo, formatRepoSelection);
                var etsTrnUsers = data.etsTrnUsers;
                initUserTable('usertable', etsTrnUsers);
                
                $("#planid").bind('change',function(){
                	$("#usertable").html("");
                	$("#usersnum").val(0);
                	loadUserList();
                });
            }
            autoHeight();
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });
    

});

function loadUserList(){
	$.ajax({
        type: "post",
        url: BASE_URL + "train/etstrnplan/loadPlanUsers",
        dataType: "json",
        data: {
            planid: $("#planid").val()
        },
        success: function (data) {
            if (data) {
                initUserTable('usertable', data.userlist);
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
 * @param etsTrnUsers
 */
function initUserTable(code, etsTrnUsers) {
    if (etsTrnUsers.length == 0) {
        $('#' + code).append(' <tr id="user0">' +
            '<td align="center"  style="width:20%;">' +
            '<input type="text" class="form-control" placeholder="请输入姓名" id="username0" name="username"/>' +
            '</td>' +
            '<td align="center"  style="width:25%;">' +
            '<input type="tel" class="form-control" id="telnumber0" placeholder="请输入手机号" name="telnumber"/>' +
            '</td>' +
            '<td align="center"  style="width:25%;">' +
            '<input type="text" class="form-control" id="deptname0" placeholder="请输入部门" name="deptname"/>' +
            '</td>' +
            '<td align="center" style="width:15%;">' +
            '<input id="notbepresent0" name="bepresent0" type="radio" onclick="ischecked(\'notbepresent0\',\'isbepresent0\')" value="0" />否' +
            '<input id="isbepresent0" name="bepresent0" type="radio" checked="true"  onclick="ischecked(\'isbepresent0\',\'notbepresent0\')" value="1" />是'+
            '</td>' +
            '<td align="center" style="width:15%;">' +
            '<a class="btn btn-danger" href="javascript:void(0);" onclick="delUserRow(\'user0\')">删除</a>' +
            '</td>' +
            '</tr>'
        );
        $("#username0").rules("add", {
        	required: true,
            messages: {
            	required: "请输入员工姓名"
            }
        });
        //TODO 对手机号进行验证
        $("#telnumber0").rules("add", {
        	required: true,
            isMobile: true,
            messages: {
            	required:"请输入手机号",
                isMobile: "请输入正确格式"
            }
        });
        $("#deptname0").rules("add", {
        	required: true,
            messages: {
            	required: "请输入员工部门"
            }
        });
    } else {
        $.each(etsTrnUsers, function (i, etsTrnUser) {
            $('#' + code).append(' <tr id="user' + i + '">' +
                '<td align="center"  style="width:20%;">' +
                '<input type="text" class="form-control" id="username' + i + '" placeholder="请输入姓名" name="username" readonly value="' + (etsTrnUser.planusername || etsTrnUser.username) + '"/>' +
                '</td>' +
                '<td align="center"  style="width:25%;">' +
                '<input type="tel" class="form-control" id="telnumber' + i + '" name="telnumber" placeholder="请输入手机号" readonly value="' + etsTrnUser.telnumber + '"/>' +
                '</td>' +
                '<td align="center"  style="width:25%;">' +
                '<input type="text" class="form-control" id="deptname' + i + '" name="deptname" placeholder="请输入部门" readonly value="' + etsTrnUser.deptname + '"/>' +
                '</td>' +
                '<td align="center" style="width:15%;">' +
                '<input id="notbepresent'+i+'" name="bepresent'+i+'" type="radio"  onclick="ischecked(\'notbepresent' + i + '\',\'isbepresent'+ i +'\')" value="0" />否' +
                '<input id="isbepresent'+i+'" name="bepresent'+i+'" type="radio" onclick="ischecked(\'isbepresent' + i + '\',\'notbepresent'+ i +'\')" value="1"  />是'+
                '</td>' +
                '<td align="center" style="width:15%;">' +
                '<a class="btn btn-danger" id="delBtn'+i+'" href="javascript:void(0);" onclick="delUserRow(\'user' + i + '\')">删除</a>' +
                '</td>' +
                '</tr>'
            );
            $("#delBtn"+i).removeClass("btn btn-danger").addClass("btn btn-default disabled");
    		$("#delBtn"+i).prop('disabled', true);
    		
    		if (etsTrnUser.bepresent == '0') {
    			$("#notbepresent"+i).attr("checked",true);
			}else{
				$("#isbepresent"+i).attr("checked",true);
			}
        });
    }
    $('#tableContent').niceScroll({
        cursorborder: "#4d86d6",
        cursorcolor: "#4d86d6",
        background: false,
        horizrailenabled: false,
        autohidemode: false
    }).show().resize();
}
//添加一行培训人员
function addUserRow() {
    //获取tr的个数
    var total = $('#usertable').children('tr:last-child').attr("id");
    var num;
    if (total) {
        num = parseInt(total.substr(4, 4)) + 1;
    } else {
        num = 0;
    }
    $('#usertable').append(' <tr id="user' + num + '">' +
        '<td align="center"  style="width:20%;">' +
        '<input type="text" class="form-control" placeholder="请输入姓名" id="username' + num + '" name="username" />' +
        '</td>' +
        '<td align="center"  style="width:25%;">' +
        '<input type="tel" class="form-control" id="telnumber' + num + '" placeholder="请输入手机号" name="telnumber" />' +
        '</td>' +
        '<td align="center"  style="width:25%;">' +
        '<input type="text" class="form-control" id="deptname' + num + '" placeholder="请输入部门" name="deptname" />' +
        '</td>' +
        '<td align="center" style="width:15%;">' +
        '<input id="notbepresent'+num+'" name="bepresent'+num+'" type="radio" onclick="ischecked(\'notbepresent' + num + '\',\'isbepresent'+ num +'\')" value="0" />否' +
        '<input id="isbepresent'+num+'" name="bepresent'+num+'" type="radio"  checked="true"  onclick="ischecked(\'isbepresent' + num + '\',\'notbepresent'+ num +'\')" value="1"  />是'+
        '</td>' +
        '<td align="center" style="width:15%;">' +
        '<a class="btn btn-danger" href="javascript:void(0);" onclick="delUserRow(\'user' + num + '\')">删除</a>' +
        '</td>' +
        '</tr>'
    );

    $("#username" + num).rules("add", {
    	required: true,
        messages: {
        	required: "请输入员工姓名"
        }
    });
    
    $("#telnumber" + num).rules("add", {
        isMobile: true,
        messages: {
            isMobile: "请输入正确格式"
        }
    });
    $("#deptname" + num).rules("add", {
    	required: true,
        messages: {
        	required: "请输入员工部门"
        }
    });
    tableScrollResize();
}

function delUserRow(code) {
    $('#usertable').children('#' + code).remove();
    tableScrollResize();
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


/**
 * @param 改变选中状态
 */
function ischecked(code,ucode){
	$("#"+code).attr("checked",true);
	$("#"+ucode).attr("checked",false);
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
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
    $('#usertable').children().each(function (i) {
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
            } else if($(this).attr('name') == 'deptname'){
                user.deptname = $(this).val() || "";
            }else if($(this).attr('name') == 'bepresent'+i ){
            	if ($(this).val() == "") {
            		parent.toast("请勾选员工是否到场!");
            		return;
            	}
            	if ($(this).attr('checked')) {
            		user.bepresent = $(this).val();
				}
            	
            }
        });
        if (isCanAdd) {
            users.push(user);
        } else {
            return;
        }
        isCanAdd = false;
    });

    var formData = $("#trnRecordForm").serializeArray();
    var userFormData = {name: 'users', value: JSON.stringify(users).replace(/\"/g, "'")};//替换双引号为单引号
    formData.push(userFormData);
    $.ajaxFileUpload({
        type: "post",
        secureuri: false,
        url: BASE_URL + "train/etstrnrecord/save",
        files: arrId,
        data: formData,
        dataType: "json",
        global: false,
        cache: false,
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

function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }
    var markup = "<div class='select2-result-repository clearfix'>" + repo.text + "</div>";

    return markup;
}

function formatRepoSelection(repo) {
    $("#planid").val(repo.id);
    return repo.text;
}

function deleteFile(div, fileid) {
    $('#' + div).hide();
    $('#etsAttachPics').append("<input class=\"form-control\" type='hidden' name='delids' value='" + fileid + "'/>");
}
