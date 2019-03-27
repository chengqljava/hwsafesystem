$(function(){
    
    // 报警分析
    titleAddClickEvent('zdwxyNav');

    //应急资源统计
    yjzyCnt();
    
    // 标题内的tab页切换
    function titleAddClickEvent(nav){
        $('.'+nav).on('click','li',function(){
            var $id = $(this).data('id');
            $('.'+nav+' li').removeClass('active');
            $(this).addClass('active');
            if($id == 'day'){
            	bgfxByDay()
            }
            else if( $id == 'month'){
            	bgfxByMonth()
            }
            else{
            	bgfxByYear()
            }
        })
    }
    var myDate = new Date();
    
    //时间下拉选
    $('#yhpcCount').bind('change', function () {
    	var searchtime = $(this).val();
    	$("#yhpctime").val(searchtime);
    	entCount(searchtime);
    })
    $('#zxjcCount').bind('change', function () {
    	var searchtime = $(this).val();
    	$("#zxjctime").val(searchtime);
    	alarmCount(searchtime);
    })
    $('#yhpcNum').bind('change', function () {
    	var searchtime = $(this).val();
    	$("#yhtjtime").val(searchtime);
    	hidCount(searchtime);
    })
    
//    var sbglCharts = echarts.init(document.getElementById('sbglCharts'));
    var zclCharts = echarts2.init(document.getElementById('zclCharts'));
    var gzlCharts = echarts2.init(document.getElementById('gzlCharts'));
    var bjlCharts = echarts2.init(document.getElementById('bjlCharts'));
    var cslCharts = echarts2.init(document.getElementById('cslCharts'));
//    var sbztCharts = echarts.init(document.getElementById('sbztCharts'));
    var bjfxCharts = echarts.init(document.getElementById('bjfxCharts'));
    var sbglOpt = {};
    var zclOpt = {};
    var gzlOpt = {};
    var bjlOpt = {};
    var sbztOpt = {};
    var dataMap = {};
    var bjfxOpt= {};
//    获取运行时间和值班人员
    $.ajax({
        type: "post",
        url: BASE_URL + "enterprise/enttransfer/loadtodaydata",
        success: function (res) {
            $('#runTime').html(res.runtime);
            var zbryHtml = '';
            if(res.transferList.length == 0){
            	zbryHtml = '<p>-</p>';
            }
            else{
            	res.transferList.forEach(function(item){
            		zbryHtml += "<p>"+item.CARETAKER+"</p>"
            	});
            }
//            $('#zbryList').html(zbryHtml);
            $('#zbryList').html('<p>钱芳芳 15838810568</p><p>刘大伟 13688760000</p>');
        }
    });
//    隐患排查、在线监测、设备管理、人员管理数据
    entCount("month");
    alarmCount("month");
    
    var DEVICERATE = 0;
//隐患统计
    hidCount("month");
    
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcount/countlist",
        success: function (res) {
//            $('#glsbCounts a').html(res.deviceCount.DEVICECOUNT?res.deviceCount.DEVICECOUNT:0);
//            $('#wxCounts a').html(res.deviceCount.MAINTANCOUNT?res.deviceCount.MAINTANCOUNT:0);
//            $('#bdCounts a').html(res.deviceCount.DEMARCATECOUNT?res.deviceCount.DEMARCATECOUNT:0);
//            DEVICERATE = res.deviceCount.DEVICERATE?res.deviceCount.DEVICERATE.toFixed(0):0;
            $('#yhpcryCounts').html(res.personCount.OPERATORCOUNT?res.personCount.OPERATORCOUNT:0);
            $('#aqglryCounts').html(res.personCount.SAFEMANAGERCOUNT?res.personCount.SAFEMANAGERCOUNT:0);
            $('#cjfzryCounts').html(res.personCount.SAFEPERSONCOUNT?res.personCount.SAFEPERSONCOUNT:0);
            
            sbglOpt = {
                title: {
                    text: '设备完整率',
                    x: 'center',
                    y: '15%',
                    //正标题样式
                    textStyle: {
                        fontSize: 14,
                        color: 'rgba(0,0,0,.45)'
                    }
                },
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    show: false, //default true
                    showDelay: 0,
                    hideDelay: 50,
                    transitionDuration: 0,
                    borderRadius: 8,
                    borderWidth: 2,
                    padding: 10, // [5, 10, 15, 20]
                },
                series: [
                    {
                        type: 'pie',
                        center: [
                            '50%', '58%'
                        ], //圆心坐标（div中的%比例）
                        radius: [
                            20, 45
                        ], //半径
                        hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'center',
                                show: false,
                                textStyle: {
                                    fontSize: '14',
                                    color: 'rgba(0,0,0,.85)',
                                    fontWeight: 'bold'
                                },
                                formatter: '{b}\n{c}%'
                            }
                        },
                        data: [
                            {
                                name: '',
                                value: DEVICERATE,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#2FC25B'
                                    },
                                    emphasis: {
                                        color: '#2FC25B'
                                    }
                                }
                            }, {
                                name: '',
                                value: (100 - DEVICERATE),
                                lacbel: {},
                                itemStyle: {
                                    normal: {
                                        color: '#f4f6f8'
                                    },
                                    emphasis: {
                                        color: '#f4f6f8'
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
//            sbglCharts.setOption(sbglOpt);
        }
    });
    // 实时监测信息
    var probeZC = 0;
    var probeGZ = 0;
    var probeBJ = 0;
    var probeCS = 0;
    var probeAll = 0;
    var probeZCRate = 0;
    var probeGZRate = 0;
    var probeBJRate = 0;
    var probeCSRate = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macrealtime/loadrealtimedata",
        success: function (res) {
            $('#updateTime').html( myDate.getFullYear()+'-'+ (myDate.getMonth()+1)+'-'+ myDate.getDate()+' '+ myDate.getHours()+':'+ myDate.getMinutes()+':'+ myDate.getSeconds());
            res.probenum.forEach(function(item){
            	switch (item.STATE) {
                case 1:
                	probeZC = item.PROBNUM;
                    break;
                case 2:
                	probeGZ = item.PROBNUM;
                    break;
                case 3:
                	probeBJ = item.PROBNUM;
                	break;
                case 4:
                	probeCS = item.PROBNUM;
                	break;
                default:
                    break;
            	}
            });
            $('#probeZCCounts').html(probeZC);
            $('#probeGZCounts').html(probeGZ);
            $('#probeBJCounts').html(probeBJ);
            $('#probeCSCounts').html(probeCS);
            probeAll = probeZC+probeGZ+probeBJ+probeCS;
            probeZCRate = (probeZC/probeAll*100).toFixed(0);
            probeGZRate = (probeGZ/probeAll*100).toFixed(0);
            probeBJRate = (probeBJ/probeAll*100).toFixed(0);
            probeCSRate = (probeCS/probeAll*100).toFixed(0);
            zclOpt = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [
                    {
                        name: '正常率',
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center: [
                            '50%', '90%'
                        ], // 默认全局居中
                        radius: 77,
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 40,
                                color: '#52C41A',
                            }
                        }, 
                        axisLabel:{
                            show:false,
                        },
                        axisTick: { 
                            show:false,           // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :2,        // 属性length控制线长
                        },
                        splitLine: {
                            show:false,
                        },
                        pointer: {
                            width: 10,
                            length: '90%',
                            color: 'rgba(255, 255, 255,0.8)'
                        },
                        title: {
                            show: true,
                            offsetCenter: [
                                0, '-70%'
                            ], // x, y，单位px
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        detail: {
                            show: true,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 0,
                            borderColor: '#ccc',
                            width: 100,
                            height: 40,
                            offsetCenter: [
                                0, -30
                            ], // x, y，单位px
                            formatter: '{value}%',
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontSize: 20,
                                color:'rgba(0,0,0,0.85)',
                                fontWeight:"bold"
                            }
                        },
                        data: [
                            {
                                value: probeZCRate,
                                name: '正常率'
                            }
                        ]
                    }
                ]
            };
            gzlOpt = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [
                    {
                        name: '故障率',
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center: [
                            '50%', '90%'
                        ], // 默认全局居中
                        radius: 77,
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 40,
                                color: '#FAAD14',
                            }
                        }, 
                        axisLabel:{
                            show:false,
                        },
                        axisTick: { 
                            show:false,           // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :2,        // 属性length控制线长
                        },
                        splitLine: {
                            show:false,
                        },
                        pointer: {
                            width: 10,
                            length: '90%',
                            color: 'rgba(255, 255, 255,0.8)'
                        },
                        title: {
                            show: true,
                            offsetCenter: [
                                0, '-70%'
                            ], // x, y，单位px
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        detail: {
                            show: true,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 0,
                            borderColor: '#ccc',
                            width: 100,
                            height: 40,
                            offsetCenter: [
                                0, -30
                            ], // x, y，单位px
                            formatter: '{value}%',
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontSize: 20,
                                color:'rgba(0,0,0,0.85)',
                                fontWeight:"bold"
                            }
                        },
                        data: [
                            {
                                value: probeGZRate,
                                name: '故障率'
                            }
                        ]
                    }
                ]
            };
            bjlOpt = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [
                    {
                        name: '报警率',
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center: [
                            '50%', '90%'
                        ], // 默认全局居中
                        radius: 77,
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 40,
                                color: '#F04864',
                            }
                        }, 
                        axisLabel:{
                            show:false,
                        },
                        axisTick: { 
                            show:false,           // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :2,        // 属性length控制线长
                        },
                        splitLine: {
                            show:false,
                        },
                        pointer: {
                            width: 10,
                            length: '90%',
                            color: 'rgba(255, 255, 255,0.8)'
                        },
                        title: {
                            show: true,
                            offsetCenter: [
                                0, '-70%'
                            ], // x, y，单位px
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        detail: {
                            show: true,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 0,
                            borderColor: '#ccc',
                            width: 100,
                            height: 40,
                            offsetCenter: [
                                0, -30
                            ], // x, y，单位px
                            formatter: '{value}%',
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontSize: 20,
                                color:'rgba(0,0,0,0.85)',
                                fontWeight:"bold"
                            }
                        },
                        data: [
                            {
                                value: probeBJRate,
                                name: '报警率'
                            }
                        ]
                    }
                ]
            };
            var cslOpt = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {
                            show: true
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [
                    {
                        name: '超时率',
                        type: 'gauge',
                        startAngle: 180,
                        endAngle: 0,
                        center: [
                            '50%', '90%'
                        ], // 默认全局居中
                        radius: 77,
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                width: 40,
                                color: '#1890FF',
                            }
                        }, 
                        axisLabel:{
                            show:false,
                        },
                        axisTick: { 
                            show:false,           // 坐标轴小标记
                            splitNumber: 10,   // 每份split细分多少段
                            length :2,        // 属性length控制线长
                        },
                        splitLine: {
                            show:false,
                        },
                        pointer: {
                            width: 10,
                            length: '90%',
                            color: 'rgba(255, 255, 255,0.8)'
                        },
                        title: {
                            show: true,
                            offsetCenter: [
                                0, '-70%'
                            ], // x, y，单位px
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        detail: {
                            show: true,
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderWidth: 0,
                            borderColor: '#ccc',
                            width: 100,
                            height: 40,
                            offsetCenter: [
                                0, -30
                            ], // x, y，单位px
                            formatter: '{value}%',
                            textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontSize: 20,
                                color:'rgba(0,0,0,0.85)',
                                fontWeight:"bold"
                            }
                        },
                        data: [
                            {
                                value: probeCSRate,
                                name: '超时率'
                            }
                        ]
                    }
                ]
            };
            zclCharts.setOption(zclOpt);
            gzlCharts.setOption(gzlOpt);
            bjlCharts.setOption(bjlOpt);
            cslCharts.setOption(cslOpt);
        }
    
    });
