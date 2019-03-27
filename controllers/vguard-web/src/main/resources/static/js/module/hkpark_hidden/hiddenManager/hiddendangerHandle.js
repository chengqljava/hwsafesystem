/**
 * 详细信息
 */
var hiddendangerid = GetQueryString("hiddendangerid");
var hiddendangerstate = GetQueryString("hiddendangerstate");
var isFormGis = GetQueryString("isFormGis");
var isRemind = GetQueryString("isRemind");

var entid = GetQueryString("entid")
$(function () {
    reloadHid(hiddendangerid);

});

//隐患整改
function reformHid(hiddendangerid){
	parent.openWin(BASE_URL
			+ "views/module/hkpark_hidden/hiddenManager/hiddendangerreformAdd.html?hiddendangerid="+hiddendangerid,
			'隐患整改', '55%', '55%');
};

//隐患复查
function recheckHid(hiddendangerid){
	parent.openWin(BASE_URL
			+ "views/module/hkpark_hidden/hiddenManager/hiddendangerrecheckAdd.html?hiddendangerid="+hiddendangerid +"&isFormGis=true&entid="+entid+"&isRemind="+isRemind,
			'隐患复查', '55%', '55%');
};

/**
 * 详细查看整改信息
 */
function displayReform(hiddendangerreformid) {
	//返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/hiddendangerreformDisplay.html?hiddendangerreformid="+hiddendangerreformid,
			"整改信息详情", "55%", "45%");
}

/**
 * 详细查看复查信息
 */
function displayRecheck(hiddendangerrecheckid) {
	 //返回当前grid中复选框所选择的数据的id
	parent.openWin(BASE_URL + "views/module/hkpark_hidden/displayPage/hiddendangerrecheckDisplay.html?hiddendangerrecheckid="+hiddendangerrecheckid,
             "复查信息详情", "55%", "45%");
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
/**
 * 刷新时加载查询条件
 */
function reloadHid(hiddendangerid) {
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidhiddendanger/loadbyid",
        dataType: "json",
        data: {
        	id: hiddendangerid
        },
        success: function (data) {
            if (data) {
                data.BASE_URL = BASE_URL;
                var hiddendangerTpt = _.template($("#hiddendangerTpt").html());
                $("#hiddendangerForm").html(hiddendangerTpt(data));
                if(hiddendangerstate == "3"){
            		$("#reformHid").attr("style","display:block");           		
            		if(data.reformList.length==0){
            			$("#rechecklist").hide();
            		}
            	} else if(hiddendangerstate == "4"){
            		$("#recheckHid").attr("style","display:block");
            	} else if(hiddendangerstate == "5"){
            		$("#closewin").hide();
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
}