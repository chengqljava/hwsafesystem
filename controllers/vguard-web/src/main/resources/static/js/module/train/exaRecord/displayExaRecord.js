/**
 * 新增和修改培训记录信息
 */
$(function () {
    var recordid = GetQueryString("recordid");


    $.ajax({
        type: "post",
        url: BASE_URL + "train/etsexarecord/load",
        dataType: "json",
        data: {
            recordid: recordid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var exaRecordTpt = _.template($("#exaRecordTpt").html());
                $("#exaRecordForm").html(exaRecordTpt(data));
                var etsAttachFiles = data.etsAttachFiles;//资料附件
                showChooseFiles('exaFile', etsAttachFiles, BASE_URL + 'train/etsattach/download/', false);
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
function initUserTable(code, etsExaScores) {
    if (etsExaScores.length != 0) {
        $.each(etsExaScores, function (i, etsExaScore) {
            var socre = etsExaScore.socre || '';
            var examtime = etsExaScore.examtime || '';
            $('#' + code).append(' <tr id="user' + i + '">' +
                '<td>' +
                '<input type="text" class="form-control" id="username' + i + '" name="username" readonly value="' + etsExaScore.username + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="socre' + i + '" name="socre" readonly value="' + socre + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="examtime' + i + '" name="examtime"  disabled value="' + getFormatDateByLong(examtime, 'yyyy-MM-dd hh:mm') + '"/>' +
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
