/**
 * 备注： GIS首页监测点位也已复用该js库，改动时请及时告知大家 20180112
 */
var monitordatas={};

/*
 * 根据查询条件获得企业信息
 * */
monitordatas.getEnterprises=function(entname,districtcode){
	
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadentBusinessPage',
		cache : false,
		dataType : 'json',
		data : {"entName":entname,"districtcode":districtcode},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				window.wxc.xcConfirm("没有企业！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data = map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

/*
 * 根据企业id获得视频和探头数据
 * */
monitordatas.getVideoAndProbe=function(id){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadMacVideoAndProbe',
		cache : false,
		dataType : 'json',
		data : {"businessinfoid":id},
		global : false,
		async : false,
		success : function(map) {
			if(map.videoList.length == 0 || map.videoList == null){
				$("#content").html("该企业下没有摄像头!");
//				window.wxc.xcConfirm("该企业没有视频或探头数据！", window.wxc.xcConfirm.typeEnum.info);
				return;
			}else{
				data = map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

/*
 * 根据企业ID获取未绑定视频的探头信息
 * */
monitordatas.loadMacProbByBusinfo=function(businessid){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadMacProbByBusinfo',
		cache : false,
		dataType : 'json',
		data : {"businessinfoid":businessid},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该企业没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data = map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

/*
 * 根据企业ID获取探头列表,每个探头包括和它关联的视频信息 新需求
 * */
monitordatas.loadMacProbeList=function(businessid,state){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadMacProbeList',
		cache : false,
		dataType : 'json',
		data : {"businessinfoid":businessid,"state":state},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该企业没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data = map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}


/*
 * 根据videoID获取探头列表,关联的视频信息 新需求
 * */
monitordatas.loadVideoInfo=function(videoid, callBack){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadVideoInfo',
		cache : false,
		dataType : 'json',
		data : {"videoid":videoid},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该video没有数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data = map;
				if (callBack) {
					callBack(data);
				}
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
/*
 * 根据探头id，探头获取到的浓度值
 * */
monitordatas.loadRealChroByProbe=function(probeId,type,start,end){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadRealChroByProbe',
		cache : false,
		dataType : 'json',
		data : {"probeId":probeId,"type":type,"start":start,"end":end},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该视频没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data=map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

/*
 * 根据视频id，获取与该视频关联的探头获取到的浓度值
 * */
monitordatas.loadProbeChroList=function(videoId){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadProbeChroList',
		cache : false,
		dataType : 'json',
		data : {"videoId":videoId},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该视频没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data=map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}


/*
 * 获得报警数目
 * */
monitordatas.getAlarmCount=function(districtcode){
	var count;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/getAlarmCount',
		cache : false,
		dataType : 'json',
		data : {"districtcode":districtcode},
		global : false,
		async : false,
		success : function(num) {
			count=num;
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
			count=0;
		}
	});
	return count;
}

monitordatas.loadArarmList=function(districtcode){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadArarmList',
		cache : false,
		dataType : 'json',
		data : {"districtcode":districtcode},
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该视频没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data=map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

monitordatas.updateErsure=function(businessinfoid){
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/updateErsure',
		cache : false,
		data:{"businessinfoid":businessinfoid},
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			console.log("消音成功！")
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
}

monitordatas.loadStateTJ=function(businessinfoid){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadStateTJ',
		cache : false,
		data:{"businessinfoid":businessinfoid},
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该视频没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data=map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}

monitordatas.loadStateTJByProbe=function(probeid){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadStateTJByProbe',
		cache : false,
		data:{"probeid":probeid},
		dataType : 'json',
		global : false,
		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
				//window.wxc.xcConfirm("该视频没有探头数据！", window.wxc.xcConfirm.typeEnum.info);
			}else{
				data=map;
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}
//根据企业id获取企业信息
monitordatas.loadEntByid=function(businessinfoid, callBack){
	var data;
	$.ajax({
		type :'post',
		url : BASE_URL+'/monitor/macmonitormap/loadEntbusiness',
		cache : false,
		data:{"businessinfoid":businessinfoid},
		dataType : 'json',
//		global : false,
//		async : false,
		success : function(map) {
			if(map.length == 0 || map ==null){
			}else{
				data = map;
				if (callBack) {
					callBack(data);
				}
			}
		},
		error : function(err) {
			//window.wxc.xcConfirm("服务出错，请与管理员联系！", window.wxc.xcConfirm.typeEnum.warning);
		}
	});
	return data;
}