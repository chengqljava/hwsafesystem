/**
 * Created by Administrator on 2017/10/25.
 */
$(function () {
    //初始化企业信息
    initEntInfo();
    //初始化隐患信息
    initHiddendangerInfo();
    //初始化监测监控信息
    // initMonitorInfo();
    //初始化应急救援信息
    initEmsInfo();
    //初始化行政执法信息
    // initLawInfo();
    //初始化应急值守信息
    initDutyInfo();
    //初始化待办任务和待办文书
    initTodoInfo();
    var isPc = IsPC();
//    console.log(isPc)
    if(isPc == false){
    	$(".content .c1 span").css('margin-top','0');
    }
    
    //初始化环保指数并每隔一小时读取最新数据
    if (window.envInfoTicket) {
    	clearInterval(window.envInfoTicket);
    }
    initEnvInfo();
    window.envInfoTicket = setInterval(initEnvInfo, 3600000);
});

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 初始化环保信息
 */
function initEnvInfo() {
	var aqiAvg = "-",
		aqiAvgLvl = "-",
		temAvg = "-",
		humAvg = "-",
		pm25Avg = "-",
		pm10Avg = "-",
		so2Avg = "-",
		coAvg = "-",
		o3Avg = "-",
		no2Avg = "-",
		recTime = "-",
		tvocsAvg = "-";
	
	//查询最新的空气检测站点位数据
	$.ajax({
        type: "post",
        url: BASE_URL + "epi/epistation/loadAllGasStationList",
        data: {"stationName": ""},
        success: function (retData) {
//        	console.log(retData);
        	if (retData && 0 < retData.reStationBaseList.length) {
        		var staDetList = JSON.parse(retData.resultAirArrStr);
        	   
        		//计算大气各参数的平均值
          	  	var totalAqi = 0,
          	  	  	totalTem = 0,
          	  	  	totalHum = 0,
          	  	  	totalPm25 = 0,
          	  	  	totalPm10 = 0,
          	  	  	totalSo2 = 0,
          	  	  	totalCo = 0,
          	  	  	totalO3 = 0,
          	  	  	totalNo2 = 0;
//          	  	console.log(retData.reStationBaseList);
//          	  	console.log(staDetList);
          	  	
          	  	_.map(retData.reStationBaseList, function(tmpSta, index) {
          	  		var curStaDet = (_.where(staDetList, {"siteCode": tmpSta.SITECODE}))[0];
          	  		totalAqi += parseFloat(curStaDet.aqi || 0);
          	  		totalTem += parseFloat(curStaDet.temp || 0);
         		  	totalHum += parseFloat(curStaDet.hum || 0);
         		  	totalPm25 += parseFloat(curStaDet.pm2_5 || 0);
         		  	totalPm10 += parseFloat(curStaDet.pm10 || 0);
         		  	totalSo2 += parseFloat(curStaDet.so2 || 0);
         		  	totalCo += parseFloat(curStaDet.co || 0);
         		  	totalO3 += parseFloat(curStaDet.o3 || 0);
         		  	totalNo2 += parseFloat(curStaDet.no2 || 0);
          	  	});
         	   
          	  	aqiAvg = (totalAqi/retData.reStationBaseList.length).toFixed(0);
          	  	temAvg = (totalTem/retData.reStationBaseList.length).toFixed(0);
          	  	humAvg = (totalHum/retData.reStationBaseList.length).toFixed(0);
          	  	pm25Avg = (totalPm25/retData.reStationBaseList.length).toFixed(0);
          	  	pm10Avg = (totalPm10/retData.reStationBaseList.length).toFixed(0);
          	  	so2Avg = (totalSo2/retData.reStationBaseList.length).toFixed(0);
          	  	coAvg = (totalCo/retData.reStationBaseList.length).toFixed(0);
          	  	o3Avg = (totalO3/retData.reStationBaseList.length).toFixed(0);
          	  	no2Avg = (totalNo2/retData.reStationBaseList.length).toFixed(0);
          	  	recTime = _.last(_.sortBy(staDetList, function(staDet){return staDet.monitorTime;})).monitorTime;
         		
          	  	//获取AQI级别
          	  	var aqiAvgLvlName = "-";
          	  	if (0 <= aqiAvg && 50 > aqiAvg) {
          	  		aqiAvgLvl = "1";
          	  		aqiAvgLvlName = "优";
          	  	} else if (50 <= aqiAvg && 100 > aqiAvg) {
          	  		aqiAvgLvl = "2";
          	  		aqiAvgLvlName = "良";
          	  	} else if (100 <= aqiAvg && 150 > aqiAvg) {
          	  		aqiAvgLvl = "3";
          	  		aqiAvgLvlName = "轻度污染";
          	  	} else if (150 <= aqiAvg && 200 > aqiAvg) {
          	  		aqiAvgLvl = "4";
          	  		aqiAvgLvlName = "中度污染";
          	  	} else if (200 <= aqiAvg && 300 > aqiAvg) {
          	  		aqiAvgLvl = "5";
          	  		aqiAvgLvlName = "重度污染";
          	  	} else if (300 <= aqiAvg && 500 >= aqiAvg) {
          	  		aqiAvgLvl = "6";
          	  		aqiAvgLvlName = "严重污染";
          	  	} else {
          	  		aqiAvgLvl = "1";
          	  	}
          	  	
          	  	$(".aqiCount").empty().text(aqiAvg);
          	  	$(".aqiCount").removeClass().addClass("aqiCount").addClass("level" + aqiAvgLvl);
          	  	$("#aqiAvgLvlName").empty().text(aqiAvgLvlName);
          	  	$("#aqiAvgLvlName").removeClass().addClass("level" + aqiAvgLvl);
          	  	$("#temAvg").empty().text(temAvg);
          	  	$("#humAvg").empty().text(humAvg);
          	  	
          	  	//pm2.5相关赋值
          	  	var pm25AvgLvl = "1";
          	  	if (0 <= pm25Avg && 35 > pm25Avg) {
          	  		pm25AvgLvl = "1";
          	  	} else if (35 <= pm25Avg && 75 > pm25Avg) {
          	  		pm25AvgLvl = "2";
          	  	} else if (75 <= pm25Avg && 115 > pm25Avg) {
          	  		pm25AvgLvl = "3";
          	  	} else if (115 <= pm25Avg && 150 > pm25Avg) {
          	  		pm25AvgLvl = "4";
          	  	} else if (150 <= pm25Avg && 250 > pm25Avg) {
          	  		pm25AvgLvl = "5";
          	  	} else if (250 <= pm25Avg && 350 > pm25Avg) {
          	  		pm25AvgLvl = "6";
          	  	} 
          	  	$("#pm25Avg").empty().text(pm25Avg);
          	  	$("#pm25Img").attr("src", BASE_URL + "images/welcome/pm25_" + pm25AvgLvl + ".png");
          	  	$("#pm25Lvl").removeClass().addClass("level" + pm25AvgLvl);
          	  	
          	  	//pm10相关赋值
          	  	var pm10AvgLvl = "1";
          	  	if (0 <= pm10Avg && 50 > pm10Avg) {
          	  		pm10AvgLvl = "1";
          	  	} else if (50 <= pm10Avg && 150 > pm10Avg) {
          	  		pm10AvgLvl = "2";
          	  	} else if (150 <= pm10Avg && 250 > pm10Avg) {
          	  		pm10AvgLvl = "3";
          	  	} else if (250 <= pm10Avg && 350 > pm10Avg) {
          	  		pm10AvgLvl = "4";
          	  	} else if (350 <= pm10Avg && 420 > pm10Avg) {
          	  		pm10AvgLvl = "5";
          	  	} else if (420 <= pm10Avg && 500 > pm10Avg) {
          	  		pm10AvgLvl = "6";
          	  	} 
          	  	$("#pm10Avg").empty().text(pm10Avg);
          	  	$("#pm10Img").attr("src", BASE_URL + "images/welcome/pm10_" + pm10AvgLvl + ".png");
          	  	$("#pm10Lvl").removeClass().addClass("level" + pm10AvgLvl);
          	  
          	  	//分别为 so2,co,o3,no2,recTime赋值
          	  	$("#so2Avg").empty().text(so2Avg);
          	  	$("#coAvg").empty().text(coAvg);
          	  	$("#o3Avg").empty().text(o3Avg);
          	  	$("#no2Avg").empty().text(no2Avg);
          	  	$("#recTime").empty().html("&nbsp;" + recTime);
//          	  	console.log("aqiAvg:" + aqiAvg);
//          	  	console.log("aqiAvgLvl:" + aqiAvgLvl);
//          	  	console.log("temAvg:" + temAvg);
//          	  	console.log("humAvg:" + humAvg);
//          	  	console.log("pm25Avg:" + pm25Avg);
//          	  	console.log("pm10Avg:" + pm10Avg);
//          	  	console.log("so2Avg:" + so2Avg);
//          	  	console.log("coAvg:" + coAvg);
//          	  	console.log("o3Avg:" + o3Avg);
//          	  	console.log("no2Avg:" + no2Avg);
//         	  	console.log("recTime:" + recTime);
        	}
        }
	});
	
	//查询最新的污染源检测站点位数据
	$.ajax({
		type: "post",
		url: BASE_URL + "epi/epistation/loadAllWryStationList",
		data: {"stationName": ""},
		success: function (retData){
			if (retData && 0 < retData.reStationBaseList.length) {
				var staDetList = JSON.parse(retData.resultWryArrStr),
					totalTvocs = 0;
				_.map(retData.reStationBaseList, function(tmpData, index) {
					var curStaDet = (_.where(staDetList, {"DEVICECODE": tmpData.SITECODE}))[0];
					totalTvocs += parseFloat(curStaDet.TVOCs || 0);
				});
				tvocsAvg = (totalTvocs/retData.reStationBaseList.length).toFixed(2);
//				console.log("tvocsAvg:" + tvocsAvg);
				$("#tvocsAvg").empty().text(tvocsAvg);
			}
		}
	});
}