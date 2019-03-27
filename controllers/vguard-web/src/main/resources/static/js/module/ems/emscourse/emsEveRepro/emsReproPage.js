$(function() {
	initPage();
});

function initPage() {
	$.ajax({
		type : "post",
		url : BASE_URL + "ems/eventcourse/loadEventcourse",
		dataType : "json",
		data : {
			eventid : $("#eventid").val()
		},
		success : function(data) {
			$('#cd-timeline').html("");
			var volist = data.voList;
			if (volist.length > 0) {
				var zsFlag = 0;
				var mnFlag = 0;
				var ycFlag = 0;
				var pgFlag = 0;
				var faFlag = 0;
				var rwFlag = 0;
				var fkFlag = 0;
				var czpgFlag = 0;
				$.each(volist, function(index, vo) {
					if (vo.type == "01") {
						if(zsFlag == 0){
							$('#zsjj').attr('href','#'+vo.contentid);
						}
						var policeofficername;
						if(vo.policeofficername != null){
							policeofficername = vo.policeofficername;
						} else {
							policeofficername = "--";
						}
						var zsjjDiv = '<p>接警标题：'+vo.title +'<br/>接警人：'+
						policeofficername +'<br/>报警人：'+
						vo.alarmperson+'<br/>报警人电话：'+
						vo.alarmphone+'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-picture">'+
									'<img src="../../../../images/ems/emscourse/microphone-FontAwesome.svg" alt="Picture">'+
								'</div>'+
								'<div data-kind="zsjj" class="cd-timeline-content active zsjj">'+
									'<h2>值守接警</h2>'+
										zsjjDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						zsFlag = 1;
					}
					if (vo.type == "02") {
						var event = vo.event;
						$('#sgxx').attr('href','#'+vo.contentid);
						$("#eventid").val(event.eventid);
						$("#evename").text(event.eventname);
						var sgxxDiv = '<p>'+
						'事故标题：'+event.eventname +
						'<br/>发生地址：'+event.address +
						'<br/>事故类型：'+vo.modetype +
						'<br/>事故等级：'+SelectOption.getAcclevel(event.eventlevel) + 
						'<br/>伤亡情况：'+event.casualty + 
						'</p>';
						
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-movie">'+
									'<img src="../../../../images/ems/emscourse/FileText-FontAwesome.svg" alt="Movie">'+
								'</div>'+
								'<div data-kind="sgxx" class="cd-timeline-content sgxx">'+
									'<h2>事故信息</h2>'+
										sgxxDiv + '<a href="#" onclick="openEventInfo();" class="cd-read-more">查看更多</a>'+
									'<span class="cd-date">'+getSmpFormatDateByLong(event.time, true)+'</span>'+
								'</div>'+
								'</div>');
						//初始化值守接警
						loadDutyAlarm(1);
					}
					if (vo.type == "03") {
						if(mnFlag == 0){
							$('#sgmn').attr('href','#'+vo.contentid);
						}
						var sgmnDiv = '<p>'+
						'分析模型：'+vo.modetype+'<br/>'+
						'危化品：'+vo.leakage +'<br/>'+
						'初始半径(km)：'+vo.radius +'<br/>'+
						'操作人：'+(vo.creater == null ? '--':vo.creater)+
						'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-retweet">'+
									'<img src="../../../../images/ems/emscourse/retweet-FontAwesome.svg" alt="retweet">'+
								'</div>'+
								'<div data-kind="sgmn" class="cd-timeline-content sgmn">'+
									'<h2>事故模拟</h2>'+
										sgmnDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.comportime, true)+'</span>'+
								'</div>'+
								'</div>');
						mnFlag = 1;
					}
					
					if (vo.type == "04") {
						if(ycFlag == 0){
							$('#zhyc').attr('href','#'+vo.contentid);
						}
						var zhycDiv = '<p>'+
						'预测标题：'+vo.title +'<br/>'+
						'操作人：'+(vo.creater == null ? '--':vo.creater) +
						'</p>';
						
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-LineChart">'+
									'<img src="../../../../images/ems/emscourse/LineChart-FontAwesome.svg" alt="LineChart">'+
								'</div>'+
								'<div data-kind="zhyc" class="cd-timeline-content zhyc">'+
									'<h2>综合预测</h2>'+
									zhycDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						ycFlag = 1;
					}
					
					if (vo.type == "05") {
						if(pgFlag == 0){
							$('#zypg').attr('href','#'+vo.contentid);
						}
						var zypgDiv = '<p>'+
							'分析半径(km)：'+vo.radius +'<br/>'+
							'操作人：'+(vo.creater == null ? '--':vo.creater)+
							'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-PieChart">'+
									'<img src="../../../../images/ems/emscourse/PieChart-FontAwesome.svg" alt="PieChart">'+
								'</div>'+
								'<div data-kind="zypg" class="cd-timeline-content zypg">'+
									'<h2>资源评估</h2>'+
										zypgDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						pgFlag = 1;
					}
					
					if (vo.type == "06") {
						if(faFlag == 0){
							$('#znfa').attr('href','#'+vo.contentid);
						}
						var znfaDiv = '<p>'+
						'方案名称：'+vo.schemename +'<br/>'+
						'方案编号：'+vo.schemecode+'<br/>'+
						'操作人：'+ (vo.creater == null ? '--':vo.creater) +
						'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-Sitemap">'+
									'<img src="../../../../images/ems/emscourse/Sitemap-FontAwesome.svg" alt="Sitemap">'+
								'</div>'+
								'<div data-kind="znfa" class="cd-timeline-content znfa">'+
									'<h2>智能方案</h2>'+
									znfaDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						faFlag = 1;
					}
					
					if (vo.type == "07") {
						if(rwFlag == 0){
							$('#yjrw').attr('href','#'+vo.contentid);
						}
						var yjrwDiv = '<p>'+
						'任务内容：'+vo.content+'<br/>'+
						'任务下达者：'+ vo.sender +'<br/>'+
						'任务接收者：'+ vo.receiver +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-list-alt">'+
									'<img src="../../../../images/ems/emscourse/list-alt-FontAwesome.svg" alt="list-alt">'+
								'</div>'+
								'<div data-kind="yjrw" class="cd-timeline-content yjrw">'+
									'<h2>应急任务</h2>'+
									yjrwDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						rwFlag = 1;
					}
					
					if (vo.type == "08") {
						if(fkFlag == 0){
							$('#rwfk').attr('href','#'+vo.contentid);
						}
						var rwfkDiv = '<p>'+
						'反馈内容：'+vo.content+'<br/>'+
						'发送人：'+ vo.sender +'<br/>'+
						'接收人：'+ vo.receiver +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-StackExchange">'+
									'<img src="../../../../images/ems/emscourse/StackExchange-FontAwesome.svg" alt="StackExchange">'+
								'</div>'+
								'<div data-kind="rwfk" class="cd-timeline-content rwfk">'+
									'<h2>任务反馈</h2>'+
									rwfkDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						fkFlag = 1;
					}
					
					if (vo.type == "09") {
						if(czpgFlag == 0){
							$('#rwfk').attr('href','#'+vo.contentid);
						}
						var czhpgDiv = '<p>'+
						'评估编号：'+vo.estimatenum+'<br/>'+
						'评估总分：'+ vo.estimatesum +'<br/>'+
						'评估人：'+ vo.creater +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div id="'+vo.contentid+'" class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-Star">'+
									'<img src="../../../../images/ems/emscourse/Star-FontAwesome.svg" alt="Star">'+
								'</div>'+
								'<div data-kind="shpg" class="cd-timeline-content shpg">'+
									'<h2>处置后评估</h2>'+
									czhpgDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
						czpgFlag = 1;
					}
				});
			}
		},
		error : function() {
			parent.toast("初始化信息加载失败!");
		}
	});
}

/**
 * 打开查看更多
 */
function openEventInfo() {
	parent.openWin(BASE_URL
			+ "/views/module/ems/emscourse/courseEventInfo.html?eventid="
			+ $("#eventid").val(), "事故详情", "50%", "50%");
}

/**
 * 获取当前url访问路径后缀参数值
 * 
 * @param name
 * @returns
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}