//    监控区域
    $.ajax({
        type: "post",
        url: BASE_URL + "dangersource/dssrskplacearea/loadplaceprobe",
        success: function (res) {
            var arr = [];
            res.forEach(function(item){
            	var ZCcounts = 0;
            	var GZcounts = 0;
            	var BJcounts = 0;
            	item.probecountlist.forEach(function(item){
            		switch (item.STATE) {
	            		case '1':
		                  	ZCcounts = item.PROBNUM;
		                    break;
	            		case '2':
	                	    GZcounts = item.PROBNUM;
	                        break;
	            		case '3':
	                	    BJcounts = item.PROBNUM;
	                	    break;
	            		default:
	                        break;
            		}
            	})
            	arr.push({
            		name:item.PLACEAREANAME,
            		people:item.LIABLOR,
            		id:item.PLACEAREAID,
            		ZCcounts:ZCcounts,
            		BJcounts:BJcounts,
            		GZcounts:GZcounts
            	})
            })
            $('#areaContentTable').bootstrapTable({
            	height:300,
            	columns: [{
                    field: 'name',
                    title: '区域名称'
                }, {
                    field: 'people',
                    title: '负责人'
                }, {
                    field: 'ZCcounts',
                    title: '正常点位',
                    sortable: true
                }, {
                    field: 'BJcounts',
                    title: '报警点位',
                    sortable: true
                }, {
                    field: 'GZcounts',
                    title: '故障点位',
                    sortable: true
                }],
                data: arr
            })
            $('#areaContentTable').on('click-cell.bs.table', function (a,b,c,d) {            
                var id = d['id'];
                var type;
                if(b == 'ZCcounts'){
                	type = 1;
                } else if(b == 'BJcounts'){
                	type = 3;
                } else {
                	type = 5;
                }
                if(c>0){                	
                	displayMacList(id,type);
                }
            }); 
        }
    });
    
    // 设备管理
    var sbztOpt = {}
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macdeviceinfo/loadHidDangerInfoList",
        success: function (res) {
            $('#sbCounts').html(res.devicecounts.DEVICECOUNT?res.devicecounts.DEVICECOUNT:0);
            $('#zcsbCounts').html(res.devicecounts.WELLCOUNT?res.devicecounts.WELLCOUNT:0);
            $('#wxsbCounts').html(res.devicecounts.REPAIRCOUNT?res.devicecounts.REPAIRCOUNT:0);
            $('#bfsbCounts').html(res.devicecounts.SCRAPCOUNT?res.devicecounts.SCRAPCOUNT:0);
            
            var lengthDatas = ['','',''];
            var areaDatas =[];
            res.devicetypeList.forEach(function(item){
            	lengthDatas.push({
            		name:item.DEVICETYPENAME,
            		icon:'circle'
            	});
            	areaDatas.push({
            		name:item.DEVICETYPENAME,
            		value:item.DEVICECOUNT?item.DEVICECOUNT:0
            	})
            });
            sbztOpt = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'right',
                    data:lengthDatas,
                    itemWidth: 8,
                    itemHeight: 8,
                    itemGap: 26
                },
                series: [
                    {
                        name:'设备状态',
                        type:'pie',
                        selectedMode: 'single',
                        radius: [0, '35%'],
                        center:['30%','50%'],
                        label: {
                            normal: {
                                position: 'inner',
                                textStyle:{
                                fontSize: 10,
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:res.devicecounts.WELLCOUNT?res.devicecounts.WELLCOUNT:0, name:'正常'},
                            {value:res.devicecounts.REPAIRCOUNT?res.devicecounts.REPAIRCOUNT:0, name:'维修'},
                            {value:res.devicecounts.SCRAPCOUNT?res.devicecounts.SCRAPCOUNT:0, name:'报废'}
                        ]
                    },
                    {
                        name:'设备数量',
                        type:'pie',
                        radius: ['50%', '85%'],
                        center:['30%','50%'],
                        label: {
                            normal: {
                                show:false,
                            }
                        },
                        data:areaDatas
                    },
                ],
                color:['#2FC25B','#FAAD14','#F04864','#1890FF','#13C2C2','#2FC25B','#F5A623','#E200FF','#F8E71C','#F04864'],
            };
