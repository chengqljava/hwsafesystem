/**
 * 详细信息
 */
$(function () {
    var hiddendangerid = GetQueryString("hiddendangerid");

    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/loadbyid",
        dataType: "json",
        data: {
        	id: hiddendangerid
        },
        success: function (data) {
            if (data) {
            	console.log(data);
                data.BASE_URL = BASE_URL;
                var hiddendangerTpt = _.template($("#hiddendangerTpt").html());
                $("#hiddendangerForm").html(hiddendangerTpt(data));
                if(data.recheckList.length==0){
                	$("#rechecklist").hide();//隐藏
                }
                if(data.reformList.length==0){
                	$("#reformlist").hide();
                	$("#recheck").hide();
                }
                if(data.reformtype != "0"){
                	$("#reformtime1").hide();
                	$("#reformtime2").hide();
                }
                if(data.cancelusers == null || data.cancelusers==""){
                	$("#cancel").hide();
                }
                $("#becomeBig").viewer({
                	'toolbar': false,
                	'title': false
                });
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});

/**
 * 详细查看整改信息
 */
function displayReform(hiddendangerreformid) {
	//返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hidden/hiddendangerReform/hiddendangerreformDisplay.html?hiddendangerreformid="+hiddendangerreformid,
			"整改信息详情", "55%", "360px");
}

/**
 * 详细查看复查信息
 */
function displayRecheck(hiddendangerrecheckid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hidden/hiddendangerrecheck/hiddendangerrecheckDisplay.html?hiddendangerrecheckid="+hiddendangerrecheckid,
             "复查信息详情", "55%", "360px");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
