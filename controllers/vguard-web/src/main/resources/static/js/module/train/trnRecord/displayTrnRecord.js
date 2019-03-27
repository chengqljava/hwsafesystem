/**
 * 新增和修改培训记录信息
 */
$(function () {
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
                required: true
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
                required: true
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
                required: "培训学时不能为空"
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
                required: "培训内容不能为空"
            }

        },
        submitHandler: function (form) {
            save();
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
                data.BASE_URL = BASE_URL;
                var trnRecordTpt = _.template($("#trnRecordTpt").html());
                $("#trnRecordForm").html(trnRecordTpt(data));

                $('#trainpic').empty();
                $('#trainpic').hide();
                $('#picWarning').hide();
                $('#trainvideo').empty();
                $('#trainvideo').hide();
                $('#trainfile').empty();
                $('#trainfile').hide();

                var etsAttachPics = data.etsAttachPics;//图片附件
                var etsAttachVideos = data.etsAttachVideos;//视频附件
                var etsAttachFiles = data.etsAttachFiles;//资料附件

                showChooseFiles('trainfile', etsAttachFiles, BASE_URL + 'train/etsattach/download/', false);

                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
                
                autoHeight();
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});
/**
 * 初始化人员列表
 * @param code
 * @param etsTrnUsers
 */
function initUserTable(code, etsTrnUsers) {
    if (etsTrnUsers.length != 0) {
        $.each(etsTrnUsers, function (i, etsTrnUser) {
            var telnumber = etsTrnUser.telnumber || '';
            var deptname = etsTrnUser.deptname || '';
            $('#' + code).append(' <tr id="user' + i + '">' +
                '<td>' +
                '<input type="text" class="form-control" id="username' + i + '" name="username" readonly value="' + etsTrnUser.username + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="telnumber' + i + '" name="telnumber" readonly value="' + telnumber + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="deptname' + i + '" name="deptname" readonly value="' + deptname + '"/>' +
                '</td>' +
                '</tr>'
            );
        });
    }
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
