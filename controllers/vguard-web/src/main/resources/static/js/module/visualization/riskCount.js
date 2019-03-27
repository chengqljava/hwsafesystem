/**
 * 风险统计
 */
$(function() {
    initDssRisk(bid,fid);
})

function initDssRisk(bid,fid){
    var postData={};
    if(bid!="undefined"&&bid!=undefined&&bid!=""&&fid!="undefined"&&fid!=undefined&&fid!=""){
        postData["bid"]=bid;
        postData["fid"]=fid;
    }
    //alert(JSON.stringify(postData));
    $.ajax({
        type : 'post',
        url : BASE_URL + 'dangersource/dssrskrecord/kshdsscount',
        cache : false,
        data : postData,
        dataType : 'json',
        global : false,
        success : function(data) {
            var classValue1 = [];
            if (data) {
                if(data.dssRiskChart){
                    var dssRiskCharts = data.dssRiskChart;
                    var n = 0;
                    for ( var key in dssRiskCharts) {
//					console.log("属性：" + key + ",值：" + dssRiskCharts[key]);
                        if (key == "重大风险") {
                            n = 0;
                            $("#zdfxcount").text(dssRiskCharts[key]);
                        } else if (key == "较大风险") {
                            n = 1;
                            $("#jdfxcount").text(dssRiskCharts[key]);
                        } else if (key == "一般风险") {
                            n = 2;
                            $("#ybfxcount").text(dssRiskCharts[key]);
                        } else if (key == "低风险") {
                            n = 3;
                            $("#dfxcount").text(dssRiskCharts[key]);
                        }
                        classValue1[n] = {
                            value : dssRiskCharts[key],
                            name : key
                        };
                        // n = n+1;
                    }
                }else{
                    classValue1[0] = {value :0,name : "重大风险"};
                    classValue1[1] = {value :0,name : "较大风险"};
                    classValue1[2] = {value :0,name : "一般风险"};
                    classValue1[3] = {value :0,name : "低风险"};
                }

                initDssRecord(classValue1);
            }


        }
    });
}


function initDssRecord(classValue1) {
	var wxyChart = echarts.init(document.getElementById('wxy_echarts'));
	wxyOption = {
		tooltip : {
			trigger : 'axis',
			axisPointer : {
				type : 'shadow'
			}
		},
		toolbox : {
			show : false,
			orient : 'vertical',
			x : 'right',
			y : 'middle'
		},
		calculable : true,
		grid : {
			x : 20,
			x2 : 20,
			y : 20,
			y2 : 20
		},
		xAxis : [ {
			type : 'category',
			data : [ '重大风险', '较大风险', '一般风险', '低风险' ],
			axisLine : {
				show : true,
				lineStyle : {
					color : [ '#ddd' ],
					width : 2
				}
			},
			axisTick : {
				show : false
			},
			splitLine : {
				show : false
			},
			axisLabel : {
				textStyle : {
					color : 'rgba(0,0,0,0.65)'
				}
			}
		} ],
		yAxis : [ {
			type : 'value',
			axisLine : {
				show : false
			},
			axisTick : {
				show : false
			},
			splitLine : {
				show : true,
				lineStyle : {
					color : [ 'rgba(0,0,0,0.10)' ],
					width : 1,
					type : 'dashed'
				}
			},
			axisLabel : {
				textStyle : {
					color : 'rgba(0,0,0,0.65)'
				}
			}
		} ],
		series : [ {
			name : '风险数量',
			type : 'bar',
			barWidth : '50%',
			data : classValue1,
			itemStyle : {
				normal : {
					color : function(params) {
						var tgtColor = "";
						if ("重大风险" == params.name) {
							tgtColor = "#F5222D";
						} else if ("较大风险" == params.name) {
							tgtColor = "#FAAD14";
						} else if ("一般风险" == params.name) {
							tgtColor = "#FFD700";
						} else if ("低风险" == params.name) {
							tgtColor = "#1890FF";
						}
						return tgtColor;
					}
				}
			},
			label : {
				normal : {
					show : true,
					position : 'top',
					formatter : '{c} '
				},
				emphasis : {
					show : true,
					textStyle : {
						color : '#666666',
						fontSize : '11',
						fontWeight : 'bold'
					}
				}
			}
		} ]
	};
	wxyChart.setOption(wxyOption);
}
function showDssInfo(riskrating) {
    var bid=$("#buildid").val();
    var fid=$("#floorid").val();
    if(bid!="undefined"&&bid!=undefined&&bid!=""&&fid!="undefined"&&fid!=undefined&&fid!=""){
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskCountList.html?riskrating="
            + riskrating+"&bid="+bid+"&fid="+fid, "风险列表", "60%", "70%");
    }else{
        parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/dssrskCountList.html?riskrating="
            + riskrating, "风险列表", "60%", "70%");
	}

}

