//拖拽方法实现
function drag(f,g){var c=document.documentElement.clientWidth||document.body.clientWidth;var h=document.documentElement.clientHeight||document.body.clientHeight;var g=g||{};var e=g.l||0;var a=g.r||c-f.offsetWidth;var j=g.t||0;var i=g.b||h-f.offsetHeight;var d=g.n||10;f.onmousedown=function(m){var l=m||event;var k=l.clientX-f.offsetLeft;var b=l.clientY-f.offsetTop;document.onmousemove=function(o){var n=o||event;var p=n.clientX-k;var q=n.clientY-b;if(p<=e){p=e}if(p>=a){p=a}if(q<=j){q=j}if(q>=i){q=i}f.style.left=p+"px";f.style.top=q+"px"};document.onmouseup=function(){document.onmousemove=null;document.onmouseup=null};return false}};

$(function() {
	var flag = 1;
	$('.arrow').on('click',function() {
		var display=$('.allContent').css('display');
		if(display == 'block') {
			$('.allContent').css('display','none');
			$('.arrow').css('background-image','url(../images/monitor/openBtn.png)');
		}else {
			$('.allContent').css('display','block');
			$('.arrow').css('background-image','url(../images/monitor/closeBtn.png)');
		}
	});
	$('.area2 li').click(function() {
	$('.allContent').css('display','block');
		$('.arrow').css('background-image','url(../images/monitor/closeBtn.png)');
		flag = 0;
	});
	$('.detectionAlarm').on('click',function() {
		if(flag == 1) {
			$('.detectionShow').css('display','block');
			flag = 0;
		}else {
			$('.detectionShow').css('display','none');
			flag = 1;
		}
	});
	

	//拖拽完成
/*	var oDiv = document.getElementById('box');
	var oParent = document.getElementById('tundra');
	var sent = {
		l : 0,
		r : oParent.offsetWidth - oDiv.offsetWidth,
		t : 0,
		b : oParent.offsetHeight - oDiv.offsetHeight,
		n : 10
	}

	drag(oDiv,sent);*/
	
	

});
//视频关闭
	$('.videoClose').on('click',function(event) {
		$('.videoPop').css('display','none');
	});

function showDiv() {
	$('.area2').css('display','none');
	$('#grid').css('display','none');
}

function showVideoAndProbe(id,entname,longitude,latitude){
	$('.allContent').css('display','block');
	$('.arrow').css('background-image','url(../images/monitor/closeBtn.png)');
	var searchResult=new SearchResult();
	//var datas=monitordatas.getVideoAndProbe(id);
	//var datas=monitordatas.loadMacProbeList(id);
	//if(datas==undefined||datas.length<=0)return;
	//searchResult._createVideoElement(datas,id);
	searchResult._refreshProbeList(id);
	$('.filter').val(entname);
	$('.area2').css('display','none');
	$('#grid').css('display','none');
}


/**
 * 点击左边行政机构
 * @param districtcode2
 * @param name
 * @param districtlevel
 */
function searchDistrict(districtcode,name,districtlevel){
	$("#districtcode").val(districtcode);

	var datas=monitordatas.getEnterprises('',$("#districtcode").val());
	
	app.dataToMap.setData(datas);
	app.dataToMap.clearAlarmData();
	app.monitorAlarm.refreshMonitorDatas();
	//var alarmList=monitordatas.loadArarmList($("#districtcode").val());
	//app.alarmDataToMap.clearData();
}
