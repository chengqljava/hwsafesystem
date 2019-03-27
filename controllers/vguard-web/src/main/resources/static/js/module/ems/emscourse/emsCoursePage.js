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
			
			var volist = data.voList;
			
			if (volist.length > 0) {
				$.each(volist, function(index, vo) {
					if (vo.type == "01") {
						var zsjjDiv = '<p>接警标题：'+vo.title +'<br/>接警人：'+
						vo.policeofficername +'<br/>报警人：'+
						vo.alarmperson+'<br/>报警人电话：'+
						vo.alarmphone+'</p>';
						
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-picture">'+
									'<img src="../../../../images/ems/emscourse/microphone-FontAwesome.svg" alt="Picture">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>值守报警</h2>'+
										zsjjDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "02") {
						var event = vo.event;
						console.log(vo);
						$("#eventid").val(event.eventid);
						var sgxxDiv = '<p>'+
						'事故标题：'+event.eventname +
						'<br/>发生地址：'+event.address +
						'<br/>事故类型：'+vo.modetype +
						'<br/>事故等级：'+SelectOption.getAcclevel(event.eventlevel) + 
						'<br/>伤亡情况：'+event.casualty + 
						'</p>';
						
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-movie">'+
									'<img src="../../../../images/ems/emscourse/FileText-FontAwesome.svg" alt="Movie">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>事故信息</h2>'+
										sgxxDiv + '<a href="#" onclick="openEventInfo();" class="cd-read-more">查看更多</a>'+
									'<span class="cd-date">'+getSmpFormatDateByLong(event.time, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "03") {
						var sgmnDiv = '<p>'+
						'分析模型：'+vo.modetype+'<br/>'+
						'危化品：'+vo.leakage +'<br/>'+
						'初始半径(km)：'+vo.radius +'<br/>'+
						'操作人：'+(vo.creater == null ? '--':vo.creater)+
						'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-retweet">'+
									'<img src="../../../../images/ems/emscourse/retweet-FontAwesome.svg" alt="retweet">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>事故模拟</h2>'+
										sgmnDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.comportime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "04") {
						var zhycDiv = '<p>'+
						'预测标题：'+vo.title +'<br/>'+
						'操作人：'+(vo.creater == null ? '--':vo.creater) +
						'</p>';
						
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-LineChart">'+
									'<img src="../../../../images/ems/emscourse/LineChart-FontAwesome.svg" alt="LineChart">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>综合预测</h2>'+
									zhycDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "05") {
						var zypgDiv = '<p>'+
							'分析半径(km)：'+vo.radius +'<br/>'+
							'操作人：'+(vo.creater == null ? '--':vo.creater)+
							'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-PieChart">'+
									'<img src="../../../../images/ems/emscourse/PieChart-FontAwesome.svg" alt="PieChart">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>资源评估</h2>'+
										zypgDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "06") {
						var znfaDiv = '<p>'+
						'方案名称：'+vo.schemename +'<br/>'+
						'方案编号：'+vo.schemecode+'<br/>'+
						'操作人：'+ (vo.creater == null ? '--':vo.creater) +
						'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-Sitemap">'+
									'<img src="../../../../images/ems/emscourse/Sitemap-FontAwesome.svg" alt="Sitemap">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>智能方案</h2>'+
									znfaDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "07") {
						var yjrwDiv = '<p>'+
						'任务内容：'+vo.content+'<br/>'+
						'任务下达者：'+ vo.sender +'<br/>'+
						'任务接收者：'+ vo.receiver +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-list-alt">'+
									'<img src="../../../../images/ems/emscourse/list-alt-FontAwesome.svg" alt="list-alt">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>应急任务</h2>'+
									yjrwDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "08") {
						var rwfkDiv = '<p>'+
						'反馈内容：'+vo.content+'<br/>'+
						'发送人：'+ vo.sender +'<br/>'+
						'接收人：'+ vo.receiver +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-StackExchange">'+
									'<img src="../../../../images/ems/emscourse/StackExchange-FontAwesome.svg" alt="StackExchange">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>任务反馈</h2>'+
									rwfkDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
					}
					if (vo.type == "09") {
						var czhpgDiv = '<p>'+
						'评估编号：'+vo.estimatenum+'<br/>'+
						'评估总分：'+ vo.estimatesum +'<br/>'+
						'评估人：'+ vo.creater +'<br/>'+
						'</p>';
						$('#cd-timeline').append('<div class="cd-timeline-block">'+
								'<div class="cd-timeline-img cd-Star">'+
									'<img src="../../../../images/ems/emscourse/Star-FontAwesome.svg" alt="Star">'+
								'</div>'+
								'<div class="cd-timeline-content">'+
									'<h2>处置后评估</h2>'+
									czhpgDiv + 
									'<span class="cd-date">'+getSmpFormatDateByLong(vo.createtime, true)+'</span>'+
								'</div>'+
								'</div>');
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
 * 切换事故
 * 
 * @returns
 */
function changeEvent() {
	window.top.GEventObject.die('LOAD_ENT_EVENT');
	window.top.GEventObject.on('LOAD_ENT_EVENT', function(eventid) {
		$("#eventid").val(eventid);
		$('#cd-timeline').html("");
		initPage();
	});
	parent.top.openWin(BASE_URL
			+ "/views/module/ems/emscourse/eventInfoList.html", "选择事故信息",
			"55%", "60%");
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