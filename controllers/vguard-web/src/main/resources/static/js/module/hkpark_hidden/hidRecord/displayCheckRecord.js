/**
 * 隐患记录详情信息
 */
$(function () {
    var checkrecordid = GetQueryString("checkrecordid");

    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckrecord/load",
        dataType: "json",
        data: {
        	checkrecordid: checkrecordid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var checkRecordTpt = _.template($("#checkRecordTpt").html());
                $("#checkRecordForm").html(checkRecordTpt(data));

                $('#becomeBig').viewer({
                    'toolbar': false,
                    'title': false
                });
            }
            autoHeight();
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});
/**
 * 初始化排查项清单列表
 * @param code
 * @param etsTrnUsers
 */
function initUserTable(code, hidCheckItemes) {
    if (hidCheckItemes.length != 0) {
        $.each(hidCheckItemes, function (i, hidCheckIteme) {
            var checkitem = hidCheckIteme.checkitem || '';
            var checkcontent = hidCheckIteme.checkcontent || '';
            var checkrequire = hidCheckIteme.checkrequire || '';
            var fromway = hidCheckIteme.fromway || '';
            var dangerlevel = hidCheckIteme.dangerlevel || '';
            if(dangerlevel != '' && dangerlevel == '0'){
            	var level = "无隐患";
            } else if(dangerlevel != '' && dangerlevel == '1'){
            	var level = "一般隐患";
            } else if(dangerlevel != '' && dangerlevel == '2'){
            	var level = "重大隐患";
            }
            $('#' + code).append(' <tr id="item' + i + '">' +
                '<td>' +
                '<input type="text" class="form-control" id="checkitem' + i + '" name="checkitem" readonly value="' + checkitem + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="checkcontent' + i + '" name="checkcontent" readonly value="' + checkcontent + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="checkrequire' + i + '" name="checkrequire" readonly value="' + checkrequire + '"/>' +
                '</td>' +
                '</tr>' +
                '<input type="text" class="form-control" id="fromway' + i + '" name="fromway" readonly value="' + fromway + '"/>' +
                '</td>' +
                '<td>' +
                '<input type="text" class="form-control" id="level' + i + '" name="level" readonly value="' + level + '"/>' +
                '</td>' +
                '</tr>' 
            );
        });
    }
}

/**
 * 查看信息
 */
function displayHid(hiddendangerid,dangerlevel) {
	if(dangerlevel != null){		
		if(dangerlevel == 0){
			parent.toast("该排查项无隐患");
			return;
		} else {
			if(hiddendangerid != '' & hiddendangerid != null & hiddendangerid != 'null'){				
				parent.openWin(BASE_URL + "views/module/hkpark_hidden/hiddenManager/hiddendangerDisplay.html?hiddendangerid="+hiddendangerid,
			             "隐患信息详情", "70%", "75%");
			}
		}
	}
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
