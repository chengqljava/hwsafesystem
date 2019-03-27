/**
 * Created by Administrator on 2017/10/19.
 */

var userid = getQueryString("userid");
$(function () {
	$("#userid").val(userid);
    changQarter();
    var currYear = new Date().getFullYear();
    var html = "<li>" + (currYear - 4) + "</li>" +
        "<li>" + (currYear - 3) + "</li>" +
        "<li>" + (currYear - 2) + "</li>" +
        "<li>" + (currYear - 1) + "</li>" +
        "<li class='cur'>" + currYear + "</li>";
    $(".year").html(html);

    $(".year").on("click", "li", function () {
        $(this).addClass('cur').siblings().removeClass('cur');
        setTimeByQarter($(this).text(), $("#qarter").val());
        if ($(this).index() == 0) {
            var year = parseInt($(this).text());
            var html = "<li>" + (year - 2) + "</li>" +
                "<li>" + (year - 1) + "</li>" +
                "<li class='cur'>" + year + "</li>" +
                "<li>" + (year + 1) + "</li>" +
                "<li>" + (year + 2) + "</li>";
            $(".year").html(html);
        } else if ($(this).index() == 4) {
            var year = parseInt($(this).text());
            var curYear = new Date().getFullYear();
            if (year != curYear) {
                var html = "<li>" + (year - 2) + "</li>" +
                    "<li>" + (year - 1) + "</li>" +
                    "<li class='cur'>" + year + "</li>" +
                    "<li>" + (year + 1) + "</li>" +
                    "<li>" + (year + 2) + "</li>";
                $(".year").html(html);
            }
        }
        DssGradeCount();
    });

    $(".quarter").find("li").each(function () {
        $(this).bind("click", function () {
            $(this).addClass('cur').siblings().removeClass('cur');
            var year = $("#stime").val().substring(0, 4);
            $("#qarter").val($(this).text());
            setTimeByQarter(year, $(this).text());
            DssGradeCount();
        });
    });

    DssGradeCount();
});


/**
 * 重大危险源分级
 */
var xGradeArrayData = new Array();//x轴数据
var wxyGradeArrayData = new Array();//危险源数组
var qyxGradeArrayData = new Array();//企业数数组
function DssGradeCount(){
	var dangSouLevelData = SelectOption.getdangSouLevelData();//重大危险源级别
	xGradeArrayData = [];
	wxyGradeArrayData = [];
	qyxGradeArrayData = [];
	$.ajax({
		type : 'post',
		url : BASE_URL+'/dangersource/dssStatistics/loadDssGradeCount',
		cache : false,
		data:$("#dsscountform").serializeArray(),
		dataType : 'json',
		global : false,
		success : function(map) {
			if(map.success==true){
				for(var j=0;j<dangSouLevelData.length;j++){
					if(map.datas.length>0){
						for(var i=0;i<map.datas.length;i++){
							var dangerlevel = map.datas[i].DANGERLEVEL; //分类
							var qys = map.datas[i].QYS; //企业数
							var wxys = map.datas[i].WXYS;//危险源数
							if(dangSouLevelData[j].code == dangerlevel){
								wxyGradeArrayData[j] = wxys;
								qyxGradeArrayData[j] = qys;
								break;
							}else{
								wxyGradeArrayData[j] = 0;
								qyxGradeArrayData[j] = 0;
							}
						}
					}else{
						wxyGradeArrayData[j] = 0;
						qyxGradeArrayData[j] = 0;
					}
					xGradeArrayData.push(dangSouLevelData[j].name);
				}
				bar(xGradeArrayData,qyxGradeArrayData,wxyGradeArrayData);
			}
		}
	});
}


/**
 * @param xArrayData x轴数据
 * @param qyData 企业数据
 * @param wxyData 危险源数据
 */
function bar(xArrayData,qyData,wxyData){
		var option = {
			title : {
				text : "危险源分级数",
				x : 'left',
				y : 'top',
				textStyle: {
		        	fontFamily: "微软雅黑",
		        	fontSize: 12,
		        	color: "black"
		        }
			},
			tooltip : {
				show : true,
				trigger: 'axis'
			},
			legend: {
		        data:['企业数','危险源数']
//		        orient : 'vertical'
//		        x : 'right',
//				y : 'center'
			},
			xAxis : [{
				type : 'category',
				data : xArrayData,
				name: "分级"
			     }],
			yAxis : [ {
				type : 'value',
				name:"数量"
			} ],
	        calculable : false,//false 禁止拖动
			series : [ {
				name : "企业数",
				type : "bar",
				data : qyData,
//				barwidth : 10,//柱图宽度
				itemStyle: {
					normal : {
						color : '#9DE5F3'
					}
	             }
			   },{
		            name:'危险源数',
		            type:'bar',
		            data:wxyData,
//		        	barWidth : 10,//柱图宽度
		        	itemStyle: {
		        		normal : {
							color : '#FBDB74'
						}
		             }
		        }
			]
		};
		 var myChart = echarts.init(document.getElementById('chartMain'));
		    //使用制定的配置项和数据显示图表
		    myChart.setOption(option);
		    window.onresize= function(){
		    	var width = $(window).innerWidth();
		    	width = (width-80)/3;
		    	$("#chartMain").css('width',width);
		    	myChart.resize();
		    }
}

/**
 * 季度切换
 */
function changQarter() {
    var curYear = new Date().getFullYear();
    var curMonth = new Date().getMonth() + 1;
    var curQarter = getQarter2Month(curMonth);
    switch (curQarter) {
        case 1:
            $("#one").addClass("cur");
            break;
        case 2:
            $("#two").addClass("cur");
            break;
        case 3:
            $("#three").addClass("cur");
            break;
        case 4:
            $("#four").addClass("cur");
            break;
    }
    $("#" + curQarter).addClass("cur");
    $("#qarter").val(curQarter);
    setTimeByQarter(curYear, curQarter)
}

/**
 * 根据季度设置时间
 * @param qarter
 */
function setTimeByQarter(year, qarter) {
    if (qarter == 1) {
        $("#stime").val(year + "-01-01");
        $("#etime").val(year + "-03-31");
    } else if (qarter == 2) {
        $("#stime").val(year + "-04-01");
        $("#etime").val(year + "-06-30");
    } else if (qarter == 3) {
        $("#stime").val(year + "-07-01");
        $("#etime").val(year + "-09-30");
    } else if (qarter == 4) {
        $("#stime").val(year + "-10-01");
        $("#etime").val(year + "-12-31");
    }
}

/**
 * 根据月份获取季度
 * @param month
 */
function getQarter2Month(month) {
    if (1 <= month && month <= 3) {
        return 1;
    } else if (4 <= month && month <= 6) {
        return 2;
    } else if (7 <= month && month <= 9) {
        return 3;
    } else {
        return 4;
    }
}

function getQueryString(name) {
	  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	  var r = window.location.search.substr(1).match(reg);
	  if(r!=null)return  unescape(r[2]); return null;
	}
