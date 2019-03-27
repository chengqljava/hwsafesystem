/**
 * 详细信息
 */
$(function () {
    var checkplanid = GetQueryString("checkplanid");

    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcheckplan/load",
        dataType: "json",
        data: {
        	checkplanid: checkplanid
        },
        success: function (data) {
            if (data) {
            	var daycount;
            	if (data.daycount != 'null' && data.daycount == 1) {
            		daycount = '';
				}else {
					daycount = data.daycount;
				}
            	if(data.frequency == '0'){
            		//按天执行
            		data.plandate = "计划于每" + daycount +"天重复执行一次";
            	}else if(data.frequency == '1'){
            		data.plandate = "计划于每" + daycount +"周星期"+getWeek(data.week)+"重复执行一次";
            	}else if(data.frequency == '2'){
            		data.plandate = "计划于每" + daycount +"个月 "+data.dayly+"号重复执行一次";
            	}else if(data.frequency == '3'){
            		data.plandate = "计划于每年" + data.monthly +"月 "+data.dayly+"号重复执行一次";
            	}
                var govcommonplanTpt = _.template($("#govcommonplanTpt").html());
                $("#govcommonplanForm").html(govcommonplanTpt(data));
            }
        },
        error: function () {
            parent.toast("初始化信息加载失败!");
        }
    });

});
/**
 * 获取星期
 * @param weekdate
 * @returns {String}
 */
function getWeek(weekdate){
	var week;
	switch (weekdate) {
	case 1:
		week = '日';
		break;
	case 2:
		week = '一';
		break;
	case 3:
		week = '二';
		break;
	case 4:
		week = '三';
		break;
	case 5:
		week = '四';
		break;
	case 6:
		week = '五';
		break;
	case 7:
		week = '六';
		break;
	}
	return week;
}



function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