//            sbztCharts.setOption(sbztOpt);
        }
    })
    // 区域排名
    var sbztOpt = {}
   /* $.ajax({
        type: "post",
        url: BASE_URL + "monitor/welcome/loadAlarmCountByArea",
        success: function (res) {
        	var datas = [];
        	res.countList.forEach(function(item,index){
        		datas.push({
        			index:index+1,
            		name:item.PLACEAREANAME,
            		people:item.LIABLOR,
            		YHcounts:item.ALARMCOUNT?item.ALARMCOUNT:0,
            		YHrate:item.HANDLECOUNT*100/item.ALARMCOUNT?(item.HANDLECOUNT*100/item.ALARMCOUNT).toFixed(2):0
            	})
        	});
        	$('#bjcllTable').bootstrapTable({
        		height:300,
            	columns: [{
                    field: 'index',
                    title: '名次'
                }, {
                    field: 'name',
                    title: '区域名称'
                }, {
                    field: 'people',
                    title: '负责人',
                }, {
                    field: 'YHcounts',
                    title: '报警个数',
                    sortable: true
                }, {
                    field: 'YHrate',
                    title: '报警处理率(%)',
                    sortable: true
                }],
                data: datas
            })
        }
    })*/
    // 区域排名
   /* $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcount/loadHidCountByArea",
        success: function (res) {
        	var datas = [];
        	res.hidCountList.forEach(function(item,index){
        		console.log(item);
        		if(index < 5){
	        		datas.push({
	        			index:index+1,
	            		name:item.PLACEAREANAME,
	            		people:item.LIABLOR,
	            		YHcounts:item.HIDCOUNT,
	            		YHrate: item.REFORMRATE*100
	            	})
        		}
        		else{
        			return false;
        		}
        	});
        	$('#yhzglTable').bootstrapTable({
        		height:300,
            	columns: [{
                    field: 'index',
                    title: '名次'
                }, {
                    field: 'name',
                    title: '区域名称'
                }, {
                    field: 'people',
                    title: '负责人',
                }, {
                    field: 'YHcounts',
                    title: '隐患数量',
                    sortable: true
                }, {
                    field: 'YHrate',
                    title: '隐患整改率(%)',
                    sortable: true
                }],
                data: datas
            })
        }
    })*/
    
    // 报警分析
    bgfxByDay();
    function bgfxByDay(){
	    $.ajax({
	        type: "post",
	        url: BASE_URL + "monitor/macprobe/loadalarmarea",
	        data:{type:'day'},
	        success: function (res) {
	        	var day = myDate.getDate();
	        	var dates = [];
	        	var seriess = [];
	        	var legthDates = [];
	        	for(var i=0;i< day;i++){
	        		dates.push(i);
	        		legthDates.push((i+1)+'日');
	        		
	        	};
	        	var CDBdatas = {};
	        	var DBdatas = {};
	        	var GBdatas = {};
	        	var CGBdatas = {};
	        	var MLCdatas = {};
	        	res.alarmList.forEach(function(item,index){
	        		var itemIndex = index;
	        		if(itemIndex < dates.length){
						var CDB = [];
						var DB = [];
						var GB = [];
						var CGB = [];
						var MLC = [];
		        		item.dayalarmList.forEach(function(item,index){
	        				if(item.areaAlarmList.length <1){
	        					CDB.push(0);
	        					DB.push(0);
	        					GB.push(0);
	        					CGB.push(0);
	        					MLC.push(0);
	        				}
	        				else{
	        					item.areaAlarmList.forEach(function(item){
	        						switch (item.STATE) {
	        				        case '100':
	        				        	MLC.push(item.ALARMCOUNT);
	        				            break;
	        				        case '101':
	        				        	DB.push(item.ALARMCOUNT);
	        				            break;
	        				        case '102':
	        				        	GB.push(item.ALARMCOUNT);
	        				            break;
	        				        case '103':
	        				        	CDB.push(item.ALARMCOUNT);
	        				            break;
	        				        case '104':
	        				        	CGB.push(item.ALARMCOUNT);
	        				            break;
	        				        default:
	        				            break;
	        						}
	        					});        					
	        				}
	        				CDBdatas[itemIndex] = CDB;
	    	        		DBdatas[itemIndex] = DB;
	    	        		GBdatas[itemIndex] = GB;
	    	        		CGBdatas[itemIndex] = CGB;
	    	        		MLCdatas[itemIndex] = MLC;
		        		});
		    		}
		    		else{
		    			return false;
		    		}
		    	});
	        	dataMap.dataDB= dataFormatter(DBdatas);
	            dataMap.dataCDB = dataFormatter(CDBdatas);
	            dataMap.dataGB = dataFormatter(GBdatas);
	            dataMap.dataCGB = dataFormatter(CGBdatas);
	            dataMap.dataMLC = dataFormatter(MLCdatas);
	            
	            for(var i=0;i<= day;i++){
	        		var iStr = i.toString();
	        		seriess.push({
	                    series: [
	                        {data: dataMap.dataCDB[iStr]},
	                        {data: dataMap.dataDB[iStr]},
	                        {data: dataMap.dataGB[iStr]},
	                        {data: dataMap.dataCGB[iStr]},
	                        {data: dataMap.dataMLC[iStr]}
	                    ]
	                })
	        	}
	            // state{五个}
	            //   时间 、 每个区域的数量
	            var bjfxOpt = {
	                baseOption: {
	                    timeline: {
	                        // y: 0,
	                        axisType: 'category',
	                        // realtime: false,
	                        // loop: false,
	                        autoPlay: false,
	                        // currentIndex: 2,
	                        playInterval: 3000,
	                        // controlStyle: {
	                        //     position: 'left'
	                        // },
	                        data: legthDates,
	                        label: {
	                            // formatter:value,
	                            // formatter : function(s) {
	                            //     return (new Date(s)).getFullYear();
	                            // }
	                        }
	                    },
	                    tooltip: {
	                    },
	                    legend: {
	                        x: 'right',
	                        y: '2%',
	                        data: ['超低报', '低报', '高报', '超高报', '满量程'],
	                        // selected: {
	                        //     'GDP': false, '金融': false, '房地产': false
	                        // }
	                    },
	                    calculable : true,
	                    grid: {
	                        top: 50,
	                        left: 50,
	                        right: 50,
	                        bottom: 100,
	                        tooltip: {
	                            trigger: 'axis',
	                            axisPointer: {
	                                type: 'shadow',
	                                label: {
	                                    show: true,
	                                    formatter: function (params) {
	                                        return params.value.replace('\n', '');
	                                    }
	                                }
	                            }
	                        }
	                    },
	                    xAxis: [
	                        {
	                            'type':'category',
	                            'axisLabel':{'interval':0},
	                            'data':res.areanameList,
	                            splitLine: {show: false}
	                        }
	                    ],
	                    yAxis: [
	                        {
	                            type: 'value',
	                            name: '报警数量（个）',
	                            min:0,
	                            minInterval: 1
	                        }
	                    ],
	                    series: [
	                        {name: '超低报', type: 'bar', itemStyle: { normal: {color: '#1890FF'}}},
	                        {name: '低报', type: 'bar', itemStyle: { normal: {color: '#13C2C2'}}},
	                        {name: '高报', type: 'bar', itemStyle: { normal: {color: '#F04864'}}},
	                        {name: '超高报', type: 'bar', itemStyle: { normal: {color: '#F5A623'}}},
	                        {name: '满量程', type: 'bar', itemStyle: { normal: {color: '#8543E0'}}}
	                    ]
	                },
	                options: seriess
	            };  
	            bjfxCharts.setOption(bjfxOpt);
	        }
	    })
    }
    
    function bgfxByMonth(){
        $.ajax({
            type: "post",
            url: BASE_URL + "monitor/macprobe/loadalarmarea",
            data:{type:'month'},
            success: function (res) {
            	var month = myDate.getMonth();
            	var dates = [];
            	var seriess = [];
            	var legthDates = [];
            	for(var i=0;i<= month;i++){
            		dates.push(i);
            		legthDates.push((i+1)+'月');
            		
            	};
            	var CDBdatas = {};
            	var DBdatas = {};
            	var GBdatas = {};
            	var CGBdatas = {};
            	var MLCdatas = {};
            	res.alarmList.forEach(function(item,index){
            		var itemIndex = index;
            		if(itemIndex < dates.length){
    					var CDB = [];
    					var DB = [];
    					var GB = [];
    					var CGB = [];
    					var MLC = [];
    	        		item.dayalarmList.forEach(function(item,index){
            				if(item.areaAlarmList.length <1){
            					CDB.push(0);
            					DB.push(0);
            					GB.push(0);
            					CGB.push(0);
            					MLC.push(0);
            				}
            				else{
            					item.areaAlarmList.forEach(function(item){
            						switch (item.STATE) {
            				        case '100':
            				        	MLC.push(item.ALARMCOUNT);
            				            break;
            				        case '101':
            				        	DB.push(item.ALARMCOUNT);
            				            break;
            				        case '102':
            				        	GB.push(item.ALARMCOUNT);
            				            break;
            				        case '103':
            				        	CDB.push(item.ALARMCOUNT);
            				            break;
            				        case '104':
            				        	CGB.push(item.ALARMCOUNT);
            				            break;
            				        default:
            				            break;
            						}
            					});        					
            				}
            				CDBdatas[itemIndex] = CDB;
        	        		DBdatas[itemIndex] = DB;
        	        		GBdatas[itemIndex] = GB;
        	        		CGBdatas[itemIndex] = CGB;
        	        		MLCdatas[itemIndex] = MLC;
    	        		});
    	    		}
    	    		else{
    	    			return false;
    	    		}
    	    	});
            	dataMap.dataDB= dataFormatter(DBdatas);
                dataMap.dataCDB = dataFormatter(CDBdatas);
                dataMap.dataGB = dataFormatter(GBdatas);
                dataMap.dataCGB = dataFormatter(CGBdatas);
                dataMap.dataMLC = dataFormatter(MLCdatas);
                
                for(var i=0;i<= month;i++){
            		var iStr = i.toString();
            		seriess.push({
                        series: [
                            {data: dataMap.dataCDB[iStr]},
                            {data: dataMap.dataDB[iStr]},
                            {data: dataMap.dataGB[iStr]},
                            {data: dataMap.dataCGB[iStr]},
                            {data: dataMap.dataMLC[iStr]}
                        ]
                    })
            	}
                // state{五个}
                //   时间 、 每个区域的数量 
                var bjfxOpt = {
                    baseOption: {
                        timeline: {
                            // y: 0,
                            axisType: 'category',
                            // realtime: false,
                            // loop: false,
                            autoPlay: false,
                            // currentIndex: 2,
                            playInterval: 3000,
                            // controlStyle: {
                            //     position: 'left'
                            // },
                            data: legthDates,
                            label: {
                                // formatter:value,
                                // formatter : function(s) {
                                //     return (new Date(s)).getFullYear();
                                // }
                            }
                        },
                        tooltip: {
                        },
                        legend: {
                            x: 'right',
                            y: '2%',
                            data: ['超低报', '低报', '高报', '超高报', '满量程'],
                            // selected: {
                            //     'GDP': false, '金融': false, '房地产': false
                            // }
                        },
                        calculable : true,
                        grid: {
                            top: 50,
                            left: 50,
                            right: 50,
                            bottom: 100,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow',
                                    label: {
                                        show: true,
                                        formatter: function (params) {
                                            return params.value.replace('\n', '');
                                        }
                                    }
                                }
                            }
                        },
                        xAxis: [
                            {
                                'type':'category',
                                'axisLabel':{'interval':0},
                                'data':res.areanameList,
                                splitLine: {show: false}
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '报警数量（个）',
                                min:0,
	                            minInterval: 1
                            }
                        ],
                        series: [
                            {name: '超低报', type: 'bar', itemStyle: { normal: {color: '#1890FF'}}},
                            {name: '低报', type: 'bar', itemStyle: { normal: {color: '#13C2C2'}}},
                            {name: '高报', type: 'bar', itemStyle: { normal: {color: '#F04864'}}},
                            {name: '超高报', type: 'bar', itemStyle: { normal: {color: '#F5A623'}}},
                            {name: '满量程', type: 'bar', itemStyle: { normal: {color: '#8543E0'}}}
                        ]
                    },
                    options: seriess
                };  
                bjfxCharts.setOption(bjfxOpt);
            }
        })
    }
    function bgfxByYear(){
        $.ajax({
            type: "post",
            url: BASE_URL + "monitor/macprobe/loadalarmarea",
            data:{type:'year'},
            success: function (res) {
            	var dates = [];
            	var seriess = [];
            	var legthDates = [];
            	for(var i=0;i< res.yearList.length;i++){
            		dates.push(i);
            	};
            	res.yearList.forEach(function(item){
            		legthDates.push(item.YEAR);
            	})
            	var CDBdatas = {};
            	var DBdatas = {};
            	var GBdatas = {};
            	var CGBdatas = {};
            	var MLCdatas = {};
            	res.alarmList.forEach(function(item,index){
            		var itemIndex = index;
            		if(itemIndex < dates.length){
    					var CDB = [];
    					var DB = [];
    					var GB = [];
    					var CGB = [];
    					var MLC = [];
    	        		item.dayalarmList.forEach(function(item,index){
            				if(item.areaAlarmList.length <1){
            					CDB.push(0);
            					DB.push(0);
            					GB.push(0);
            					CGB.push(0);
            					MLC.push(0);
            				}
            				else{
            					item.areaAlarmList.forEach(function(item){
            						switch (item.STATE) {
            				        case '100':
            				        	MLC.push(item.ALARMCOUNT);
            				            break;
            				        case '101':
            				        	DB.push(item.ALARMCOUNT);
            				            break;
            				        case '102':
            				        	GB.push(item.ALARMCOUNT);
            				            break;
            				        case '103':
            				        	CDB.push(item.ALARMCOUNT);
            				            break;
            				        case '104':
            				        	CGB.push(item.ALARMCOUNT);
            				            break;
            				        default:
            				            break;
            						}
            					});        					
            				}
            				CDBdatas[itemIndex] = CDB;
        	        		DBdatas[itemIndex] = DB;
        	        		GBdatas[itemIndex] = GB;
        	        		CGBdatas[itemIndex] = CGB;
        	        		MLCdatas[itemIndex] = MLC;
    	        		});
    	    		}
    	    		else{
    	    			return false;
    	    		}
    	    	});
            	dataMap.dataDB= dataFormatter(DBdatas);
                dataMap.dataCDB = dataFormatter(CDBdatas);
                dataMap.dataGB = dataFormatter(GBdatas);
                dataMap.dataCGB = dataFormatter(CGBdatas);
                dataMap.dataMLC = dataFormatter(MLCdatas);
                
                for(var i=0;i< res.yearList.length;i++){
            		var iStr = i.toString();
            		seriess.push({
                        series: [
                            {data: dataMap.dataCDB[iStr]},
                            {data: dataMap.dataDB[iStr]},
                            {data: dataMap.dataGB[iStr]},
                            {data: dataMap.dataCGB[iStr]},
                            {data: dataMap.dataMLC[iStr]}
                        ]
                    })
            	}
                // state{五个}
                //   时间 、 每个区域的数量 
                var bjfxOpt = {
                    baseOption: {
                        timeline: {
                            // y: 0,
                            axisType: 'category',
                            // realtime: false,
                            // loop: false,
                            autoPlay: false,
                            // currentIndex: 2,
                            playInterval: 3000,
                            // controlStyle: {
                            //     position: 'left'
                            // },
                            data: legthDates,
                            label: {
                                // formatter:value,
                                // formatter : function(s) {
                                //     return (new Date(s)).getFullYear();
                                // }
                            }
                        },
                        tooltip: {
                        },
                        legend: {
                            x: 'right',
                            y: '2%',
                            data: ['超低报', '低报', '高报', '超高报', '满量程'],
                            // selected: {
                            //     'GDP': false, '金融': false, '房地产': false
                            // }
                        },
                        calculable : true,
                        grid: {
                            top: 30,
                            left: 50,
                            right: 50,
                            bottom: 100,
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow',
                                    label: {
                                        show: true,
                                        formatter: function (params) {
                                            return params.value.replace('\n', '');
                                        }
                                    }
                                }
                            }
                        },
                        xAxis: [
                            {
                                'type':'category',
                                'axisLabel':{'interval':0},
                                'data':res.areanameList,
                                splitLine: {show: false}
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '报警数量（个）',
                                min:0,
	                            minInterval: 1
                            }
                        ],
                        series: [
                            {name: '超低报', type: 'bar', itemStyle: { normal: {color: '#1890FF'}}},
                            {name: '低报', type: 'bar', itemStyle: { normal: {color: '#13C2C2'}}},
                            {name: '高报', type: 'bar', itemStyle: { normal: {color: '#F04864'}}},
                            {name: '超高报', type: 'bar', itemStyle: { normal: {color: '#F5A623'}}},
                            {name: '满量程', type: 'bar', itemStyle: { normal: {color: '#8543E0'}}}
                        ]
                    },
                    options: seriess
                };  
                bjfxCharts.setOption(bjfxOpt);
            }
        })
    }
    
    
    
    function dataFormatter(obj) {
        var temp;
        for (var year = 0; year < obj.length; year++) {
            var max = 0;
            var sum = 0;
            temp = obj[year];
            for (var i = 0, l = temp.length; i < l; i++) {
                max = Math.max(max, temp[i]);
                sum += temp[i];
                obj[year][i] = {
                    value : temp[i]
                }
            }
            obj[year + 'max'] = Math.floor(max / 100) * 100;
            obj[year + 'sum'] = sum;
        }
        return obj;
    }
    
    $.ajax({
		type : 'post',
		url : BASE_URL + 'ent/welcome/dsscount',
		cache : false,
		data : {},
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data) {
				var dssRiskCharts = data.dssRiskChart;
				var classValue1 = [];
				var n = 0;	
				for(var key in dssRiskCharts){
					  console.log("属性：" + key + ",值：" + dssRiskCharts[key]);
					  if(key == "重大风险"){	
							$("#zdfxcount").text(dssRiskCharts[key]);
						} else if(key == "较大风险"){
							$("#jdfxcount").text(dssRiskCharts[key]);
						}  else if(key == "一般风险"){
							$("#ybfxcount").text(dssRiskCharts[key]);
						}  else if(key == "低风险"){
							$("#dfxcount").text(dssRiskCharts[key]);
						}
					  classValue1[n] = {value: dssRiskCharts[key], name: key};
					  n = n+1;
					}
//				$.each(dssRiskCharts,function(i,dssRiskChart){
//					if(dssRiskChart.RISKRATING == "重大风险"){	
//						$("#zdfxcount").text(dssRiskChart.RESNUM);
//					} else if(dssRiskChart.RISKRATING == "较大风险"){
//						$("#jdfxcount").text(dssRiskChart.RESNUM);
//					}  else if(dssRiskChart.RISKRATING == "一般风险"){
//						$("#ybfxcount").text(dssRiskChart.RESNUM);
//					}  else if(dssRiskChart.RISKRATING == "低风险"){
//						$("#dfxcount").text(dssRiskChart.RESNUM);
//					}
//				})
				var dssEventCharts = data.dssEventChart;
				var classValue2 = [];
			    $.each(dssEventCharts, function (i, dssEventChart) {
			    	classValue2[i] = {value: dssEventChart.RESNUM, name: dssEventChart.RSKDICVALUE};
			    });
			    initDssPie(classValue1,classValue2);
			}
		}
	});

    function initDssPie(classValue1,classValue2){
    	console.log(classValue1);
    	var zdfx = 0;
    	var jdfx = 0;
    	var ybfx = 0;
    	var dfx = 0;
    	for(var i in classValue1){
    		if(classValue1[i].name == '重大风险'){
    			zdfx = classValue1[i].value;
    		}else if(classValue1[i].name == '较大风险'){
    			jdfx = classValue1[i].value;
    		}else if(classValue1[i].name == '一般风险'){
    			ybfx = classValue1[i].value;
    		}else if(classValue1[i].name == '低风险'){
    			dfx = classValue1[i].value;
    		}
    	};
    	var totalfx = zdfx + jdfx + ybfx + dfx;
    	var chart = document.getElementById('fxgkCharts');
    	var echart = echarts.init(chart);
    	option = {
    		    tooltip: {
    		        trigger: 'item',
    		        formatter: "{a} <br/>{b}: {c} ({d}%)"
    		    },
    		    legend: {
    		       orient: 'vertical',
    		       x : 'right',
    		       y : 'center',
    		       itemGap:16,
    		       itemWidth: 8,
    		       itemHeight: 8,
    		       data:['重大风险','较大风险','一般风险','低风险'],
    		       data:[
    		              {
    		                 "name": "重大风险", 
    		                 "color": "#F5A623",
    		                 "icon": "circle"
    		              },
    		              {
    		            	  "name": "较大风险", 
      		               	  "color": "#4AA3E2", 
    		            	  "icon": "circle"
    		              },
    		              {
    		            	  "name": "一般风险", 
      		                   "color": "#ED5851", 
    		            	  "icon": "circle"
    		              },
    		              {
    		            	  "name": "低风险", 
      		                   "color": "#F8E71C", 
    		            	  "icon": "circle"
    		              }
    		        ]
//    		    	,
//    		        formatter: function(name) {
//    		        	var curPer = "", curCnt = "";
//    		        	if (0 == totalfx) {
//    		        		curPer = "0";
//    		        		curCnt = "0";
//    		        	} else {
//    		        		if ("重大风险" == name) {
//    		        			curPer = ((zdfx / totalfx).toFixed(2) * 100).toFixed(0);
//    		        		} else if ("较大风险" == name) {
//    		        			curPer = ((jdfx / totalfx).toFixed(2) * 100).toFixed(0);
//    		        		} else if ("一般风险" == name) {
//    		        			curPer = ((ybfx / totalfx).toFixed(2) * 100).toFixed(0);
//    		        		} else if ("低风险" == name) {
//    		        			curPer = ((dfx / totalfx).toFixed(2) * 100).toFixed(0);
//    		        		}
//    		        	}
//    		        	return name + " " + curCnt + " | " + curPer + "%";
//    		        }
    		    },
    		    series: [
    		        {
    		            name:'风险类别',
    		            center : ['30%', '50%'],
    		            type:'pie',
    		            selectedMode: 'single',
    		            itemStyle: {
    		                    normal: {
    		                        color: function(params) {
    		                            var colorList = [
    		                                 '#F5A623','#4AA3E2','#ED5851','#F8E71C'
    		                            ];
    		                            return colorList[params.dataIndex]
    		                        }
    		             }
    		            },
    		            radius: [0, '30%'],

    		            label: {
    		                normal: {
    		                	show:false,
    		                    position: 'inner'
    		                }
    		            },
    		            labelLine: {
    		                normal: {
    		                    show: false
    		                }
    		            },
    		            data:classValue1
    		        },
    		        {
    		            name:'风险类别',
    		            center : ['30%', '50%'],
    		            type:'pie',
    		            itemStyle: {
    	                    normal: {
    	                        color: function(params) {
    	                            var colorList = [
    	                              '#53CFB3','#4990E2','#A28EC3','#F8E81C','#F6A623','#ED5851','#7ED321','#F5A623','#F8E71C','#4AA3E2',
    	                              '#FF3726','#E200FF','#00BFFF','#F5A623','#FF3636','#72D628','#FF6600','#6600FF','#3366FF','#FF480C'
    	                            ];
    	                            return colorList[params.dataIndex]
    	                        }
    	                    }
    		            },
    	            	radius: ['50%', '80%'],

    		            data:classValue2
    		        }
    		    ]
    		};
    	echart.setOption(option);
    	$(window).resize(function(){
        	var width = $(window).innerWidth();
        	width = (width-80)/3;
        	echart.resize();
        });
    }
    
    $(window).resize(function(){
//        yhzglCharts.resize();
//        zxjcCharts.resize();
//        sbglCharts.resize();
        zclCharts.resize();
        gzlCharts.resize();
        bjlCharts.resize();
        cslCharts.resize();
        bjfxCharts.resize();
//        yhztCharts.resize();
//        yhjbCharts.resize();
//        sbztCharts.resize();
    })

})

//-------------应急资源---------------------------------------------------------------
function yjzyCnt() {
//	var yjzyChrt = window.allEchartsDic.get("yjzyChrt");
//	if (!yjzyChrt) {
		yjzyChrt = echarts.init(document.getElementById("yjzyChrt"));
//		window.allEchartsDic.put("yjzyChrt", yjzyChrt);
//	} 
	
	yjzyChrt.showLoading({
	    text: '正在努力的读取数据中...',    //loading话术
	});
	
	$.ajax({
		type : 'post',
		url : BASE_URL + '/ems/emswelconme/loadResourceInfo',
		cache : false,
		data :{},
		dataType : 'json',
		global : false,
		success : function(retData) {
			if (retData) {
//				console.log(retData);
				var totalYjzy = (retData.data)[0] + (retData.data)[1] + 
								(retData.data)[2] + (retData.data)[3] + 
								(retData.data)[4] + (retData.data)[5] + 
								(retData.data)[6] + (retData.data)[7] +
								(retData.data)[8];
				//展示应急救援饼状图
				yjzyChrt.hideLoading();
            	var yjzyChrtOption = {
            			title: {
            				show: false,
            		        text: '应急资源',
            		        x: 90,
            		        y: 0,
            		        itemGap: 0,
            		        textStyle : {
//            		            color : 'rgba(30,144,255,0.8)',
            		            fontFamily : '微软雅黑',
            		            fontSize : 20,
            		            fontWeight : 'bolder'
            		        }
            		    },
            		    tooltip : {
            		        trigger: 'item',
            		        formatter: "{a} <br/>{b} : {c} ({d}%)"
            		    },
            		    legend: {
            		    	orient : 'vertical',
            		        x : 'right',
            		        y : 'center',
            		        itemGap: 32,
             		        itemWidth: 8,
             		        itemHeight: 8,
             		       	data: [
           		              {
           		                 "name": "应急机构", 
           		                 "color": "rgba(0,0,0,0.65)",
           		                 "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急队伍", 
              		               	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急专家", 
              		                   "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急仓库", 
              		                   "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "应急物资", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "医疗机构", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "避难场所", 
              		                  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "运输保障", 
           		            	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              },
           		              {
           		            	  "name": "通信保障", 
           		            	  "color": "rgba(0,0,0,0.65)", 
           		            	  "icon": "circle"
           		              }
           		            ],
            		        formatter: function(name) {
            		        	var curPer = "", curCnt = "";
            		        	if (0 == totalYjzy) {
            		        		curCnt = "0";
            		        		curPer = "0";
            		        	} else {
            		        		if ("应急机构" == name) {
            		        			curCnt = (retData.data)[0];
            		        			curPer = (((retData.data)[0] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急队伍" == name) {
            		        			curCnt = (retData.data)[1];
            		        			curPer = (((retData.data)[1] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急专家" == name) {
            		        			curCnt = (retData.data)[2];
            		        			curPer = (((retData.data)[2] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急仓库" == name) {
            		        			curCnt = (retData.data)[3];
            		        			curPer = (((retData.data)[3] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("应急物资" == name) {
            		        			curCnt = (retData.data)[4];
            		        			curPer = (((retData.data)[4] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("医疗机构" == name) {
            		        			curCnt = (retData.data)[5];
            		        			curPer = (((retData.data)[5] / totalYjzy) * 100).toFixed(0);
            		        		} else if ("避难场所" == name) {
            		        			curCnt = (retData.data)[6];
            		        			curPer = (((retData.data)[6] / totalYjzy) * 100).toFixed(0);
            		        		}  else if ("运输保障" == name) {
            		        			curCnt = (retData.data)[7];
            		        			curPer = (((retData.data)[7] / totalYjzy) * 100).toFixed(0);
            		        		}  else if ("通信保障" == name) {
            		        			curCnt = (retData.data)[8];
            		        			curPer = (((retData.data)[8] / totalYjzy) * 100).toFixed(0);
            		        		} 
            		        	}
            		        	
//            		        	return name + " " + curCnt + " | " + curPer + "%";
//            		        	return name + " " + curCnt;
            		        	return name;
            		        }
            		    },
            		    toolbox: {
            		    	 show : false,
            		         feature : {
            		             mark : {show: true},
            		             dataView : {show: true, readOnly: false},
            		             magicType : {
            		                 show: true, 
            		                 type: ['pie', 'funnel']
            		             },
            		             restore : {show: true},
            		             saveAsImage : {show: true}
            		         }
            		    },
            		    calculable : true,
            		    series : [
            		        {
            		            name:'应急资源分布图',
            		            type:'pie',
            		            center : ['32%', '58%'],
            		            radius : [35, 80],
            		            roseType : 'area',
            		            itemStyle : {
            		                normal : {
            		                    label : {
            		                        show : true,
            		                        position: 'top',
//            		                        formatter: '{b} : {d}%'
            		                        formatter: '{b}'
            		                    },
            		                    labelLine : {
            		                        show : true
            		                    },
            		                    color: function(params) {
            	                        	var tgtColor = "";
            	                        	if ("应急机构" == params.name) {
            	                        		tgtColor = "#FF3726";
            	                        	} else if ("应急队伍" == params.name) {
            	                        		tgtColor = "#E200FF";
            	                        	} else if ("应急专家" == params.name) {
            	                        		tgtColor = "#13C2C2";
            	                        	} else if ("应急仓库" == params.name) {
            	                        		tgtColor = "#F8E71C";
            	                        	}  else if ("应急物资" == params.name) {
            	                        		tgtColor = "#F5A623";
            	                        	}  else if ("医疗机构" == params.name) {
            	                        		tgtColor = "#F04864";
            	                        	}  else if ("避难场所" == params.name) {
            	                        		tgtColor = "#2FC25B";
            	                        	}  else if ("运输保障" == params.name) {
            	                        		tgtColor = "#8543E0";
            	                        	}  else if ("通信保障" == params.name) {
            	                        		tgtColor = "#1890FF";
            	                        	}
//            	                        	alert(JSON.stringify(params));
            	                            return tgtColor;
            	                        }
            		                },
            		                emphasis : {
            		                    label : {
            		                        show : true,
            		                        position : 'center',
            		                        textStyle : {
            		                            fontSize : '12'
//            		                            fontWeight : 'bold'
            		                        }
            		                    },
            		                    labelLine : {
            		                        show : true,
            		                        lineStyle: {
            		                        }
            		                    }
            		                }
            		            },
            		            data: [
            		                {value:(retData.data)[0] , name:'应急机构'},
            		                {value:(retData.data)[1], name:'应急队伍'},
            		                {value:(retData.data)[2], name:'应急专家'},
            		                {value:(retData.data)[3], name:'应急仓库'},
            		                {value:(retData.data)[4], name:'应急物资'},
            		                {value:(retData.data)[5], name:'医疗机构'},
            		                {value:(retData.data)[6], name:'避难场所'},
            		                {value:(retData.data)[7], name:'运输保障'},
            		                {value:(retData.data)[8], name:'通信保障'}
            		            ]
            		        }
            		    ]
            	};
            	
            	yjzyChrt.setOption(yjzyChrtOption, true);
            	
            	$(window).resize(function() {
            		yjzyChrt.resize();
				});
			}
		}
	});
}

//隐患排查统计
function entCount(searchtime){
	var yhzglCharts = echarts.init(document.getElementById('yhzglCharts'));
	var yhzglOpt ={};
	var CHECKRATE = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "hidden/hidcount/entcountlist",
        data:{searchtime:searchtime},
        success: function (res) {
        	$('#yhpcCounts a').html(res.entHidCount.HIDCOUNT?res.entHidCount.HIDCOUNT:0);
            $('#qcyhCounts a').html(res.entHidCount.CHECKHID?res.entHidCount.CHECKHID:0);
            CHECKRATE = res.entHidCount.CHECKRATE?res.entHidCount.CHECKRATE.toFixed(0):0;
            yhzglOpt = {
                    title: {
                        text: '隐患整改率',
                        x: 'center',
                        y: '15%',
                        //正标题样式
                        textStyle: {
                            fontSize: 14,
                            color: 'rgba(0,0,0,.45)'
                        }
                    },
                    animation: false,
                    tooltip: {
                        trigger: 'axis',
                        show: false, //default true
                        showDelay: 0,
                        hideDelay: 50,
                        transitionDuration: 0,
                        borderRadius: 8,
                        borderWidth: 2,
                        padding: 10, // [5, 10, 15, 20]
                    },
                    series: [
                        {
                            type: 'pie',
                            center: [
                                '50%', '58%'
                            ], //圆心坐标（div中的%比例）
                            radius: [
                                20, 45
                            ], //半径
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    position: 'center',
                                    show: false,
                                    textStyle: {
                                        fontSize: '14',
                                        color: 'rgba(0,0,0,.85)',
                                        fontWeight: 'bold'
                                    },
                                    formatter: '{b}\n{c}%'
                                }
                            },
                            data: [
                                {
                                    name: '',
                                    value: CHECKRATE,
                                    label: {
                                        normal: {
                                            show: true
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#F5A623'
                                        },
                                        emphasis: {
                                            color: '#F5A623'
                                        }
                                    }
                                }, {
                                    name: '',
                                    value: (100 - CHECKRATE),
                                    lacbel: {},
                                    itemStyle: {
                                        normal: {
                                            color: '#f4f6f8'
                                        },
                                        emphasis: {
                                            color: '#f4f6f8'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            yhzglCharts.setOption(yhzglOpt);
            $(window).resize(function() {
            	yhzglCharts.resize();
			});
        }
    });
}

//在线监测报警统计
function alarmCount(searchtime){
	var zxjcCharts = echarts.init(document.getElementById('zxjcCharts'));
	var zxjcOpt ={};
	var HANDLERATE = 0;
    $.ajax({
        type: "post",
        url: BASE_URL + "monitor/macprobe/alarmcount",
        data:{searchtime:searchtime},
        success: function (res) {
        	$('#jcdwCounts a').html(res.probeAlarmCount.RELATIMEALARM?res.probeAlarmCount.RELATIMEALARM:0);
        	$('#bjzsCounts a').html(res.probeAlarmCount.ALARMCOUNT?res.probeAlarmCount.ALARMCOUNT:0);
            $('#clbjCounts a').html(res.probeAlarmCount.HANDLEALARMCOUNT?res.probeAlarmCount.HANDLEALARMCOUNT:0);
            HANDLERATE = res.probeAlarmCount.HANDLERATE?res.probeAlarmCount.HANDLERATE.toFixed(0):0;
            zxjcOpt = {
                    title: {
                        text: '报警处理率',
                        x: 'center',
                        y: '15%',
                        //正标题样式
                        textStyle: {
                            fontSize: 14,
                            color: 'rgba(0,0,0,.45)'
                        }
                    },
                    animation: false,
                    tooltip: {
                        trigger: 'axis',
                        show: false, //default true
                        showDelay: 0,
                        hideDelay: 50,
                        transitionDuration: 0,
                        borderRadius: 8,
                        borderWidth: 2,
                        padding: 10, // [5, 10, 15, 20]
                    },
                    series: [
                        {
                            type: 'pie',
                            center: [
                                '50%', '58%'
                            ], //圆心坐标（div中的%比例）
                            radius: [
                                20, 45
                            ], //半径
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    position: 'center',
                                    show: false,
                                    textStyle: {
                                        fontSize: '14',
                                        color: 'rgba(0,0,0,.85)',
                                        fontWeight: 'bold'
                                    },
                                    formatter: '{b}\n{c}%'
                                }
                            },
                            data: [
                                {
                                    name: '',
                                    value: HANDLERATE,
                                    label: {
                                        normal: {
                                            show: true
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#F04864'
                                        },
                                        emphasis: {
                                            color: '#F04864'
                                        }
                                    }
                                }, {
                                    name: '',
                                    value: (100 - HANDLERATE),
                                    lacbel: {},
                                    itemStyle: {
                                        normal: {
                                            color: '#f4f6f8'
                                        },
                                        emphasis: {
                                            color: '#f4f6f8'
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            zxjcCharts.setOption(zxjcOpt);
            $(window).resize(function() {
            	zxjcCharts.resize();
			});
        }
    });
}

//  隐患排查
function hidCount(searchtime){
    var yhztCharts = echarts.init(document.getElementById('yhztCharts'));
    var yhjbCharts = echarts.init(document.getElementById('yhjbCharts'));
    var yhztOpt = {};
    var yhjbOpt = {};
    $.ajax({
        type: "post",
        data:{searchtime:searchtime},
        url: BASE_URL + "hid/welcome/loadEntHidCount",
        success: function (res) {
            $('#yhs').html(res.yhzscount);
            $('#yzg').html(res.yhzgcount);
            $('#wzg').html(res.yhwzgcount);
            $('#zgl').html(res.reformrate.toFixed(0));
            yhztOpt = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {           
                        type : 'shadow' 
                    }
                },
                toolbox: {
                    show : false,
                    orient: 'vertical',
                    x: 'right',
                    y: 'middle'
                },
                calculable : true,
                grid: {
                    x: 30,
                    x2: 20,
                    y: 30,
                    y2: 20
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['未整改', '待复查', '待核销', '已整改'],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: ['#ddd'],
                                width: 2
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(0,0,0,0.65)'
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name: '数量（个）',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: ['rgba(0,0,0,0.10)'],
                                width: 1,
                                type: 'dashed'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: 'rgba(0,0,0,0.65)'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '隐患数量',
                        type: 'bar',
                        barWidth: '50%',
                        data:res.hidStateList,
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    var tgtColor = "";
                                    if ("未整改" == params.name) {
                                        tgtColor = "#F5222D";
                                    } else if ("待复查" == params.name) {
                                        tgtColor = "#FAAD14";
                                    } else if ("待核销" == params.name) {
                                        tgtColor = "#1890FF";
                                    } else if ("已整改" == params.name) {
                                        tgtColor = "#52C41A";
                                    }  
                                    return tgtColor;
                                }
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c} '
                            },
                            emphasis: {             
                                show: true,
                                textStyle: {
                                    color: '#666666',
                                    fontSize: '11',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    }
                ]
            };
            yhjbOpt = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                   show:false,
                },
                series: [
                    {
                        name: '隐患级别',
                        type: 'pie',
//                        radius: [
//                            '50%', '70%'
//                        ],
                        radius:'55%',
                        center: [ '45%', '50%' ],
//                        avoidLabelOverlap: false,
//                        label: {
//                            normal: {
//                                show: false,
//                                position: 'center'
//                            },
//                            emphasis: {
//                                show: false,
//                                textStyle: {
//                                    fontSize: '30',
//                                    fontWeight: 'bold'
//                                }
//                            }
//                        },
//                        labelLine: {
//                            normal: {
//                                show: false
//                            }
//                        },
                        data: [
                            {
                                value: res.hidLvlList[1],
                                name: '重大隐患'
                            }, {
                                value: res.hidLvlList[0],
                                name: '一般隐患'
                            }
                        ]
                    }
                ],
                color: ['#F5222D', '#1890FF']
            };
            yhztCharts.setOption(yhztOpt);
            yhjbCharts.setOption(yhjbOpt);
        }
    })
}

//隐患列表
function displayHidCountList(hiddendangerstate){
	var searchtime = $("#yhpctime").val();
	parent.openWin(BASE_URL+'views/module/hidden/hiddendanger/entHidList.html?hiddendangerstate='+hiddendangerstate+'&searchtime='+searchtime,
			'隐患列表','70%','65%');
}
//隐患列表
function displayHidList(hiddendangerstate){
	var searchtime = $("#yhtjtime").val();
	parent.openWin(BASE_URL+'views/module/hidden/hiddendanger/entHidList.html?hiddendangerstate='+hiddendangerstate+'&searchtime='+searchtime,
			'隐患列表','70%','65%');
}

//监测报警
function displayRelatimeList(stateArr){
	var searchtime = $("#zxjctime").val();
	parent.openWin(BASE_URL+'views/module/monitor/macrealtime/macEntRealtimeList.html?stateArr='+stateArr+'&isNew=1&searchtime='+searchtime,
			'探头信息','70%','65%');
}

//设备记录
function displayDeviceList(usestate){
	parent.openWin(BASE_URL+'views/module/monitor/macBook/entMacBookList.html?usestate='+usestate,
			'设备信息','70%','65%');
}
    
//维修记录
function displayMaintanList(){
	parent.openWin(BASE_URL+'views/module/monitor/macmaintan/entMaintanList.html',
			'维修记录','70%','65%');
}

//标定记录
function displayDemarcateList(){
	parent.openWin(BASE_URL+'views/module/monitor/macdemarcate/entDemarcateList.html',
			'标定记录','70%','65%');
}

//特种作业人员
function operatorList(){
	parent.openWin(BASE_URL+'views/module/enterprise/entperson/entOperatorList.html',
			'特种作业人员','70%','65%');
}
//安全管理人员
function safemanagerList(){
	parent.openWin(BASE_URL+'views/module/enterprise/entperson/entSafemanagerList.html',
			'安全生产管理人员','70%','65%');
}
//安全生产责任人员
function safepersonList(){
	parent.openWin(BASE_URL+'views/module/enterprise/entperson/entSafepersonList.html',
			'安全生产责任人员','70%','65%');
}    

function displayHandleAlarmList(handlestatus){
	var searchtime = $("#zxjctime").val();
	parent.openWin(BASE_URL+'views/module/monitor/macalarmmonitor/handleAlarmList.html?handlestatus='+handlestatus+'&searchtime='+searchtime,
			'处理报警','70%','65%');
}

function displayHandleList(){
	var searchtime = $("#zxjctime").val();
	parent.openWin(BASE_URL+'views/module/monitor/macalarmmonitor/handleAlarmList.html?searchtime='+searchtime,
			'处理报警','70%','65%');
}

//风险信息
function showDssInfo(riskrating){
	parent.openWin(BASE_URL + "views/module/dangersource/dssrskrecord/entdssrskCountList.html?riskrating=" + riskrating,
            "风险列表", "60%", "70%");
}

//
function displayMacList(placeareaid,stateArr){
	parent.openWin(BASE_URL+'views/module/monitor/macrealtime/macEntRealtimeList.html?stateArr='+stateArr+'&placeareaid='+placeareaid+'&isNew=1',
			'实时监测','70%','65%');
}
    